import { ObjectId } from 'mongodb'

export interface Tag {
  _id: ObjectId
  name: string
  description: string
  weight: number
  timeWeights: TimeWeights
}

export interface TimeWeights {
  dawn: number
  morning: number
  afternoon: number
  night: number
}

export function calculateTaskWeight(tags: Tag[], decayFactor = 0.65): number {
  if (!tags || tags.length === 0) return 0;

  const currentHour = new Date().getHours();
  let period: keyof TimeWeights;

  if (currentHour < 6) period = "dawn";
  else if (currentHour < 12) period = "morning";
  else if (currentHour < 18) period = "afternoon";
  else period = "night";

  // Soma ponderada das tags
  const baseWeight = tags.reduce((total, tag, index) => {
    const decay = Math.pow(decayFactor, index); // aplica decaimento
    return total + tag.weight * decay;
  }, 0);

  // Multiplicador de horário da tag principal
  const mainMultiplier = tags[0].timeWeights[period];

  const finalWeight = baseWeight * mainMultiplier;

  return finalWeight;
}