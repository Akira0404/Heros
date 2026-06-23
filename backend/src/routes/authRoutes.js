import { Router } from 'express';
import * as auth from '../controllers/authController.js';
import { autenticar } from '../middleware/auth.js';

const router = Router();

router.post('/cadastro', auth.cadastrar);
router.post('/login', auth.login);
router.get('/perfil', autenticar, auth.perfil);
router.put('/perfil', autenticar, auth.atualizarPerfil);
router.put('/senha', autenticar, auth.atualizarSenha);

export default router;