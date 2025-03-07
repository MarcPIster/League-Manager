// src/routes/auth.ts
import { Router } from 'express';
import { login, register, forgotPassword } from '../controllers/authController';
import { validateLogin, validateRegistration, validateForgotPassword } from '../middleware/validateUser';

const authRouter = Router();

// Login route: POST /api/auth/login
authRouter.post('/login', validateLogin, login);

// Registration route: POST /api/auth/register
authRouter.post('/register', validateRegistration, register);

// Forgot Password route: POST /api/auth/forgot-password
authRouter.post('/forgot-password', validateForgotPassword, forgotPassword);

export default authRouter;
