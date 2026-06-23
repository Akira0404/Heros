import { Router } from 'express';
import * as heroi from '../controllers/heroiController.js';
import { autenticar } from '../middleware/auth.js';

const router = Router();

router.use(autenticar);

router.get('/estatisticas', heroi.estatisticas);
router.get('/', heroi.listar);
router.get('/:id', heroi.detalhes);
router.post('/', heroi.criar);
router.put('/:id', heroi.atualizar);
router.delete('/:id', heroi.remover);

export default router;