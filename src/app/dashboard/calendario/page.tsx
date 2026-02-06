// src/app/dashboard/calendario/page.tsx
// Não precisa de 'use client' aqui, pois o ChakraProvider já está no layout
import CalendarioSemanal from '@/components/dashboard/CalendarioSemanal';
import { Box } from '@chakra-ui/react'; // Importa Box para usar no layout

export default function DashboardCalendarioPage() {
  return (
    <Box p={4}> {/* Adiciona um padding para o conteúdo */}
      <CalendarioSemanal />
    </Box>
  );
}
