import { Router } from 'express';
import { addPlayer, addPlayers } from '../controllers/playerController';
import { authenticateUser } from '../middleware/authMiddleware';
import { Request, Response } from 'express';
import { PlayerModel, IPlayer } from "../models/playerModel";
import { connectDataBase, SUCCEED } from "../controllers/connectToDatabase";

const playerRouter = Router();

// Apply authentication middleware to all player routes
playerRouter.use(authenticateUser);

// Add a single player
playerRouter.post('/', async (req: Request, res: Response) => {
  try {
    await addPlayer(req.body);
    res.status(201).json({ message: 'Player added successfully' });
  } catch (error) {
    console.error('Error adding player:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
});

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

// Get all players
playerRouter.get('/', async (req: Request, res: Response) => {
  try {
    const dbStatus = await connectDataBase();
    if (dbStatus !== SUCCEED) {
      res.status(500).json({ message: 'Failed to connect to the database' });
      return;
    }

    const players = await PlayerModel.find().sort({ id: 1 });
    res.status(200).json({ players });
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
});

// Get a specific player by ID
playerRouter.get('/:playerId', async (req: Request, res: Response) => {
  try {
    const dbStatus = await connectDataBase();
    if (dbStatus !== SUCCEED) {
      res.status(500).json({ message: 'Failed to connect to the database' });
      return;
    }

    const { playerId } = req.params;
    const player = await PlayerModel.findOne({ id: parseInt(playerId, 10) });

    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    res.status(200).json({ player });
  } catch (error) {
    console.error('Error fetching player:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
});

// Search players by name or ingame name
playerRouter.get('/search/:query', async (req: Request, res: Response) => {
  try {
    const dbStatus = await connectDataBase();
    if (dbStatus !== SUCCEED) {
      res.status(500).json({ message: 'Failed to connect to the database' });
      return;
    }

    const { query } = req.params;

    const players = await PlayerModel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { ingameName: { $regex: query, $options: 'i' } }
      ]
    }).limit(10);

    res.status(200).json({ players });
  } catch (error) {
    console.error('Error searching players:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
});

export default playerRouter;