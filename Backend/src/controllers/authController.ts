import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || '';

const checkIfUserExists = async (username: string, email: string): Promise<boolean> => {
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  return !!existingUser;
};

const getLastUserId = async (): Promise<number> => {
    const lastUser = await User.findOne().sort({ _uid: -1 });
    return lastUser ? lastUser._uid : 0;
}

const createUser = async (username: string, email: string, password: string): Promise<IUser> => {
  const _uid = await getLastUserId() + 1;
  const newUser = new User({ _uid, username, email, password });
  await newUser.save();
  return newUser;
};

const loginUser = async (username: string, password: string): Promise<IUser | null> => {
  const user = await User.findOne({
    $or: [{ username }, { email: username }],
  });
  if (!user) {
    return null;
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return null;
  }
  return user;
};

const createToken = (user: IUser): string => {
    return jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        JWT_SECRET,
        { expiresIn: '2h' }
    );
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (await checkIfUserExists(username, email)) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const newUser = await createUser(username, email, password);
    if (!newUser) {
      res.status(500).json({ message: 'Failed to create user' });
      return;
    }

    const token = createToken(newUser);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { username: newUser.username, email: newUser.email },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error during registration' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = await loginUser(username, password);
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = createToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: { username: user.username, email: user.email },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    // TODO: Implementiere die Logik zum Zurücksetzen des Passworts, z.B. einen Reset-Link per Email senden
    console.log(`Forgot password request for email: ${email}`);
    res.json({ message: 'Password reset instructions sent', email });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error during forgot password' });
  }
};

