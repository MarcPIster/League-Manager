// Backend/src/utils/importData.ts
import fs from 'fs';
import path from 'path';
import { connectDataBase, SUCCEED } from '../controllers/connectToDatabase';
import { TeamModel } from '../models/teamModel';
import { PlayerModel } from '../models/playerModel';

/**
 * Imports initial data from JSON files into the database
 */
export const importData = async (): Promise<void> => {
  try {
    const dbStatus = await connectDataBase();
    if (dbStatus !== SUCCEED) {
      console.error('Failed to connect to the database');
      return;
    }

    // Import teams
    const teamsPath = path.join(__dirname, '../ressources/teams.json');
    const teamsData = JSON.parse(fs.readFileSync(teamsPath, 'utf8'));

    // Check if teams already exist
    const teamsCount = await TeamModel.countDocuments();
    if (teamsCount === 0 && teamsData.teams && teamsData.teams.length > 0) {
      console.log('Importing teams...');
      await TeamModel.insertMany(teamsData.teams);
      console.log(`${teamsData.teams.length} teams imported successfully`);
    } else {
      console.log('Teams already exist, skipping import');
    }

    // Import players
    const playersPath = path.join(__dirname, '../ressources/players.json');
    const playersData = JSON.parse(fs.readFileSync(playersPath, 'utf8'));

    // Check if players already exist
    const playersCount = await PlayerModel.countDocuments();
    if (playersCount === 0 && playersData.players && playersData.players.length > 0) {
      console.log('Importing players...');
      await PlayerModel.insertMany(playersData.players);
      console.log(`${playersData.players.length} players imported successfully`);
    } else {
      console.log('Players already exist, skipping import');
    }

    console.log('Data import completed');
  } catch (error) {
    console.error('Error importing data:', error);
  }
};