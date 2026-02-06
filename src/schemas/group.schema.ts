import { z } from 'zod'
export const groupSchema = z.object({
    description: z
        .string()
        .min(3, 'A descrição deve ter no minimo 3 caracteres.')
        .max(100, 'A descrição deve ter no máximo 100 carcteres.')
})

export const userGroupSchema = z.object({
    usuario_uid: z
        .string()
        .min(1, 'usuario_uid não pode ser vazio'),
});