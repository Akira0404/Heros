import { Router } from 'express';
import * as catalogo from '../controllers/catalogoController.js';
import { autenticar } from '../middleware/auth.js';

const router = Router();

router.use(autenticar);

router.get('/', catalogo.listarCatalogo);
router.post('/recrutar', catalogo.recrutarDoCatalogo);

export default router;