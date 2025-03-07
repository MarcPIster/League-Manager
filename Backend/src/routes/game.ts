import { Router } from 'express';
import {
  createGame,
  getUserGames,
  getGameById,
  updateGame,
  deleteGame,
  getGameStats
} from '../controllers/gameController';
import { authenticateUser } from '../middleware/authMiddleware';
import { validateGame, validateGameId } from '../middleware/valideGame';

const gameRouter = Router();

// Apply authentication middleware to all game routes
gameRouter.use(authenticateUser);

// Create a new game
gameRouter.post('/', validateGame, createGame);

// Get all games for the authenticated user
gameRouter.get('/', getUserGames);

// Get game statistics
gameRouter.get('/stats', getGameStats);

// Get a specific game by ID
gameRouter.get('/:gameId', validateGameId, getGameById);

// Update a game
gameRouter.put('/:gameId', validateGameId, validateGame, updateGame);

// Delete a game
gameRouter.delete('/:gameId', validateGameId, deleteGame);

export default gameRouter;