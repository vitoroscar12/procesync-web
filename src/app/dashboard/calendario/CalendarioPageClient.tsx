// src/app/dashboard/calendario/CalendarioPageClient.tsx
'use client';

import dynamic from 'next/dynamic';

const CalendarioClient = dynamic(() => import('@/components/dashboard/CalendarioClient'), {
  ssr: false,
});

export default function CalendarioPageClient() {
  return <CalendarioClient />;
}
