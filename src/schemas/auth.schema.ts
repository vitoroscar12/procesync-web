import {z} from 'zod';

export const registerSchema = z.object({
    name: z
    .string()
    .min(3,'Nome deve ter no mínimo 3  caracteres '),

    email: z.email('E-mail inválido'),

    password: z
    .string()
    .min(6,'Senha deve ter no mínimo 6 caracteres'),

    role: z.enum(["Admin","Standard"]),
});

export const loginSchema = z.object({
  email: z
    .email('E-mail inválido'),

  password: z
    .string()
    .min(6, 'Senha inválida'),
});