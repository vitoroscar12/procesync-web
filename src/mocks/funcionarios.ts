// src/mocks/funcionarios.ts

import type { Funcionario } from '../types/Funcionario';

export const funcionariosMock: Funcionario[] = [
  { 
    id: '1', 
    nome: 'João Silva', 
    email: 'joao@exemplo.com', 
    cargaDiariaMinutos: 6 * 60 // 6 horas
  },
  { 
    id: '2', 
    nome: 'Maria Santos', 
    email: 'maria@exemplo.com', 
    cargaDiariaMinutos: 7 * 60 // 7 horas
  },
  { 
    id: '3', 
    nome: 'Pedro Costa', 
    email: 'pedro@exemplo.com', 
    cargaDiariaMinutos: 390 // 6.5 horas
  },
  { 
    id: '4', 
    nome: 'Ana Oliveira', 
    email: 'ana@exemplo.com', 
    cargaDiariaMinutos: 8 * 60 // 8 horas
  },
];
