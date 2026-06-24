import { z } from 'zod';

export const guildaSchema = z.object({
  nome: z.string().min(3, 'Nome da guilda deve ter no mínimo 3 caracteres'),
});