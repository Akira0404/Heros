import { Router } from 'express';
import * as guilda from '../controllers/guildaController.js';
import { autenticar } from '../middleware/auth.js';

const router = Router();

router.use(autenticar);

router.get('/todas', guilda.listarTodas);
router.get('/', guilda.listar);
router.get('/:id', guilda.detalhes);
router.post('/', guilda.criar);
router.put('/mover/:heroiId', guilda.moverHeroi);

export default router;