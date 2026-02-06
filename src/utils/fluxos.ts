// src/utils/fluxos.ts

export type StatusTarefa = 'pendente' | 'em-andamento' | 'concluida';

export type FuncionarioRef = {
  id: string;
  nome: string;
};

export type TarefaLocal = {
  id: string;
  titulo: string;
  funcionarioId: string;
  funcionarioNome: string;
  dia: string; // ISO key: YYYY-MM-DD
  status: StatusTarefa;
  duracao: number; // minutos
};

type GerarFluxoCompraParams = {
  funcionarios: FuncionarioRef[];
  diaBaseKey: string; // YYYY-MM-DD

  funcionarioCotacaoId: string;
  funcionarioCompraId: string;
  funcionarioConferenciaId: string;

  duracaoCotacaoMin?: number;
  duracaoCompraMin?: number;
  duracaoConferenciaMin?: number;
};

const getFuncionarioNome = (funcionarios: FuncionarioRef[], id: string): string =>
  funcionarios.find((f) => f.id === id)?.nome ?? 'Funcionário';

const uuid = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const isoToDate = (key: string): Date => {
  // Força parsing estável para evitar number|undefined e TS2345
  const parts = key.split('-');
  const y = Number(parts[0] ?? '1970');
  const m = Number(parts[1] ?? '01');
  const d = Number(parts[2] ?? '01');
  return new Date(y, m - 1, d);
};

const toISODateKey = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const addDaysISOKey = (isoKey: string, days: number) => {
  const base = isoToDate(isoKey);
  base.setDate(base.getDate() + days);
  return toISODateKey(base);
};

export function gerarFluxoRealizarCompra(params: GerarFluxoCompraParams): TarefaLocal[] {
  const {
    funcionarios,
    diaBaseKey,
    funcionarioCotacaoId,
    funcionarioCompraId,
    funcionarioConferenciaId,
    duracaoCotacaoMin = 60,
    duracaoCompraMin = 90,
    duracaoConferenciaMin = 45,
  } = params;

  return [
    {
      id: uuid(),
      titulo: 'Cotação',
      funcionarioId: funcionarioCotacaoId,
      funcionarioNome: getFuncionarioNome(funcionarios, funcionarioCotacaoId),
      dia: diaBaseKey,
      status: 'pendente',
      duracao: duracaoCotacaoMin,
    },
    {
      id: uuid(),
      titulo: 'Compra',
      funcionarioId: funcionarioCompraId,
      funcionarioNome: getFuncionarioNome(funcionarios, funcionarioCompraId),
      dia: addDaysISOKey(diaBaseKey, 2),
      status: 'pendente',
      duracao: duracaoCompraMin,
    },
    {
      id: uuid(),
      titulo: 'Conferência',
      funcionarioId: funcionarioConferenciaId,
      funcionarioNome: getFuncionarioNome(funcionarios, funcionarioConferenciaId),
      dia: addDaysISOKey(diaBaseKey, 3),
      status: 'pendente',
      duracao: duracaoConferenciaMin,
    },
  ];
}
