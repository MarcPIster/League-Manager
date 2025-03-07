// Backend/src/routes/player.ts
import { Router } from 'express';
import {
  createPlayer,
  getAllPlayers,
  getPlayerById,
  updatePlayer,
  deletePlayer,
  searchPlayers,
  getPlayersByRole,
  getPlayersByTeam,
  addPlayer,
  addPlayers
} from '../controllers/playerController';
import { authenticateUser } from '../middleware/authMiddleware';
import { Request, Response } from 'express';

const playerRouter = Router();

// Apply authentication middleware to all player routes
playerRouter.use(authenticateUser);

// Get all players
playerRouter.get('/', getAllPlayers);

// Search players by name or ingame name
playerRouter.get('/search/:query', searchPlayers);

// Get players by role
playerRouter.get('/role/:role', getPlayersByRole);

// Get players by team
playerRouter.get('/team/:teamId', getPlayersByTeam);

// Get a specific player by ID
playerRouter.get('/:playerId', getPlayerById);

// Create a new player
playerRouter.post('/', createPlayer);

// Add multiple players
playerRouter.post('/batch', async (req: Request, res: Response) => {
  try {
    if (!req.body.players || !Array.isArray(req.body.players)) {
      res.status(400).json({ message: 'Players array is required' });
      return;
    }

    await addPlayers(req.body.players);
    res.status(201).json({ message: 'Players added successfully' });
  } catch (error) {
    console.error('Error adding players:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
});

// Update a player
playerRouter.put('/:playerId', updatePlayer);

// Delete a player
playerRouter.delete('/:playerId', deletePlayer);

export default playerRouter;