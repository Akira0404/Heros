import { z } from 'zod';

export const missaoSchema = z.object({
  descricao: z.string().min(3, 'Descrição deve ter no mínimo 3 caracteres'),
  status: z.enum(['Em andamento', 'Concluída', 'Falhou']).optional(),
  recompensa_ouro: z.number().int().min(0).optional(),
});