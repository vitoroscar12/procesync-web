// src/utils/tempo.ts
export function formatarHorasMinutos(minutosTotal: number): string {
  const total = Number.isFinite(minutosTotal) ? Math.max(0, Math.round(minutosTotal)) : 0;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h}h ${String(m).padStart(2, '0')}m`;
}

export function toMinutos(horas: number, minutos: number): number {
  const h = Number.isFinite(horas) ? Math.max(0, Math.floor(horas)) : 0;
  const m = Number.isFinite(minutos) ? Math.max(0, Math.floor(minutos)) : 0;
  return h * 60 + m;
}

export function fromMinutos(minutosTotal: number): { horas: number; minutos: number } {
  const total = Number.isFinite(minutosTotal) ? Math.max(0, Math.round(minutosTotal)) : 0;
  return { horas: Math.floor(total / 60), minutos: total % 60 };
}
