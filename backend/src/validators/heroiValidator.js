import { z } from 'zod';

export const heroiSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  classe: z.enum(['Mago', 'Guerreiro', 'Arqueiro', 'Ladinho']),
  nivel_poder: z.number().int().min(0).max(100),
  avatar_url: z.string().url('URL do avatar inválida'),
  guilda_id: z.number().int().positive('Guilda é obrigatória'),
});

export const heroiUpdateSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  classe: z.enum(['Mago', 'Guerreiro', 'Arqueiro', 'Ladinho']),
  nivel_poder: z.number().int().min(0).max(100),
});