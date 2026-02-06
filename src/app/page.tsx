/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  useToast,
  Flex,
  Image,
} from '@chakra-ui/react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { darkBluePalette } from '@/styles/theme';

const palette = darkBluePalette;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const { signIn, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se o usuário já estiver logado e não estiver mais carregando, redireciona para o dashboard
    if (user && !loading) {
      router.push('/dashboard/calendario');
    }
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signIn(email, password);
      toast({
        title: 'Login bem-sucedido!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // O redirecionamento é tratado pelo AuthContext useEffect
    } catch (error: any) {
      toast({
        title: 'Erro ao fazer login.',
        description: error.message || 'Verifique suas credenciais.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Se estiver carregando a autenticação inicial, pode mostrar um spinner ou tela em branco
  if (loading) {
    return (
      <Flex
        minH="100vh"
        align="center"
        justify="center"
        bg={palette.primary}
        color={palette.base}
      >
        <Text>Carregando...</Text>
      </Flex>
    );
  }

  // Se o usuário já estiver logado, não renderiza o formulário de login
  if (user) {
    return null; // Ou um spinner, enquanto o redirecionamento acontece
  }

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={palette.primary}
      color={palette.base}
    >
      <Box
        p={8}
        maxWidth="500px"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        bg={palette.top}
        borderColor={palette.medium}
      >
        <Stack spacing={4} align="center">
          <Image src="/logo.png" alt="ProceSync Logo" boxSize="100px" objectFit="contain" mb={4} />
          <Heading as="h1" size="xl" color={palette.light}>
            ProceSync
          </Heading>
          <Text fontSize="lg" color={palette.base}>
            Faça login para continuar
          </Text>
          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>E-mail</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  bg={palette.medium}
                  borderColor={palette.medium}
                  _hover={{ borderColor: palette.light }}
                  _focus={{ borderColor: palette.light, boxShadow: 'outline' }}
                  color={palette.base}
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Senha</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  bg={palette.medium}
                  borderColor={palette.medium}
                  _hover={{ borderColor: palette.light }}
                  _focus={{ borderColor: palette.light, boxShadow: 'outline' }}
                  color={palette.base}
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isSubmitting}
                loadingText="Entrando"
                bg={palette.light}
                _hover={{ bg: palette.light, opacity: 0.8 }}
                mt={4}
              >
                Entrar
              </Button>
            </Stack>
          </form>
          <Text fontSize="sm" color={palette.base} mt={4}>
            Esqueceu sua senha?{' '}
            <Text as="span" color={palette.light} cursor="pointer" _hover={{ textDecoration: 'underline' }}>
              Recuperar
            </Text>
          </Text>
        </Stack>
      </Box>
    </Flex>
  );
}
