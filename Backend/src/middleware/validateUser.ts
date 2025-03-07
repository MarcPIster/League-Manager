import { Request, Response, NextFunction } from 'express';

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: 'Please provide both username and password.' });
  }
  next();
};

export const validateRegistration = (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400).json({ message: 'Please provide username, email, and password.' });
  }
  next();
};

export const validateForgotPassword = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ message: 'Please provide an email address.' });
  }
  next();
};
