// src/app/dashboard/admin/page.tsx
'use client';
import { Box, Heading, Text } from '@chakra-ui/react';

export default function AdminPage() {
  return (
    <Box p={6}>
      <Heading size="lg">Modo Admin</Heading>
      <Text mt={2}>Cadastros: Categorias, Tarefas, Fluxos e Funcionários.</Text>
    </Box>
  );
}
