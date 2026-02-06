    // src/app/dashboard/equipe/page.tsx
    import { Box, Heading, Text } from '@chakra-ui/react';
    import { GerenciarEquipe } from '@/components/dashboard/GerenciarEquipe'; // Usando alias @/

    export default function EquipePage() {
      return (
        <Box>
          <Heading size="lg" mb={2} color="white">
            Gerenciar Equipe
          </Heading>
          <Text color="gray.400" mb={6}>
            Adicione, edite ou remova membros da sua equipe e configure suas cargas horárias
          </Text>
          <GerenciarEquipe />
        </Box>
      );
    }
