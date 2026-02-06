// src/components/layout/Header.tsx
import { Flex, Heading, Spacer, Button, Text } from '@chakra-ui/react';
import { useAuth } from '@/context/AuthContext';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <Flex
      as="header"
      bg="gray.900"
      color="white"
      px={6}
      py={4}
      align="center"
      boxShadow="sm"
    >
      <Heading size="md">ProceSync</Heading>
      <Spacer />
      {user && (
        <Text mr={4} fontSize="sm" color="gray.300">
          {user.name} ({user.email})
        </Text>
      )}
      <Button size="sm" colorScheme="purple" variant="outline" onClick={signOut}>
        Sair
      </Button>
    </Flex>
  );
}
