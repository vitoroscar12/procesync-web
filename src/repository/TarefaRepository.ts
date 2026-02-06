import { db } from '@/services/firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Timestamp,
} from 'firebase/firestore';

export type StatusTarefa = 'pendente' | 'em-andamento' | 'concluida';

export type CreateTarefa = {
  titulo: string;
  funcionarioId: string;
  dia: string;        // 'YYYY-MM-DD' (como você está usando no hook)
  duracao: number;    // minutos
  categoriaId?: string;
  prioridade?: number;
};

export type Tarefa = {
  id: string;
  titulo: string;
  funcionarioId: string;
  dia: string;
  duracao: number;
  status: StatusTarefa;
  categoriaId?: string;
  prioridade?: number;

  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  startedAt?: Timestamp | null;
  finishedAt?: Timestamp | null;
};

class TarefaRepository {
  private collectionName = 'tarefas';

  async create(request: CreateTarefa): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...request,
        status: 'pendente' as StatusTarefa,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        startedAt: null,
        finishedAt: null,
      });

      console.log('[TarefaRepository.create] OK id=', docRef.id);
      return docRef.id;
    } catch (e) {
      console.error('[TarefaRepository.create] ERRO', e);
      throw e;
    }
  }

  async updateStatus(
    id: string,
    status: StatusTarefa,
    extras?: { startedAt?: 'serverNow'; finishedAt?: 'serverNow' }
  ): Promise<void> {
    const ref = doc(db, this.collectionName, id);

    const patch: Record<string, unknown> = {
      status,
      updatedAt: serverTimestamp(),
    };

    if (extras?.startedAt === 'serverNow') patch.startedAt = serverTimestamp();
    if (extras?.finishedAt === 'serverNow') patch.finishedAt = serverTimestamp();

    await updateDoc(ref, patch);
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, this.collectionName, id));
  }

  async getById(id: string): Promise<Tarefa | null> {
    const snap = await getDoc(doc(db, this.collectionName, id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as Omit<Tarefa, 'id'>) };
  }

  async listAll(): Promise<Tarefa[]> {
    const q = query(collection(db, this.collectionName), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Tarefa, 'id'>) }));
  }
}

export const tarefaRepository = new TarefaRepository();
