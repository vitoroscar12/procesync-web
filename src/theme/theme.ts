// src/theme/theme.ts
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      100: '#E0E7FF',
      500: '#4A66C5',
      900: '#051733',
      backgroundDark: '#020817',
      sidebarBg: '#050d1f',
    },
  },
  components: {
    Menu: {
      parts: ['menu', 'list', 'item', 'groupTitle', 'command', 'divider'],
      baseStyle: {
        list: {
          bg: 'rgba(5, 23, 51, 0.98)',
          borderColor: 'rgba(255,255,255,0.2)',
          color: 'white',
        },
        item: {
          bg: 'transparent',
          color: 'white',
          _hover: {
            bg: 'whiteAlpha.200',
            color: 'white',
          },
          _focus: {
            bg: 'whiteAlpha.300',
            color: 'white',
          },
        },
        divider: {
          borderColor: 'whiteAlpha.300',
        },
      },
    },
    // 👇 ADICIONE ESTA PARTE
    Select: {
      baseStyle: {
        field: {
          bg: 'gray.900',
          borderColor: 'whiteAlpha.200',
          color: 'white',
          _placeholder: {
            color: 'gray.500',
          },
          _hover: {
            borderColor: 'whiteAlpha.400',
          },
          _focusVisible: {
            borderColor: 'purple.400',
            boxShadow: '0 0 0 1px rgba(128, 90, 213, 0.6)',
          },
        },
      },
      variants: {
        filled: {
          field: {
            bg: 'gray.900',
            _hover: {
              bg: 'gray.800',
            },
          },
        },
        outline: {
          field: {
            bg: 'gray.900',
          },
        },
      },
      defaultProps: {
        variant: 'outline',
        focusBorderColor: 'purple.400',
      },
    },
  },
});

export default theme;
