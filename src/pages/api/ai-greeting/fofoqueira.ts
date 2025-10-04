import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

interface FofoqueiraModeRequest {
  userName: string;
  userGender: 'MASC' | 'FEM';
  participants: string[];
}

interface FofoqueiraModeResponse {
  success: boolean;
  greeting?: string;
  error?: string;
}

/**
 * API para gerar saudação no "MODO FOFOQUEIRA" 👀
 * A IA vai fuçar TODAS as informações e fazer comentários divertidos
 * POST /api/ai-greeting/fofoqueira
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<FofoqueiraModeResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido'
    });
  }

  try {
    const { userName, userGender, participants }: FofoqueiraModeRequest = req.body;

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

    // Coletar TODOS os dados disponíveis para a fofoca 👀
    const allData = await collectAllDataForGossip(participants);

    // Construir prompt fofoqueiro
    const fofoqueirasPrompt = buildFofoqueirasPrompt(userName, userGender, allData);

    console.log('🗣️ Prompt da fofoqueira gerado:', fofoqueirasPrompt.substring(0, 500) + '...');

    // Chamar Hugging Face com temperatura mais alta para mais criatividade
    const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/Meta-Llama-3-8B-Instruct',
        messages: [
          {
            role: 'system',
            content: 'Você é uma IA FOFOQUEIRA e DIVERTIDA que adora comentar sobre as atividades dos usuários de forma CARISMÁTICA e ENGRAÇADA! Seja como aquela amiga que sempre sabe de tudo e faz comentários hilários sobre a vida dos outros, mas sempre com CARINHO e DIVERSÃO. Use gírias brasileiras, seja EXPRESSIVA e faça observações PERSPICAZES sobre os dados que você tem. SEMPRE responda em português brasileiro com muito humor e personalidade!'
          },
          {
            role: 'user',
            content: fofoqueirasPrompt
          }
        ],
        max_tokens: 120, // Limitado para frases mais curtas
        temperature: 0.6, // Criativa mas não demais
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erro da API Hugging Face (Fofoqueira):', errorData);
      
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

    const fofoqueirasGreeting = data.choices[0].message.content.trim();

    return res.status(200).json({
      success: true,
      greeting: fofoqueirasGreeting
    });

  } catch (error) {
    console.error('Erro ao gerar fofoca:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}

/**
 * Coleta TODOS os dados possíveis para a fofoqueira fazer comentários 👀
 */
