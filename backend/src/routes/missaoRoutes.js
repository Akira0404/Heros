import { Router } from 'express';
import * as missao from '../controllers/missaoController.js';
import { autenticar } from '../middleware/auth.js';

const router = Router();

router.use(autenticar);

router.get('/heroi/:heroiId', missao.listarPorHeroi);
router.post('/heroi/:heroiId', missao.criar);

export default router;