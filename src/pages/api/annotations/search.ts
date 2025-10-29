import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { Annotation, AnnotationSearchResponse } from '@/types/Annotation';

interface SearchAnnotationRequest {
  fromUser: string;
  aboutUser: string;
  prompt: string;
}

/**
 * API para busca inteligente em anotações usando IA
 * POST /api/annotations/search
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<AnnotationSearchResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido'
    });
  }

  try {
    const { fromUser, aboutUser, prompt }: SearchAnnotationRequest = req.body;

    // Validações básicas
    if (!fromUser || !aboutUser || !prompt) {
      return res.status(400).json({
        success: false,
        error: 'Todos os campos são obrigatórios'
      });
    }

    if (prompt.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Prompt deve ter pelo menos 10 caracteres'
      });
    }

    const hfToken = process.env.HUGGING_FACE_TOKEN;
    if (!hfToken) {
      return res.status(500).json({
        success: false,
        error: 'Token do Hugging Face não configurado'
      });
    }

    // Buscar todas as anotações do usuário sobre o outro usuário
    const client = await clientPromise;
    const db = client.db('portifolio');
    const annotationsCollection = db.collection('annotations');

    const annotations = await annotationsCollection
      .find({ 
        fromUser: fromUser,
        aboutUser: aboutUser
      })
      .sort({ createdAt: -1 })
      .toArray();

    if (annotations.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Nenhuma anotação encontrada para analisar',
        searchResults: 'Você ainda não tem anotações sobre essa pessoa. Comece criando algumas anotações para poder usar a busca inteligente!',
        relevantAnnotations: []
      });
    }

    // Construir contexto com todas as anotações para identificar as relevantes
    const annotationsContext = annotations
      .map((ann, index) => `${index + 1}. ${ann.content}`)
      .join('\n');

    const filterPrompt = `
Você é um assistente especializado em filtrar anotações relevantes.

ANOTAÇÕES DISPONÍVEIS:
${annotationsContext}

SOLICITAÇÃO DO USUÁRIO: "${prompt.trim()}"

INSTRUÇÕES:
1. Analise TODAS as anotações fornecidas
2. Identifique quais anotações são RELEVANTES para a solicitação do usuário
3. Responda APENAS com os NÚMEROS das anotações relevantes, separados por vírgula
4. Se nenhuma anotação for relevante, responda "NENHUMA"
5. Seja criterioso - inclua apenas anotações que realmente se relacionam com a solicitação

IMPORTANTE: Responda APENAS os números das anotações relevantes (ex: "1,3,5" ou "NENHUMA").
`;

    console.log('🔍 Prompt de filtro gerado para identificar anotações relevantes');

    // Primeiro: Chamar IA para identificar anotações relevantes
    const filterResponse = await fetch('https://router.huggingface.co/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'HuggingFaceH4/zephyr-7b-beta',
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente especializado em filtrar anotações relevantes. Seja preciso e responda APENAS com números ou "NENHUMA".'
          },
          {
            role: 'user',
            content: filterPrompt
          }
        ],
        max_tokens: 50,
        temperature: 0.1, // Muito baixa para respostas precisas
        stream: false
      })
    });

    if (!filterResponse.ok) {
      const errorData = await filterResponse.json().catch(() => ({}));
      console.error('Erro da API Hugging Face (Filtro):', errorData);
      
      return res.status(500).json({
        success: false,
        error: `Erro da API Hugging Face: ${filterResponse.status}`
      });
    }

    const filterData = await filterResponse.json();
    
    if (!filterData.choices || !filterData.choices[0] || !filterData.choices[0].message) {
      return res.status(500).json({
        success: false,
        error: 'Resposta inválida da API Hugging Face'
      });
    }

    const relevantNumbers = filterData.choices[0].message.content.trim();
    console.log('🤖 IA identificou anotações relevantes:', relevantNumbers);

    // Filtrar anotações baseadas na resposta da IA
    let filteredAnnotations: typeof annotations = [];
    
    if (relevantNumbers && relevantNumbers !== 'NENHUMA' && relevantNumbers !== 'nenhuma') {
      const numbers = relevantNumbers.split(',').map((n: string) => parseInt(n.trim())).filter((n: number) => !isNaN(n));
      filteredAnnotations = numbers
        .map((num: number) => annotations[num - 1]) // -1 porque a IA usa índices baseados em 1
        .filter((ann: Annotation) => ann); // Remove undefined
    }

    // Se encontrou anotações relevantes, gerar sugestão simples
    let suggestion = '';
    if (filteredAnnotations.length > 0) {
      const relevantContent = filteredAnnotations
        .map(ann => ann.content)
        .join('; ');

      const suggestionPrompt = `
Baseado nas seguintes informações sobre uma pessoa: "${relevantContent}"

E considerando a solicitação: "${prompt.trim()}"

Dê uma sugestão SIMPLES e PRÁTICA (máximo 2 frases) em português brasileiro.
`;

      try {
        const suggestionResponse = await fetch('https://router.huggingface.co/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${hfToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'HuggingFaceH4/zephyr-7b-beta',
            messages: [
              {
                role: 'system',
                content: 'Você é um assistente que dá sugestões práticas e simples em português brasileiro. Seja conciso e útil.'
              },
              {
                role: 'user',
                content: suggestionPrompt
              }
            ],
            max_tokens: 100,
            temperature: 0.4,
            stream: false
          })
        });

        if (suggestionResponse.ok) {
          const suggestionData = await suggestionResponse.json();
          if (suggestionData.choices && suggestionData.choices[0] && suggestionData.choices[0].message) {
            suggestion = suggestionData.choices[0].message.content.trim();
          }
        }
      } catch (error) {
        console.error('Erro ao gerar sugestão:', error);
        // Continua sem sugestão se der erro
      }
    }

    return res.status(200).json({
      success: true,
      message: `${filteredAnnotations.length} anotações relevantes encontradas`,
      searchResults: suggestion || (filteredAnnotations.length === 0 ? 'Nenhuma anotação relevante encontrada para essa busca.' : ''),
      relevantAnnotations: filteredAnnotations as unknown as Annotation[]
    });

  } catch (error) {
    console.error('Erro ao realizar busca inteligente:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}
