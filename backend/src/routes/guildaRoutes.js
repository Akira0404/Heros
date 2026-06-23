import { Router } from 'express';
import * as guilda from '../controllers/guildaController.js';
import { autenticar } from '../middleware/auth.js';

const router = Router();

router.get('/', autenticar, guilda.listar);

export default router;