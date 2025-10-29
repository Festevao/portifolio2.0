/**
 * Tipo para anotações pessoais sobre outros usuários
 */
export interface Annotation {
  _id?: string;
  fromUser: string; // Username de quem criou a anotação
  aboutUser: string; // Username sobre quem é a anotação
  content: string; // Conteúdo da anotação
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Resposta da API de anotações
 */
export interface AnnotationResponse {
  success: boolean;
  annotation?: Annotation;
  annotations?: Annotation[];
  message?: string;
  error?: string;
}

/**
 * Resposta da API de busca inteligente
 */
export interface AnnotationSearchResponse {
  success: boolean;
  searchResults?: string;
  relevantAnnotations?: Annotation[];
  message?: string;
  error?: string;
}
