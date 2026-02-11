// lib/aiTask.ts
import OpenAI from "openai";
import { Tag } from './tagInterface';
import { ObjectId } from 'mongodb';

export interface TaskDocument {
  raw_input: string;
  clean_text: string;
  source: "whatsapp" | "manual" | "system";
  message_id: string | null;
  status: "pending" | "done" | "dismissed" | "snoozed";
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
  deadLine: Date | null;
  tagsIds: ObjectId[];
  urgency: number;
  effort: number;
  energy_required: number;
  suggested_by_ai: boolean;
  confirmed_by_user: boolean;
  ai_analysis: {
    confidence: number;
    detected_intent: string;
    extracted_entities: string[];
    reasoning: string;
  };
  depends_on: string[]; // ObjectId strings
  blocked: boolean;
  recurring: {
    enabled: boolean;
    pattern: string | null;
  };
  interaction_log: { action: string; at: Date }[];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function parseAIJson(raw: string): any {
  try {
    // remove ```json ou ``` no começo/fim
    const cleaned = raw
      .trim()
      .replace(/^```json\s*/, "")
      .replace(/^```\s*/, "")
      .replace(/```$/, "");

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Erro ao parsear JSON da IA:", raw, err);
    return null;
  }
}

/**
 * Analisa um texto/transcrição e devolve um objeto pronto para Mongo
 */
export async function analyzeTextForTask(
  text: string,
  tags: Tag[],
  source: "whatsapp" | "manual" | "system",
  messageId: string | null = null
): Promise<TaskDocument> {
  const prompt = `
Você é uma assistente especializada em organizar tarefas para um adulto. 
Seu objetivo é transformar qualquer texto ou transcrição de áudio em um objeto de tarefa pronto para salvar no banco de dados, no formato TaskDocument descrito abaixo.

### Estrutura do TaskDocument:
Cada campo tem uma função específica:

- raw_input: texto original, exatamente como foi recebido.
- clean_text: versão resumida e legível da tarefa, objetiva e clara, **máximo de 100 caracteres**, diferente do raw_input.
- source: origem da tarefa: "whatsapp" | "manual" | "system".
- message_id: id da mensagem se existir, ou null.
- status: "pending" | "done" | "dismissed" | "snoozed".
- createdAt: data de criação (atual).
- updatedAt: data de atualização (atual).
- completedAt: null inicialmente, ou data de conclusão.
- tagsIds: array de IDs das tags correspondentes à tarefa (use até 3 tags).
- urgency: 0-5, define prioridade temporal da tarefa.
- effort: 0-5, esforço necessário para completar.
- deadLine: data limite pra tarefa ser considerada como "atrasada".
- energy_required: 0-5, energia física/mental necessária.
- suggested_by_ai: true se a tarefa foi sugerida pela IA.
- confirmed_by_user: true se o usuário confirmou a tarefa.
- ai_analysis:
    - confidence: 0-1, confiança da IA na classificação.
    - detected_intent: "create_task" | "informative" | "other".
    - extracted_entities: datas, horários, locais, nomes relevantes.
    - reasoning: explique detalhadamente como decidiu tags, urgência, esforço, energia, intent.
- depends_on: array de IDs de tarefas que precisam ser concluídas antes (strings).
- blocked: true se a tarefa está bloqueada por outras.
- recurring: define recorrência da tarefa:
    - enabled: true/false
    - pattern: padrão cron-like (ex: "0 9 * * 1" para toda segunda às 9h) ou null se não aplicável.
- interaction_log: histórico de interações:
    - action: "viewed" | "snoozed" | "completed" | "dismissed"
    - at: data da ação

### Regras de negócio importantes:
1. O clean_text deve ser **claro, objetivo e resumido**, máximo 100 caracteres.
2. Cada tarefa pode ter até **3 tags**, escolhidas do conjunto fornecido, **em ordem de prioridade**. A primeira tag tem peso normal, a segunda multiplicada por 0.65, a terceira por 0.65^2.
3. Urgência aumenta se houver prazo explícito ou hora específica mencionada.
4. Effort e energy_required devem refletir **dificuldade e tempo aproximado**, de 0 (muito fácil/baixo esforço) a 5 (muito difícil/alto esforço).
5. Identifique corretamente se o texto é uma **tarefa real** ou apenas informação.
6. Extraia **entidades importantes**: datas, horários, nomes, locais.
7. Para recorrência:
   - Se houver indicação de repetição (ex: "todos os dias", "toda segunda"), preencha recurring.enabled = true e gere o pattern cron-like.
   - Caso contrário, enabled = false e pattern = null.
8. Sempre forneça reasoning detalhado, explicando cada decisão.
9. O horário local é São Paulo, Brasil. Use esse fuso para avaliar urgência e recorrência.
10. Não invente campos ou tags. Use **apenas o conjunto de tags fornecido**.
11. Se não conseguir extrair algo, use valores default coerentes (ex: arrays vazios, números 0, booleans false, dates como now ou null).
12. Interprete se o usuário disse qual será o tempo exato em que a task deve ser executada, ou o tempo limite pra ela ser executa, e coloque essa data no campo "deadLine"
13. Considera a data Atual em que o usuário manda isso pra você é ${(new Date()).toISOString()} (mas o usuário está no fuso horário de são paulo)

### Entrada:
O texto a ser processado:
"""${text}"""

### Saída:
Retorne **apenas JSON puro**, **válido**, no formato:

{
  "clean_text": string,
  "tags": [string],
  "urgency": number,
  "effort": number,
  "energy_required": number,
  "detected_intent": "create_task" | "informative" | "other",
  "confidence": number,
  "extracted_entities": [string],
  "deadLine": string,
  "reasoning": string
}

deadLine deve estar no formato de data para javascript ou deve ser nulo

Tags disponíveis (não invente outras): ${tags.map((t) => t.name).join(", ")}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const rawResponse = completion.choices[0]?.message?.content || "{}";

  const parsed = parseAIJson(rawResponse) || {
    clean_text: text,
    tags: [],
    urgency: 0,
    effort: 0,
    energy_required: 0,
    detected_intent: "other",
    confidence: 0,
    extracted_entities: [],
    reasoning: "",
  };

  const taskDoc: TaskDocument = {
    raw_input: text,
    clean_text: parsed.clean_text || text,
    deadLine: new Date(parsed.deadLine) || null,
    source,
    message_id: messageId,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: null,
    tagsIds: tags.filter((t) => parsed.tags?.includes(t.name)).map((t) => t._id),
    urgency: parsed.urgency || 0,
    effort: parsed.effort || 0,
    energy_required: parsed.energy_required || 0,
    suggested_by_ai: false,
    confirmed_by_user: true,
    ai_analysis: {
      confidence: parsed.confidence || 0,
      detected_intent: parsed.detected_intent || "other",
      extracted_entities: parsed.extracted_entities || [],
      reasoning: parsed.reasoning || "",
    },
    depends_on: [],
    blocked: false,
    recurring: { enabled: false, pattern: null },
    interaction_log: [],
  };

  return taskDoc;
}

