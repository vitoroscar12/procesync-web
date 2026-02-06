/* eslint-disable @typescript-eslint/no-explicit-any */
// src/styles/theme.ts
// Este arquivo agora exporta APENAS a paleta de cores e a função extendTheme não é chamada aqui.
import { extendTheme } from '@chakra-ui/react';

// Paleta de cores dark-blue do Vitor
export const darkBluePalette = {
  top: '#051733',      // Mais escuro, para fundos de cards/elementos principais
  primary: '#0B2247',  // Fundo principal da aplicação
  medium: '#1A3A73',   // Elementos intermediários, inputs
  light: '#6FA8FF',    // Destaques, botões, links
  base: '#F5F8FF',     // Texto claro, elementos de contraste
  white: '#FFFFFF',    // Branco puro para texto em fundos escuros
};

// A função para criar o tema será chamada em um Client Component (providers.tsx)
export const createProceSyncTheme = () => extendTheme({
  colors: {
    // Mapeamento para o colorScheme 'purple' do Chakra UI
    purple: {
      50: darkBluePalette.base,
      100: darkBluePalette.light,
      200: darkBluePalette.medium,
      300: darkBluePalette.primary,
      400: darkBluePalette.top,
      500: darkBluePalette.light, // Usar light como a cor principal para botões
      600: darkBluePalette.light,
      700: darkBluePalette.light,
      800: darkBluePalette.light,
      900: darkBluePalette.light,
    },
    // Adicionar outras cores da paleta para uso direto
    darkBlue: {
      50: darkBluePalette.base,
      100: darkBluePalette.light,
      200: darkBluePalette.medium,
      300: darkBluePalette.primary,
      400: darkBluePalette.top,
      500: darkBluePalette.top,
      600: darkBluePalette.top,
      700: darkBluePalette.top,
      800: darkBluePalette.top,
      900: darkBluePalette.top,
    },
  },
  components: {
    Button: {
      baseStyle: {
        _focus: {
          boxShadow: 'outline',
        },
      },
      variants: {
        solid: (props:any) => ({
          bg: props.colorScheme === 'purple' ? darkBluePalette.light : props.bg,
          color: 'white',
          _hover: {
            bg: props.colorScheme === 'purple' ? darkBluePalette.light : props.bg,
            opacity: 0.8,
          },
          _active: {
            bg: props.colorScheme === 'purple' ? darkBluePalette.light : props.bg,
            opacity: 0.7,
          },
        }),
        ghost: (props:any) => ({
          color: props.colorScheme === 'purple' ? darkBluePalette.light : props.color,
          _hover: {
            bg: darkBluePalette.medium,
          },
        }),
      },
    },
    Input: {
      variants: {
        filled: {
          field: {
            bg: darkBluePalette.medium,
            color: darkBluePalette.base,
            _placeholder: { color: darkBluePalette.base },
            _hover: { bg: darkBluePalette.medium },
            _focus: { bg: darkBluePalette.medium, borderColor: darkBluePalette.light },
          },
        },
      },
    },
    Select: {
      variants: {
        filled: {
          field: {
            bg: darkBluePalette.medium,
            color: darkBluePalette.base,
            _hover: { bg: darkBluePalette.medium },
            _focus: { bg: darkBluePalette.medium, borderColor: darkBluePalette.light },
          },
        },
      },
    },
    Textarea: {
      variants: {
        filled: {
          field: {
            bg: darkBluePalette.medium,
            color: darkBluePalette.base,
            _placeholder: { color: darkBluePalette.base },
            _hover: { bg: darkBluePalette.medium },
            _focus: { bg: darkBluePalette.medium, borderColor: darkBluePalette.light },
          },
        },
      },
    },
    Modal: {
      baseStyle: {
        overlay: {
          bg: 'blackAlpha.700',
        },
        dialog: {
          bg: darkBluePalette.primary,
          color: darkBluePalette.base,
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: darkBluePalette.primary,
        color: darkBluePalette.base,
      },
    },
  },
});
