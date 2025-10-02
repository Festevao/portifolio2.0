import { NextApiRequest, NextApiResponse } from 'next';
import { GenerateQuestionRequest, HuggingFaceResponse } from '@/types/DailyQuestion';

/**
 * API para gerar pergunta do dia usando Hugging Face Inference Providers
 * POST /api/daily-question/generate
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<HuggingFaceResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido'
    });
  }

  try {
    const { participants, contextData }: GenerateQuestionRequest = req.body;

    if (!participants || participants.length !== 2) {
      return res.status(400).json({
        success: false,
        error: 'Deve haver exatamente 2 participantes'
      });
    }

    const hfToken = process.env.HUGGING_FACE_TOKEN;
    if (!hfToken) {
      return res.status(500).json({
        success: false,
        error: 'Token do Hugging Face não configurado'
      });
    }

    // Construir prompt contextual
    const prompt = buildContextualPrompt(participants, contextData);

    console.log('Prompt gerado:', prompt);

    // Chamar Hugging Face Inference Providers
    const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.2-3B-Instruct', // Modelo gratuito disponível
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente que cria perguntas LEVES e DIVERTIDAS para pessoas que estão se conhecendo. Evite perguntas profundas, terapêuticas ou sobre relacionamento. Foque em curiosidades, preferências, experiências engraçadas e gostos pessoais. Seja descontraído e jovial.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.8,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erro da API Hugging Face:', errorData);
      
      return res.status(500).json({
        success: false,
        error: `Erro da API Hugging Face: ${response.status}`
      });
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return res.status(500).json({
        success: false,
        error: 'Resposta inválida da API Hugging Face'
      });
    }

    const generatedQuestion = data.choices[0].message.content.trim();

    return res.status(200).json({
      success: true,
      question: generatedQuestion
    });

  } catch (error) {
    console.error('Erro ao gerar pergunta:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}

/**
 * Constrói um prompt contextual baseado nos dados dos usuários
 */
function buildContextualPrompt(participants: string[], contextData: any): string {
  const [user1, user2] = participants;
  
  let prompt = `Crie uma pergunta interessante e divertida para aproximar ${user1} e ${user2}. `;
  
  // Contexto detalhado de filmes/séries
  if (contextData.movies && contextData.movies.length > 0) {
    prompt += `\\n\\n=== FILMES E SÉRIES (${contextData.movies.length} recomendações) ===\\n`;
    contextData.movies.forEach((movie: any, index: number) => {
      prompt += `${index + 1}. "${movie.title}" (${movie.mediaType === 'movie' ? 'Filme' : 'Série'}) - Gêneros: ${movie.genres.join(', ')} - Nota: ${movie.voteAverage}/10`;
      if (movie.overview) {
        prompt += ` - Sinopse: ${movie.overview.substring(0, 100)}...`;
      }
      if (movie.observation) {
        prompt += ` - Observação: ${movie.observation}`;
      }
      prompt += ` (Indicado por ${movie.createdBy})\\n`;
    });
  }

  // Contexto detalhado de lugares/eventos
  if (contextData.places && contextData.places.length > 0) {
    prompt += `\\n\\n=== LUGARES E EVENTOS (${contextData.places.length} planejados) ===\\n`;
    contextData.places.forEach((place: any, index: number) => {
      prompt += `${index + 1}. Evento: "${place.title}"`;
      if (place.location && place.location.address) {
        prompt += ` - Local: ${place.location.address}`;
      }
      if (place.date) {
        const date = new Date(place.date);
        prompt += ` - Data: ${date.toLocaleDateString('pt-BR')}`;
      }
      if (place.description) {
        prompt += ` - Descrição: ${place.description}`;
      }
      prompt += ` (Criado por ${place.createdBy})\\n`;
    });
  }

  // Contexto detalhado de mensagens
  if (contextData.messages && contextData.messages.length > 0) {
    prompt += `\\n\\n=== ÚLTIMAS MENSAGENS (${contextData.messages.length} mensagens) ===\\n`;
    contextData.messages.forEach((message: any, index: number) => {
      const date = new Date(message.createdAt);
      prompt += `${index + 1}. ${message.sender} para ${message.recipient} (${date.toLocaleDateString('pt-BR')}): "${message.content}"`;
      if (message.hasImages) {
        prompt += ` [com fotos]`;
      }
      prompt += `\\n`;
    });
  }

  // Contexto detalhado de música
  if (contextData.music && contextData.music.length > 0) {
    prompt += `\\n\\n=== PLAYLISTS COMPARTILHADAS (${contextData.music.length} playlists) ===\\n`;
    contextData.music.forEach((playlist: any, index: number) => {
      prompt += `${index + 1}. Playlist compartilhada`;
      if (playlist.playlistUrl) {
        prompt += ` - URL: ${playlist.playlistUrl}`;
      }
      prompt += ` (Criada por ${playlist.createdBy})\\n`;
    });
  }

  // Perguntas anteriores para evitar repetição e usar como inspiração
  if (contextData.previousQuestions && contextData.previousQuestions.length > 0) {
    prompt += `\\n\\n=== PERGUNTAS ANTERIORES (para referência e inspiração, mas NÃO repita nem seja similar) ===\\n`;
    contextData.previousQuestions.forEach((pq: any, index: number) => {
      const date = new Date(pq.createdAt);
      prompt += `${index + 1}. "${pq.question}" (${date.toLocaleDateString('pt-BR')})`;
      if (pq.answer) {
        prompt += ` - Respondida: "${pq.answer.substring(0, 50)}..."`;
      }
      prompt += `\\n`;
    });
    prompt += `\\nUse essas perguntas anteriores como INSPIRAÇÃO para criar algo novo e diferente, mas NUNCA repita nem faça perguntas similares.\\n`;
  }

  prompt += `\\n\\n=== INSTRUÇÕES FINAIS ===\\n`;
  prompt += `Com base nessas informações sobre ${user1} e ${user2}, crie uma pergunta LEVE, DIVERTIDA e DESCONTRAÍDA. `;
  prompt += `\\n\\n⚠️ EVITE COMPLETAMENTE:\\n`;
  prompt += `- Perguntas sobre relacionamento, amor, sentimentos profundos\\n`;
  prompt += `- Tom terapêutico ou de autoajuda\\n`;
  prompt += `- Perguntas muito sérias ou filosóficas\\n`;
  prompt += `- Análises de personalidade ou comportamento\\n`;
  prompt += `\\n✅ FOQUE EM:\\n`;
  prompt += `- Preferências engraçadas ou curiosas\\n`;
  prompt += `- Experiências divertidas ou inusitadas\\n`;
  prompt += `- Gostos pessoais (comida, música, filmes, lugares)\\n`;
  prompt += `- Situações hipotéticas engraçadas\\n`;
  prompt += `- Curiosidades sobre infância, hobbies, manias\\n`;
  prompt += `- Perguntas "se você pudesse..." ou "qual seria..."\\n`;
  prompt += `\\n🎯 EXEMPLOS DO TOM DESEJADO:\\n`;
  prompt += `- "Se vocês fossem personagens de desenho animado, quais seriam?"\\n`;
  prompt += `- "Qual é a comida mais estranha que vocês já experimentaram?"\\n`;
  prompt += `- "Se pudessem ter um superpoder inútil, qual seria?"\\n`;
  prompt += `\\nCrie uma pergunta nesse estilo: LEVE, DIVERTIDA e que gere risadas! Responda APENAS com a pergunta.`;

  return prompt;
}
