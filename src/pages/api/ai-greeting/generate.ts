import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

interface GreetingRequest {
  userName: string;
  userGender: 'MASC' | 'FEM';
  participants: string[];
}

interface GreetingResponse {
  success: boolean;
  greeting?: string;
  error?: string;
}

/**
 * API para gerar saudação personalizada usando Hugging Face Inference Providers
 * POST /api/ai-greeting/generate
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<GreetingResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido'
    });
  }

  try {
    const { userName, userGender, participants }: GreetingRequest = req.body;

    if (!userName || !userGender || !participants) {
      return res.status(400).json({
        success: false,
        error: 'Dados obrigatórios não fornecidos'
      });
    }

    const hfToken = process.env.HUGGING_FACE_TOKEN;
    if (!hfToken) {
      return res.status(500).json({
        success: false,
        error: 'Token do Hugging Face não configurado'
      });
    }

    // Coletar contexto das respostas de perguntas do dia
    const contextData = await collectGreetingContext(participants);

    // Construir prompt para saudação
    const prompt = buildGreetingPrompt(userName, userGender, contextData);

    console.log('Prompt de saudação gerado:', prompt);

    // Chamar Hugging Face Inference Providers
    const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
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
            content: 'Você é um assistente especializado em criar saudações DIVERTIDAS, RESPEITOSAS e CRIATIVAS em PORTUGUÊS DO BRASIL. Seja carismático, use humor leve e sempre mantenha um tom positivo e acolhedor. SEMPRE responda exclusivamente em português brasileiro, usando gírias e expressões naturais do Brasil.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.4, // Mais criatividade para saudações variadas
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

    const generatedGreeting = data.choices[0].message.content.trim();

    return res.status(200).json({
      success: true,
      greeting: generatedGreeting
    });

  } catch (error) {
    console.error('Erro ao gerar saudação:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}

/**
 * Coleta contexto das respostas de perguntas do dia para personalizar a saudação
 */
async function collectGreetingContext(participants: string[]) {
  try {
    const client = await clientPromise;
    const db = client.db('portifolio');
    const questionsCollection = db.collection('dailyQuestions');

    // Buscar as últimas 3 perguntas respondidas
    const recentQuestions = await questionsCollection
      .find({
        participants: { $all: participants },
        answers: { $exists: true, $not: { $size: 0 } }
      })
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray();

    return {
      recentAnswers: recentQuestions.map((q: any) => ({
        question: q.question,
        answers: q.answers.map((a: any) => ({
          username: a.username,
          answer: a.answer.substring(0, 100) // Apenas preview
        }))
      })),
      totalQuestionsAnswered: recentQuestions.length
    };
  } catch (error) {
    console.error('Erro ao coletar contexto de saudação:', error);
    return {
      recentAnswers: [],
      totalQuestionsAnswered: 0
    };
  }
}

/**
 * Constrói um prompt para gerar saudação personalizada
 */
function buildGreetingPrompt(userName: string, userGender: 'MASC' | 'FEM', contextData: any): string {
  const genderAdjective = userGender === 'FEM' ? 'a' : 'o';
  
  let prompt = `Crie uma saudação DIVERTIDA e RESPEITOSA para ${genderAdjective} ${userName}. `;
  
  // Contexto das respostas recentes
  if (contextData.recentAnswers && contextData.recentAnswers.length > 0) {
    prompt += `\\n\\n=== CONTEXTO DAS ÚLTIMAS RESPOSTAS ===\\n`;
    prompt += `${userName} respondeu ${contextData.totalQuestionsAnswered} pergunta(s) recentemente:\\n`;
    
    contextData.recentAnswers.forEach((qa: any, index: number) => {
      prompt += `${index + 1}. Pergunta: "${qa.question}"\\n`;
      const userAnswer = qa.answers.find((a: any) => a.username === userName);
      if (userAnswer) {
        prompt += `   Resposta d${genderAdjective} ${userName}: "${userAnswer.answer}"\\n`;
      }
    });
  }

  prompt += `\\n\\n=== INSTRUÇÕES PARA A SAUDAÇÃO ===\\n`;
  prompt += `Crie uma saudação que seja:\\n`;
  prompt += `✅ DIVERTIDA e CRIATIVA (use comparações engraçadas, metáforas legais)\\n`;
  prompt += `✅ RESPEITOSA e POSITIVA (sempre elogiosa e acolhedora)\\n`;
  prompt += `✅ PERSONALIZADA (use o nome ${userName} e seja específic${genderAdjective})\\n`;
  prompt += `✅ CURTA (máximo 2 frases)\\n`;
  prompt += `✅ VARIADA (seja original, evite clichês)\\n`;
  prompt += `\\n\\n⚠️ EVITE COMPLETAMENTE:\\n`;
  prompt += `- Falar sobre a noite fúria do brasil\\n`;
  prompt += `- Fazer associações erradas, como por exemplo, falar que alguém é o rei do futebol sendo que a pessoa só disse até agora que ela "gosta de futebol"\\n`;
  prompt += `\\n🎯 EXEMPLOS DO ESTILO DESEJADO:\\n`;
  prompt += `- "Olá ${userName}, como está ${genderAdjective} mais nova maravilha do mundo moderno hoje?"\\n`;
  prompt += `- "E aí ${userName}, chegou ${genderAdjective} person${genderAdjective} que faz o sol ter inveja do seu brilho!"\\n`;
  prompt += `- "${userName}! Que alegria ver ${genderAdjective} lenda viv${genderAdjective} em ação novamente!"\\n`;
  
  if (contextData.totalQuestionsAnswered > 0) {
    prompt += `\\n💡 DICA: Você pode fazer uma referência sutil e divertida às respostas recentes d${genderAdjective} ${userName}, mas mantenha o foco na saudação!\\n`;
  }
  
  prompt += `\\nCrie uma saudação nesse estilo: DIVERTIDA, RESPEITOSA e que faça ${genderAdjective} ${userName} sorrir! \\n\\n🇧🇷 IMPORTANTE: Responda EXCLUSIVAMENTE em PORTUGUÊS DO BRASIL, usando expressões e gírias brasileiras naturais. Responda APENAS com a saudação.`;

  return prompt;
}
