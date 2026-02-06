// src/services/funcionarios.ts
import { db } from './firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export interface Funcionario {
  id: string;
  nome: string;
  cargaDiariaMinutos: number;
  // Adicione outros campos relevantes para o funcionário aqui
}

const funcionariosCollection = collection(db, 'funcionarios');

export const getFuncionarios = async (): Promise<Funcionario[]> => {
  const querySnapshot = await getDocs(funcionariosCollection);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Funcionario));
};

export const criarFuncionario = async (funcionario: Omit<Funcionario, 'id'>): Promise<string> => {
  const docRef = await addDoc(funcionariosCollection, funcionario);
  return docRef.id;
};

export const atualizarFuncionario = async (id: string, funcionario: Partial<Omit<Funcionario, 'id'>>): Promise<void> => {
  const docRef = doc(db, 'funcionarios', id);
  await updateDoc(docRef, funcionario);
};

export const deletarFuncionario = async (id: string): Promise<void> => {
  const docRef = doc(db, 'funcionarios', id);
  await deleteDoc(docRef);
};
