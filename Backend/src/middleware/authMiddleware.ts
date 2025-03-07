import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || '';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        email: string;
      }
    }
  }
}

/**
 * Middleware to authenticate and protect routes
 * Verifies JWT token from Authorization header and adds user info to request
 */
export const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ message: 'Authorization header missing' });
      return;
    }

    // Check if it's a Bearer token
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      res.status(401).json({ message: 'Invalid authorization format. Expected: Bearer [token]' });
      return;
    }

    const token = parts[1];

    // Verify the token
    if (!JWT_SECRET) {
      res.status(500).json({ message: 'JWT_SECRET not configured' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string; email: string };

    // Add user info to the request
    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email
    };

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid token' });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired' });
    } else {
      console.error('Authentication error:', error);
      res.status(500).json({ message: 'Internal server error during authentication' });
    }
  }
};

/**
 * Optional authentication middleware that adds user to request if token is valid
 * but does not block the request if authentication fails
 */
export const optionalAuthenticateUser = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer' && JWT_SECRET) {
        const token = parts[1];
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string; email: string };
          req.user = {
            id: decoded.id,
            username: decoded.username,
            email: decoded.email
          };
        } catch (tokenError) {
          // Just skip adding user to request if token is invalid
          console.log('Optional auth: Invalid token');
        }
      }
    }

    // Always proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Always proceed even if there's an error
    console.error('Error in optional authentication:', error);
    next();
  }
};