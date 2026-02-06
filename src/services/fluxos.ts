// src/services/fluxos.ts
import { db } from './firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export interface FluxoTarefa {
  id: string; // ID único para a tarefa dentro do fluxo (pode ser gerado no front-end ou um UUID)
  nome: string;
  descricao?: string;
  tempoEstimadoMinutos: number;
  funcionarioId?: string;
  funcionarioNome?: string;
  // Adicione outros campos específicos da tarefa do fluxo, se houver
}

export interface Fluxo {
  id: string;
  nome: string;
  descricao?: string;
  tarefas: FluxoTarefa[]; // Array de tarefas que compõem o fluxo
}

const fluxosCollection = collection(db, 'fluxos');

export const getFluxos = async (): Promise<Fluxo[]> => {
  const querySnapshot = await getDocs(fluxosCollection);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Fluxo));
};

export const criarFluxo = async (fluxo: Omit<Fluxo, 'id'>): Promise<string> => {
  const docRef = await addDoc(fluxosCollection, fluxo);
  return docRef.id;
};

export const atualizarFluxo = async (id: string, fluxo: Partial<Omit<Fluxo, 'id'>>): Promise<void> => {
  const docRef = doc(db, 'fluxos', id);
  await updateDoc(docRef, fluxo);
};

export const deletarFluxo = async (id: string): Promise<void> => {
  const docRef = doc(db, 'fluxos', id);
  await deleteDoc(docRef);
};
