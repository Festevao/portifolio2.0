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
  createdAt?: Date;
  updatedAt?: Date;
}

