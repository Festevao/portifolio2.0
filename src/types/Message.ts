/**
 * Tipos para o sistema de mensagens entre usuários
 */

export interface Message {
  _id: string;
  content: string; // Conteúdo em Markdown
  sender: string; // Username do remetente
  recipient: string; // Username do destinatário
  participants: string[]; // Array com ambos os usuários para filtragem
  images?: string[]; // URLs das imagens anexadas
  isRead: boolean; // Se a mensagem foi lida
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMessageData {
  content: string;
  sender: string;
  recipient: string;
  participants: string[];
  images?: string[];
}

export interface MessageResponse {
  success: boolean;
  message?: string;
  message?: Message;
  messages?: Message[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface MessageStats {
  totalMessages: number;
  unreadCount: number;
  lastMessage?: Date;
}
