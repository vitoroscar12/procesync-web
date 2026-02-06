// src/services/funcionariosService.ts
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Funcionario } from '@/types/Funcionario';

const COL = 'funcionarios';

export async function getAllFuncionarios(): Promise<Funcionario[]> {
  const q = query(collection(db, COL), orderBy('nome', 'asc'));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Funcionario, 'id'>),
  }));
}

export async function addFuncionario(input: {
  nome: string;
  cargaDiariaMinutos: number;
}): Promise<void> {
  await addDoc(collection(db, COL), {
    nome: input.nome,
    cargaDiariaMinutos: input.cargaDiariaMinutos,
    createdAt: serverTimestamp(), // opcional
    updatedAt: serverTimestamp(), // opcional
  });
}

export async function updateFuncionario(
  id: string,
  input: { nome: string; cargaDiariaMinutos: number }
): Promise<void> {
  await updateDoc(doc(db, COL, id), {
    nome: input.nome,
    cargaDiariaMinutos: input.cargaDiariaMinutos,
    updatedAt: serverTimestamp(), // opcional
  });
}

export async function deleteFuncionario(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}
