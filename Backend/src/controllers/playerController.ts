import { PlayerModel, IPlayer } from "../models/playerModel";
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