async function collectAllDataForGossip(participants: string[]) {
  try {
    const client = await clientPromise;
    const db = client.db('portifolio');
    
    // Todas as coleções
    const [
      questionsCollection,
      playlistCollection,
      placesCollection,
      moviesCollection,
      messagesCollection,
      usersCollection
    ] = await Promise.all([
      db.collection('dailyQuestions'),
      db.collection('sharedPlaylists'),
      db.collection('places'),
      db.collection('movieRecommendations'),
      db.collection('messages'),
      db.collection('users')
    ]);

    const participantsQuery = { participants: { $all: participants } };
    
    // Datas para filtros
    const today = new Date();
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Buscar TUDO em paralelo para a fofoca completa
    const [
      allQuestions,
      playlist,
      allPlaces,
      allMovies,
      allMessages,
      userProfiles,
      recentPlaces,
      recentMovies,
      recentMessages,
      todayMessages
    ] = await Promise.all([
      // TODAS as perguntas e respostas
      questionsCollection
        .find(participantsQuery)
        .sort({ createdAt: -1 })
        .toArray(),
      
      // Playlist compartilhada
      playlistCollection.findOne(participantsQuery),
      
      // TODOS os lugares
      placesCollection
        .find(participantsQuery)
        .sort({ createdAt: -1 })
        .toArray(),
      
      // TODOS os filmes
      moviesCollection
        .find(participantsQuery)
        .sort({ createdAt: -1 })
        .toArray(),
      
      // TODAS as mensagens
      messagesCollection
        .find(participantsQuery)
        .sort({ createdAt: -1 })
        .toArray(),
      
      // Perfis dos usuários
      usersCollection
        .find({ username: { $in: participants } })
        .toArray(),
      
      // Lugares da última semana
      placesCollection
        .find({
          ...participantsQuery,
          createdAt: { $gte: lastWeek }
        })
        .sort({ createdAt: -1 })
        .toArray(),
      
      // Filmes da última semana
      moviesCollection
        .find({
          ...participantsQuery,
          createdAt: { $gte: lastWeek }
        })
        .sort({ createdAt: -1 })
        .toArray(),
      
      // Mensagens da última semana
      messagesCollection
        .find({
          ...participantsQuery,
          createdAt: { $gte: lastWeek }
        })
        .sort({ createdAt: -1 })
        .toArray(),
      
      // Mensagens de hoje
      messagesCollection
        .find({
          ...participantsQuery,
          createdAt: { $gte: today }
        })
        .sort({ createdAt: -1 })
        .toArray()
    ]);

    // Processar dados para análise comportamental 🕵️‍♀️
    const stats = {
      totalQuestions: allQuestions.length,
      answeredQuestions: allQuestions.filter((q: any) => q.answers && q.answers.length > 0).length,
      totalPlaces: allPlaces.length,
      totalMovies: allMovies.length,
      totalMessages: allMessages.length,
      recentPlacesCount: recentPlaces.length,
      recentMoviesCount: recentMovies.length,
      recentMessagesCount: recentMessages.length,
      todayMessagesCount: todayMessages.length
    };

    // Análise de gêneros de filmes favoritos
    const movieGenres = allMovies.reduce((acc: any, movie: any) => {
      if (movie.genre) {
        acc[movie.genre] = (acc[movie.genre] || 0) + 1;
      }
      return acc;
    }, {});

    // Análise de tipos de lugares
    const placesAnalysis = allPlaces.map((place: any) => ({
      title: place.title,
      location: place.location?.name,
      hasDate: !!place.date,
      isRecent: place.createdAt > lastWeek
    }));

    // Padrões de comunicação
    const messagePatterns = {
      hasRecentActivity: recentMessages.length > 0,
      chattyToday: todayMessages.length > 3,
      averageMessageLength: allMessages.reduce((acc: number, msg: any) => acc + msg.content.length, 0) / (allMessages.length || 1)
    };

    return {
      userProfiles: userProfiles.map((user: any) => ({
        username: user.username,
        nome: user.nome,
        gender: user.gender
      })),
      stats,
      allQuestions: allQuestions.map((q: any) => ({
        question: q.question,
        hasAnswers: q.answers && q.answers.length > 0,
        answersCount: q.answers?.length || 0,
        isRecent: q.createdAt > lastWeek
      })),
      playlist: playlist ? {
        hasPlaylist: true,
        playlistId: playlist.playlistId,
        createdAt: playlist.createdAt
      } : { hasPlaylist: false },
      placesAnalysis,
      movieGenres,
      allMovies: allMovies.map((movie: any) => ({
        title: movie.title,
        type: movie.type,
        genre: movie.genre,
        addedBy: movie.addedBy,
        isRecent: movie.createdAt > lastWeek
      })),
      messagePatterns,
      recentActivity: {
        newPlaces: recentPlaces.length,
        newMovies: recentMovies.length,
        newMessages: recentMessages.length,
        todayActivity: todayMessages.length
      }
    };

  } catch (error) {
    console.error('Erro ao coletar dados para fofoca:', error);
    return {
      userProfiles: [],
      stats: {},
      allQuestions: [],
      playlist: { hasPlaylist: false },
      placesAnalysis: [],
      movieGenres: {},
      allMovies: [],
      messagePatterns: {},
      recentActivity: {}
    };
  }
}

/**
 * Constrói um prompt FOFOQUEIRO focado em um único assunto 👀
 */
