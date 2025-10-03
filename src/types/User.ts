/**
 * Representa um usuário na collection do MongoDB
 */
export interface User {
  _id?: string;
  username: string;
  nome: string;
  dataNascimento: Date;
  email: string;
  telefone: string;
  bio?: string;
  avatar?: string;
  gender: "MAL" | "FEM";
  hashedPassword?: string; // Senha criptografada (opcional)
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Dados para definir senha do usuário
 */
export interface SetPasswordData {
  username: string;
  password: string;
}

/**
 * Dados para login
 */
export interface LoginData {
  username: string;
  password: string;
}

/**
 * Response do sistema de autenticação
 */
export interface AuthResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
  message?: string;
  needsPassword?: boolean;
}

