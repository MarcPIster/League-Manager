// Backend/src/routes/team.ts
import { Router } from 'express';
import {
  getAllTeams,
  getTeamById,
  addTeam,
  updateTeam,
  deleteTeam,
  addPlayerToTeam
} from '../controllers/teamController';
import { authenticateUser } from '../middleware/authMiddleware';

const teamRouter = Router();

// Apply authentication middleware to protected routes
teamRouter.use(authenticateUser);

// Get all teams
teamRouter.get('/', getAllTeams);

// Get a specific team by ID
teamRouter.get('/:teamId', getTeamById);

// Add a new team
teamRouter.post('/', addTeam);

// Update a team
teamRouter.put('/:teamId', updateTeam);

// Delete a team
teamRouter.delete('/:teamId', deleteTeam);

// Add a player to a team
teamRouter.post('/:teamId/players', addPlayerToTeam);

export default teamRouter;