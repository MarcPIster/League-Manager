// Backend/src/controllers/playerController.ts
import { Request, Response } from 'express';
import { PlayerModel, IPlayer } from "../models/playerModel";
import { TeamModel } from "../models/teamModel";
import { connectDataBase, SUCCEED } from "./connectToDatabase";

/**
 * Checks if a player already exists.
 * If not, adds them to the database.
 * @param player - The player to be added.
 */
export const addPlayer = async (player: IPlayer): Promise<void> => {
  try {
    const dbStatus = await connectDataBase();
    if (dbStatus !== SUCCEED) {
      console.error("Error: Failed to connect to the database.");
      return;
    }

    const existingPlayer = await PlayerModel.exists({ id: player.id });
    if (existingPlayer) {
      console.log(`Player with ID ${player.id} already exists: ${player.name}`);
      return;
    }

    await PlayerModel.create(player);
    console.log(`Player ${player.name} has been added!`);
  } catch (error) {
    console.error("Error adding the player:", error);
  }
};

/**
 * Adds multiple players to the database if they do not already exist.
 * @param players - A list of players to be added.
 */
export const addPlayers = async (players: IPlayer[]): Promise<void> => {
  try {
    const dbStatus = await connectDataBase();
    if (dbStatus !== SUCCEED) {
      console.error("Error: Failed to connect to the database.");
      return;
    }

    const playerIds = players.map(player => player.id);
    const existingPlayers = await PlayerModel.find({ id: { $in: playerIds } }).select("id").lean();

    const existingIds = new Set(existingPlayers.map(p => p.id));
    const newPlayers = players.filter(player => !existingIds.has(player.id));

    if (newPlayers.length === 0) {
      console.log("All players already exist.");
      return;
    }

    await PlayerModel.insertMany(newPlayers);
    console.log(`${newPlayers.length} players have been added!`);
  } catch (error) {
    console.error("Error adding players:", error);
  }
};

/**
 * Add a new player to the database (HTTP route handler)
 * @param req Request object with player data in body
 * @param res Response object
 */
export const createPlayer = async (req: Request, res: Response): Promise<void> => {
  try {
    const dbStatus = await connectDataBase();
    if (dbStatus !== SUCCEED) {
      res.status(500).json({ message: 'Failed to connect to the database' });
      return;
    }

    const playerData = req.body;

    // Check if player with this ID already exists
    const existingPlayer = await PlayerModel.findOne({ id: playerData.id });
    if (existingPlayer) {
      res.status(400).json({ message: `Player with ID ${playerData.id} already exists` });
      return;
    }

    const newPlayer = await PlayerModel.create(playerData);

    // If the player is assigned to a team, update the team's currentPlayers array
    if (playerData.teamId) {
      const team = await TeamModel.findOne({ id: playerData.teamId });
      if (team && !team.currentPlayers.includes(playerData.id)) {
        team.currentPlayers.push(playerData.id);
        await team.save();
      }
    }

    res.status(201).json({
      message: 'Player created successfully',
      player: newPlayer
    });
  } catch (error) {
    console.error('Error creating player:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// [All other new controller functions]
// ...

/**
 * Get all players from the database
 * @param req Request object
 * @param res Response object
 */
export const getAllPlayers = async (req: Request, res: Response): Promise<void> => {
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
};

// [remainder of controller functions]
// ...

/**
 * Get a specific player by ID
 * @param req Request object with playerId parameter
 * @param res Response object
 */
export const getPlayerById = async (req: Request, res: Response): Promise<void> => {
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
};

/**
 * Update an existing player
 * @param req Request object with playerId parameter and update data in body
 * @param res Response object
 */
export const updatePlayer = async (req: Request, res: Response): Promise<void> => {
  try {
    const dbStatus = await connectDataBase();
    if (dbStatus !== SUCCEED) {
      res.status(500).json({ message: 'Failed to connect to the database' });
      return;
    }

    const { playerId } = req.params;
    const updateData = req.body;

    const player = await PlayerModel.findOne({ id: parseInt(playerId, 10) });

    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    // If the team is changing, update both teams
    if (updateData.teamId && updateData.teamId !== player.teamId) {
      // Remove from old team
      const oldTeam = await TeamModel.findOne({ id: player.teamId });
      if (oldTeam) {
        oldTeam.currentPlayers = oldTeam.currentPlayers.filter(id => id !== player.id);
        await oldTeam.save();
      }

      // Add to new team
      const newTeam = await TeamModel.findOne({ id: updateData.teamId });
      if (newTeam && !newTeam.currentPlayers.includes(player.id)) {
        newTeam.currentPlayers.push(player.id);
        await newTeam.save();
      }
    }

    const updatedPlayer = await PlayerModel.findOneAndUpdate(
        { id: parseInt(playerId, 10) },
        updateData,
        { new: true } // Return the updated document
    );

    res.status(200).json({
      message: 'Player updated successfully',
      player: updatedPlayer
    });
  } catch (error) {
    console.error('Error updating player:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

/**
 * Delete a player
 * @param req Request object with playerId parameter
 * @param res Response object
 */
export const deletePlayer = async (req: Request, res: Response): Promise<void> => {
  try {
    const dbStatus = await connectDataBase();
    if (dbStatus !== SUCCEED) {
      res.status(500).json({ message: 'Failed to connect to the database' });
      return;
    }

    const { playerId } = req.params;

    // Find player first to get the team ID
    const player = await PlayerModel.findOne({ id: parseInt(playerId, 10) });

    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    // Remove player from team
    if (player.teamId) {
      const team = await TeamModel.findOne({ id: player.teamId });
      if (team) {
        team.currentPlayers = team.currentPlayers.filter(id => id !== player.id);
        await team.save();
      }
    }

    // Delete the player
    await PlayerModel.findOneAndDelete({ id: parseInt(playerId, 10) });

    res.status(200).json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

/**
 * Search players by name or ingame name
 * @param req Request object with query parameter
 * @param res Response object
 */
export const searchPlayers = async (req: Request, res: Response): Promise<void> => {
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
};

/**
 * Get players by role
 * @param req Request object with role parameter
 * @param res Response object
 */
export const getPlayersByRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const dbStatus = await connectDataBase();
    if (dbStatus !== SUCCEED) {
      res.status(500).json({ message: 'Failed to connect to the database' });
      return;
    }

    const { role } = req.params;

    const players = await PlayerModel.find({
      playerRole: { $regex: role, $options: 'i' }
    }).sort({ id: 1 });

    res.status(200).json({ players });
  } catch (error) {
    console.error('Error fetching players by role:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

/**
 * Get all players from a specific team
 * @param req Request object with teamId parameter
 * @param res Response object
 */
export const getPlayersByTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const dbStatus = await connectDataBase();
    if (dbStatus !== SUCCEED) {
      res.status(500).json({ message: 'Failed to connect to the database' });
      return;
    }

    const { teamId } = req.params;

    const players = await PlayerModel.find({
      teamId: parseInt(teamId, 10)
    }).sort({ playerRole: 1 });

    res.status(200).json({ players });
  } catch (error) {
    console.error('Error fetching players by team:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};