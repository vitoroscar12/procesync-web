// src/services/usersService.ts
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type UserRole = 'gestor' | 'colaborador';

export type UserProfile = {
  uid: string;
  role: UserRole;
  nome?: string;
};

type FirestoreUserDoc = {
  role?: unknown;
  nome?: unknown;
};

function isUserRole(value: unknown): value is UserRole {
  return value === 'gestor' || value === 'colaborador';
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const raw = snap.data() as unknown;
  const data: FirestoreUserDoc = raw && typeof raw === 'object' ? (raw as FirestoreUserDoc) : {};

  if (!isUserRole(data.role)) {
    throw new Error(`Campo "role" inválido em users/${uid}. Use "gestor" ou "colaborador".`);
  }

  return {
    uid,
    role: data.role,
    nome: typeof data.nome === 'string' ? data.nome : undefined,
  };
}
