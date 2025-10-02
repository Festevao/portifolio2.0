import { PlaceEvent } from '@/types/PlaceEvent';

/**
 * Verifica se um evento está próximo (dentro de uma semana)
 */
export const isEventUpcoming = (event: PlaceEvent): boolean => {
  if (!event.date) return false;
  
  const eventDate = new Date(event.date);
  const now = new Date();
  const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return eventDate >= now && eventDate <= oneWeekFromNow;
};

/**
 * Verifica se um evento já passou
 */
export const isEventPast = (event: PlaceEvent): boolean => {
  if (!event.date) return false;
  
  const eventDate = new Date(event.date);
  const now = new Date();
  
  return eventDate < now;
};

/**
 * Retorna a diferença em dias até o evento
 */
export const getDaysUntilEvent = (event: PlaceEvent): number | null => {
  if (!event.date) return null;
  
  const eventDate = new Date(event.date);
  const now = new Date();
  const diffTime = eventDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Retorna a cor de destaque baseada no clima e proximidade do evento
 */
export const getEventHighlightColor = (event: PlaceEvent, isDaytime: boolean): string => {
  if (!isEventUpcoming(event)) return '';
  
  const daysUntil = getDaysUntilEvent(event);
  
  if (daysUntil === null) return '';
  
  // Cores baseadas no clima
  const dayColors = {
    urgent: 'bg-gradient-to-r from-red-400 to-orange-500', // 1-2 dias
    soon: 'bg-gradient-to-r from-yellow-400 to-amber-500', // 3-4 dias
    upcoming: 'bg-gradient-to-r from-yellow-300 to-yellow-400' // 5-7 dias
  };
  
  const nightColors = {
    urgent: 'bg-gradient-to-r from-red-600 to-purple-700', // 1-2 dias
    soon: 'bg-gradient-to-r from-purple-500 to-pink-500', // 3-4 dias
    upcoming: 'bg-gradient-to-r from-purple-400 to-purple-500' // 5-7 dias
  };
  
  const colors = isDaytime ? dayColors : nightColors;
  
  if (daysUntil <= 2) return colors.urgent;
  if (daysUntil <= 4) return colors.soon;
  return colors.upcoming;
};

/**
 * Retorna o texto de proximidade do evento
 */
export const getEventProximityText = (event: PlaceEvent): string => {
  if (!event.date) return '';
  
  const daysUntil = getDaysUntilEvent(event);
  
  if (daysUntil === null) return '';
  
  if (daysUntil < 0) return 'Evento passado';
  if (daysUntil === 0) return 'Hoje!';
  if (daysUntil === 1) return 'Amanhã';
  if (daysUntil <= 7) return `Em ${daysUntil} dias`;
  
  return '';
};

/**
 * Retorna a cor do texto baseada na proximidade
 */
export const getEventTextColor = (event: PlaceEvent, isDaytime: boolean): string => {
  if (!isEventUpcoming(event)) {
    return isDaytime ? 'text-gray-700' : 'text-gray-300';
  }
  
  const daysUntil = getDaysUntilEvent(event);
  
  if (daysUntil === null) return isDaytime ? 'text-gray-700' : 'text-gray-300';
  
  if (daysUntil <= 2) return 'text-white font-bold';
  if (daysUntil <= 4) return 'text-white font-semibold';
  return isDaytime ? 'text-gray-800 font-medium' : 'text-white font-medium';
};
