// Backend/src/controllers/teamController.ts
import { Request, Response } from 'express';
import { TeamModel, ITeam } from '../models/teamModel';
import { connectDataBase, SUCCEED } from './connectToDatabase';

/**
 * Get all teams
 * @param req Request object
 * @param res Response object
 */
export const getAllTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const dbStatus = await connectDataBase();
    if (dbStatus !== SUCCEED) {
      res.status(500).json({ message: 'Failed to connect to the database' });
      return;
    }

    const teams = await TeamModel.find().sort({ id: 1 });
    res.status(200).json({ teams });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

/**
 * Get a specific team by ID
 * @param req Request object with teamId parameter
 * @param res Response object
 */
export const getTeamById = async (req: Request, res: Response): Promise<void> => {
  try {
    const dbStatus = await connectDataBase();
    if (dbStatus !== SUCCEED) {
      res.status(500).json({ message: 'Failed to connect to the database' });
      return;
    }

    const { teamId } = req.params;
    const team = await TeamModel.findOne({ id: parseInt(teamId, 10) });

    if (!team) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }

    res.status(200).json({ team });
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

/**
 * Add a new team
 * @param req Request object with team data in body
 * @param res Response object
 */
export const addTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const dbStatus = await connectDataBase();
    if (dbStatus !== SUCCEED) {
      res.status(500).json({ message: 'Failed to connect to the database' });
      return;
    }

    const teamData = req.body;

    // Check if team with this ID already exists
    const existingTeam = await TeamModel.findOne({ id: teamData.id });
    if (existingTeam) {
      res.status(400).json({ message: `Team with ID ${teamData.id} already exists` });
      return;
    }

    const newTeam = await TeamModel.create(teamData);
    res.status(201).json({
      message: 'Team added successfully',
      team: newTeam
    });
  } catch (error) {
    console.error('Error adding team:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

/**
 * Update an existing team
 * @param req Request object with teamId parameter and update data in body
 * @param res Response object
 */
export const updateTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const dbStatus = await connectDataBase();
    if (dbStatus !== SUCCEED) {
      res.status(500).json({ message: 'Failed to connect to the database' });
      return;
    }

    const { teamId } = req.params;
    const updateData = req.body;

    const updatedTeam = await TeamModel.findOneAndUpdate(
        { id: parseInt(teamId, 10) },
        updateData,
        { new: true } // Return the updated document
    );

    if (!updatedTeam) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }

    res.status(200).json({
      message: 'Team updated successfully',
      team: updatedTeam
    });
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

/**
 * Delete a team
 * @param req Request object with teamId parameter
 * @param res Response object
 */
export const deleteTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const dbStatus = await connectDataBase();
    if (dbStatus !== SUCCEED) {
      res.status(500).json({ message: 'Failed to connect to the database' });
      return;
    }

    const { teamId } = req.params;

    const result = await TeamModel.findOneAndDelete({ id: parseInt(teamId, 10) });

    if (!result) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }

    res.status(200).json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

/**
 * Add a player to a team's current roster
 * @param req Request object with teamId parameter and playerId in body
 * @param res Response object
 */
export const addPlayerToTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const dbStatus = await connectDataBase();
    if (dbStatus !== SUCCEED) {
      res.status(500).json({ message: 'Failed to connect to the database' });
      return;
    }

    const { teamId } = req.params;
    const { playerId } = req.body;

    if (!playerId) {
      res.status(400).json({ message: 'Player ID is required' });
      return;
    }

    const team = await TeamModel.findOne({ id: parseInt(teamId, 10) });

    if (!team) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }

    // Check if player is already in the team
    if (team.currentPlayers.includes(playerId)) {
      res.status(400).json({ message: 'Player is already in this team' });
      return;
    }

    // Add player to the team
    team.currentPlayers.push(playerId);
    await team.save();

    res.status(200).json({
      message: 'Player added to team successfully',
      team
    });
  } catch (error) {
    console.error('Error adding player to team:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};