function buildFofoqueirasPrompt(userName: string, userGender: 'MASC' | 'FEM', allData: any): string {
  const genderAdjective = userGender === 'FEM' ? 'a' : 'o';
  
  // Escolher UM assunto para focar (não misturar tudo)
  const topics = [];
  
  // Playlist
  if (allData.playlist && allData.playlist.hasPlaylist) {
    const otherUser = allData.userProfiles.find((u: any) => u.username !== userName.toLowerCase());
    const otherName = otherUser ? otherUser.nome.split(' ')[0] : 'seu parceiro';
    
    topics.push({
      type: 'playlist',
      data: `Tem uma playlist compartilhada com ${otherName} no Spotify`,
      example: `${userName}! 👀 Essa playlist que você e ${otherName} compartilham tá ficando interessante... alguém tá inspirado né? 🎵`,
      personal: true
    });
  }
  
  // Lugares recentes
  if (allData.recentActivity && allData.recentActivity.newPlaces > 0) {
    const recentPlacesList = allData.placesAnalysis
      .filter((p: any) => p.isRecent)
      .slice(0, 2)
      .map((p: any) => p.title)
      .join(' e ');
    
    topics.push({
      type: 'places',
      data: `Marcou ${allData.recentActivity.newPlaces} lugares novos essa semana${recentPlacesList ? `: ${recentPlacesList}` : ''}`,
      example: `${userName}, esses lugares que você andou marcando (${recentPlacesList || 'uns lugares bacanas'})... alguém tá inquieto né? 👀😏`,
      personal: true
    });
  }
  
  // Filmes/séries recentes
  if (allData.recentActivity && allData.recentActivity.newMovies > 0) {
    const topGenre = Object.entries(allData.movieGenres || {})
      .sort(([,a]: any, [,b]: any) => b - a)[0];
    
    const recentMovie = allData.allMovies
      .filter((m: any) => m.isRecent)[0];
    
    topics.push({
      type: 'movies',
      data: `Adicionou ${allData.recentActivity.newMovies} filme${allData.recentActivity.newMovies > 1 ? 's' : ''} essa semana${recentMovie ? ` (${recentMovie.title})` : ''}`,
      example: `${userName}, "${recentMovie?.title || 'esses filmes'}" que você andou adicionando... 🍿${topGenre ? ` sua vibe ${topGenre[0]} não tem fim né?` : ' tá diversificando o catálogo!'} 😂`,
      personal: true
    });
  }
  
  // Mensagens de hoje
  if (allData.messagePatterns && allData.messagePatterns.chattyToday) {
    const otherUser = allData.userProfiles.find((u: any) => u.username !== userName.toLowerCase());
    const otherName = otherUser ? otherUser.nome.split(' ')[0] : 'seu parceiro';
    
    topics.push({
      type: 'messages',
      data: `Está bem tagarela com ${otherName} hoje`,
      example: `${userName}, você e ${otherName} tão tagarelas hoje hein! 💬 Deve ter assunto bom por aí né? 👀`,
      personal: true
    });
  }
  
  // Total de coisas (fallback)
  if (topics.length === 0 && allData.stats) {
    if (allData.stats.totalPlaces > 3) {
      const favoritePlace = allData.placesAnalysis[0];
      topics.push({
        type: 'total_places',
        data: `Já tem ${allData.stats.totalPlaces} lugares na lista`,
        example: `${userName}, essa sua lista de ${allData.stats.totalPlaces} lugares... 👀${favoritePlace ? ` principalmente "${favoritePlace.title}" que tá lá há um tempo...` : ''} quando que sai do papel? 🗺️`,
        personal: true
      });
    }
  }
  
  // Se não tem nada interessante, usar fallback genérico
  if (topics.length === 0) {
    const otherUser = allData.userProfiles.find((u: any) => u.username !== userName.toLowerCase());
    const otherName = otherUser ? otherUser.nome.split(' ')[0] : 'sua dupla';
    
    topics.push({
      type: 'generic',
      data: 'Atividade geral no app',
      example: `${userName}! 👀 Você e ${otherName} tão sempre mexendo por aqui... que energia hein! 😏`,
      personal: true
    });
  }
  
  // Escolher UM tópico aleatório
  const chosenTopic = topics[Math.floor(Math.random() * topics.length)];
  
  const prompt = `🗣️ MODO FOFOQUEIRA ATIVADO!

=== INFORMAÇÕES PESSOAIS ===
Você conhece bem ${genderAdjective} ${userName}!
Fofoca específica: ${chosenTopic.data}

=== MISSÃO PERSONALIZADA ===
Fale diretamente com ${userName} como uma amiga próxima que observa tudo:

✅ SEJA DIRETA: Fale "você" e use informações específicas que você já conhece
✅ DEMONSTRE FAMILIARIDADE: Fale como amiga de longa data que sempre soube dessas coisas
✅ FOCADA: Comente APENAS sobre: ${chosenTopic.type}
✅ CONCISA: Máximo 3 frases curtas e diretas
✅ AMIGÁVEL: Tom de amiga fofoqueira carinhosa
✅ OBSERVE, NÃO PERGUNTE: Faça comentários e observações, não perguntas diretas
✅ CONHECIMENTO ANTIGO: Não use "vi que", "notei que" - fale como se sempre soubesse

⚠️ REGRAS RÍGIDAS:
- NUNCA mencione casamento, compromisso ou relacionamento sério
- NUNCA faça perguntas diretas que parecem esperar resposta
- NUNCA use frases como "vi que", "notei que", "descobri que"
- Use apenas perguntas RETÓRICAS ou IRÔNICAS (ex: "alguém tá com pressa né?")
- Use dados específicos reais (nomes, títulos, lugares)
- Fale como AMIGA DE LONGA DATA que sempre acompanhou ${userName}
- Seja observadora mas respeitosa
- Prefira OBSERVAÇÕES e COMENTÁRIOS a perguntas
- Trate informações como CONHECIMENTO ANTIGO, não descobertas recentes

🚫 EXEMPLOS DO QUE NÃO FAZER:
❌ "Vi que vocês têm playlist compartilhada"
❌ "Notei que você marcou lugares novos"
❌ "Descobri que você adicionou filmes"
❌ "Qual é a próxima parada?"
❌ "Você está procurando algo mais relaxado?"

✅ EXEMPLOS DO QUE FAZER:
✅ "Essa playlist que vocês compartilham tá interessante..."
✅ "Esses lugares que você anda marcando..."
✅ "Sua vibe terror não tem fim né?"
✅ "Alguém tá inquieto ultimamente hein!"
✅ "Pelo visto você gosta de ser paparicado mesmo!"

🎯 ESTILO PESSOAL DESEJADO:
${chosenTopic.example}

Faça comentários e observações espertos, não perguntas que aguardam resposta! 👀`;

  return prompt;
}
