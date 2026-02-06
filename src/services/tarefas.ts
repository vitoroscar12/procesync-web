/* eslint-disable @typescript-eslint/no-unused-vars */
// src/services/tarefas.ts
import { db } from './firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { format, startOfDay, endOfDay } from 'date-fns'; // Importa format para lidar com strings

export type StatusTarefa = 'pendente' | 'em-andamento' | 'concluida';

export interface Tarefa {
  id: string;
  titulo: string;
  descricao?: string;
  dataAlocacao: string; // ALTERADO: Agora é string (formato "YYYY-MM-DD")
  horaInicio: string; // Ex: "08:00"
  horaFim: string;    // Ex: "09:00"
  duracao: number;    // Em minutos
  alocadoPara: string; // ID do funcionário
  status: StatusTarefa;
  categoriaId?: string;
  requisitoTreinamento?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Campos para criar uma nova tarefa (sem id, createdAt, updatedAt)
export type CriarTarefaInput = Omit<Tarefa, 'id' | 'createdAt' | 'updatedAt'>;

// Campos para atualizar uma tarefa (todos opcionais, sem id, createdAt)
export type AtualizarTarefaInput = Partial<Omit<Tarefa, 'id' | 'createdAt' | 'updatedAt'>>;

const tarefasCollection = collection(db, 'tarefas');

export const getTarefasPorSemana = async (start: Date, end: Date): Promise<Tarefa[]> => {
  // Converte as datas para o formato de string "YYYY-MM-DD" para a consulta
  const startDateString = format(start, 'yyyy-MM-dd');
  const endDateString = format(end, 'yyyy-MM-dd');

  // A consulta agora filtra por strings de data
  const q = query(
    tarefasCollection,
    orderBy('dataAlocacao'), // Adiciona orderBy para a dataAlocacao
    where('dataAlocacao', '>=', startDateString),
    where('dataAlocacao', '<=', endDateString)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Tarefa));
};

export const criarTarefa = async (tarefa: CriarTarefaInput): Promise<string> => {
  const now = Timestamp.now();
  const docRef = await addDoc(tarefasCollection, {
    ...tarefa,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
};

export const atualizarTarefa = async (id: string, tarefa: AtualizarTarefaInput): Promise<void> => {
  const docRef = doc(db, 'tarefas', id);
  await updateDoc(docRef, {
    ...tarefa,
    updatedAt: Timestamp.now(),
  });
};

export const deletarTarefa = async (id: string): Promise<void> => {
  const docRef = doc(db, 'tarefas', id);
  await deleteDoc(docRef);
};
