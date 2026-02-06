// src/types/Funcionario.ts
export interface Funcionario {
  id: string;
  nome: string;
  email: string;
  cargaDiariaMinutos: number;
  competencias: string[];
  createdAt: Date;
  updatedAt: Date;
}
