'use client';

import React from 'react';
import { Box } from '@chakra-ui/react';
import { MinhaAgenda } from '@/components/colaborador/MinhaAgenda';

export default function ColaboradorPage() {
  return (
    <Box bg="#051733" minH="100vh">
      <MinhaAgenda />
    </Box>
  );
}
