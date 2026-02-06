// src/app/dashboard/equipe/page.tsx
'use client';

import React from 'react';
import { Box, Heading, Text, Flex, Spinner, SimpleGrid, Card, CardHeader, CardBody, Stack, StackDivider } from '@chakra-ui/react';
import { useFuncionarios } from '@/hooks/useFuncionarios';
import { darkBluePalette } from '@/styles/theme';

const palette = darkBluePalette;

export default function EquipePage() {
  const { funcionarios, loading, error } = useFuncionarios();

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="calc(100vh - 64px)" bg={palette.primary} color={palette.base}>
        <Spinner size="xl" color={palette.light} />
        <Text ml={4}>Carregando equipe...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" minH="calc(100vh - 64px)" bg={palette.primary} color={palette.base}>
        <Text color="red.500">Erro ao carregar funcionários: {error.message}</Text>
      </Flex>
    );
  }

  return (
    <Box p={4} bg={palette.primary} minH="calc(100vh - 64px)">
      <Heading as="h1" size="xl" mb={6} color={palette.light}>
        Gestão de Equipe
      </Heading>

      {funcionarios.length === 0 ? (
        <Text color={palette.base}>Nenhum funcionário cadastrado ainda.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {funcionarios.map((funcionario) => (
            <Card key={funcionario.id} bg={palette.top} color={palette.base} borderColor={palette.medium} borderWidth="1px">
              <CardHeader>
                <Heading size="md" color={palette.light}>{funcionario.nome}</Heading>
              </CardHeader>
              <CardBody>
                <Stack divider={<StackDivider borderColor={palette.medium} />} spacing="4">
                  <Box>
                    <Text fontSize="sm" textTransform="uppercase" color={palette.light}>
                      ID do Funcionário
                    </Text>
                    <Text pt="2" fontSize="md">{funcionario.id}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" textTransform="uppercase" color={palette.light}>
                      Carga Diária
                    </Text>
                    <Text pt="2" fontSize="md">{funcionario.cargaDiariaMinutos} minutos</Text>
                  </Box>
                  {/* Adicione mais detalhes do funcionário aqui, se houver */}
                </Stack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
