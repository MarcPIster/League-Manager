import { Request, Response } from 'express';
import { GameModel, IGame } from '../models/gameModel';
import { connectDataBase, SUCCEED } from './connectToDatabase';
import mongoose from 'mongoose';

/**
 * Creates a new game record
 * @param req Request object containing game data in the body
 * @param res Response object
 */
export const createGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const dbStatus = await connectDataBase();
    if (dbStatus !== SUCCEED) {
      res.status(500).json({ message: 'Failed to connect to the database' });
      return;
    }

    // Add the userId from the authenticated user (set by auth middleware)
    const gameData = {
      ...req.body,
      userId: req.user?.id
    };

    // Validate teams array length
    if (!gameData.teams || gameData.teams.length !== 2) {
      res.status(400).json({ message: 'Game must have exactly 2 teams' });
      return;
    }

    const newGame = await GameModel.create(gameData);
    res.status(201).json({
      message: 'Game created successfully',
      game: newGame
    });
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

/**
 * Get all games for the authenticated user
 * @param req Request object
 * @param res Response object
 */
export const getUserGames = async (req: Request, res: Response): Promise<void> => {
  try {
    const dbStatus = await connectDataBase();
    if (dbStatus !== SUCCEED) {
      res.status(500).json({ message: 'Failed to connect to the database' });
      return;
    }

    const userId = req.user?.id;
    const games = await GameModel.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ games });
  } catch (error) {
    console.error('Error fetching user games:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

/**
 * Get a specific game by ID
 * @param req Request object with gameId parameter
 * @param res Response object
 */
export const getGameById = async (req: Request, res: Response): Promise<void> => {
  try {
    const dbStatus = await connectDataBase();
    if (dbStatus !== SUCCEED) {
      res.status(500).json({ message: 'Failed to connect to the database' });
      return;
    }

    const { gameId } = req.params;
    const game = await GameModel.findOne({ gameId: parseInt(gameId, 10) });

    if (!game) {
      res.status(404).json({ message: 'Game not found' });
      return;
    }

    // Check if the game belongs to the authenticated user
    if (game.userId.toString() !== req.user?.id) {
      res.status(403).json({ message: 'Not authorized to access this game' });
      return;
    }

    res.status(200).json({ game });
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

/**
 * Update a game by ID
 * @param req Request object with gameId parameter and update data in body
 * @param res Response object
 */
export const updateGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const dbStatus = await connectDataBase();
    if (dbStatus !== SUCCEED) {
      res.status(500).json({ message: 'Failed to connect to the database' });
      return;
    }

    const { gameId } = req.params;
    const updateData = req.body;

    // Find the game first to check ownership
    const game = await GameModel.findOne({ gameId: parseInt(gameId, 10) });

    if (!game) {
      res.status(404).json({ message: 'Game not found' });
      return;
    }

    // Check if the game belongs to the authenticated user
    if (game.userId.toString() !== req.user?.id) {
      res.status(403).json({ message: 'Not authorized to update this game' });
      return;
    }

    // Validate teams array if it's being updated
    if (updateData.teams && updateData.teams.length !== 2) {
      res.status(400).json({ message: 'Game must have exactly 2 teams' });
      return;
    }

    // Update the game
    const updatedGame = await GameModel.findOneAndUpdate(
        { gameId: parseInt(gameId, 10) },
        updateData,
        { new: true } // Return the updated document
    );

    res.status(200).json({
      message: 'Game updated successfully',
      game: updatedGame
    });
  } catch (error) {
    console.error('Error updating game:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

/**
 * Delete a game by ID
 * @param req Request object with gameId parameter
 * @param res Response object
 */
export const deleteGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const dbStatus = await connectDataBase();
    if (dbStatus !== SUCCEED) {
      res.status(500).json({ message: 'Failed to connect to the database' });
      return;
    }

    const { gameId } = req.params;

    // Find the game first to check ownership
    const game = await GameModel.findOne({ gameId: parseInt(gameId, 10) });

    if (!game) {
      res.status(404).json({ message: 'Game not found' });
      return;
    }

    // Check if the game belongs to the authenticated user
    if (game.userId.toString() !== req.user?.id) {
      res.status(403).json({ message: 'Not authorized to delete this game' });
      return;
    }

    // Delete the game
    await GameModel.findOneAndDelete({ gameId: parseInt(gameId, 10) });

    res.status(200).json({ message: 'Game deleted successfully' });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

/**
 * Get game statistics for a user
 * Provides aggregate data about user's games, teams, and players
 * @param req Request object
 * @param res Response object
 */
export const getGameStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const dbStatus = await connectDataBase();
    if (dbStatus !== SUCCEED) {
      res.status(500).json({ message: 'Failed to connect to the database' });
      return;
    }

    const userId = req.user?.id;

    // Total games count
    const totalGames = await GameModel.countDocuments({ userId });

    // Get team win rates (for teams that appear in user's games)
    const teamStats = await GameModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$teams" },
      {
        $group: {
          _id: "$teams.teamId",
          teamName: { $first: "$teams.teamName" },
          totalGames: { $sum: 1 },
          wins: {
            $sum: {
              $cond: [{ $eq: ["$teams.result", "win"] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          teamId: "$_id",
          teamName: 1,
          totalGames: 1,
          wins: 1,
          winRate: {
            $multiply: [
              { $divide: ["$wins", "$totalGames"] },
              100
            ]
          }
        }
      },
      { $sort: { winRate: -1 } }
    ]);

    // Get top 5 players by KDA
    const playerStats = await GameModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$teams" },
      { $unwind: "$teams.players" },
      {
        $group: {
          _id: "$teams.players.playerId",
          playerName: { $first: "$teams.players.playerName" },
          totalGames: { $sum: 1 },
          totalKills: { $sum: "$teams.players.kills" },
          totalDeaths: { $sum: "$teams.players.deaths" },
          totalAssists: { $sum: "$teams.players.assists" }
        }
      },
      {
        $project: {
          playerId: "$_id",
          playerName: 1,
          totalGames: 1,
          avgKills: { $divide: ["$totalKills", "$totalGames"] },
          avgDeaths: { $divide: ["$totalDeaths", "$totalGames"] },
          avgAssists: { $divide: ["$totalAssists", "$totalGames"] },
          kda: {
            $cond: [
              { $eq: ["$totalDeaths", 0] },
              "$totalKills", // If no deaths, just return kills (perfect KDA)
              {
                $divide: [
                  { $add: ["$totalKills", "$totalAssists"] },
                  "$totalDeaths"
                ]
              }
            ]
          }
        }
      },
      { $sort: { kda: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      totalGames,
      teamStats,
      topPlayers: playerStats
    });
  } catch (error) {
    console.error('Error fetching game statistics:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};