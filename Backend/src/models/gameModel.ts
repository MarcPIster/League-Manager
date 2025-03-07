import mongoose, { Document, Schema, Model } from "mongoose";

/**
 * Interface representing a player's performance in a game
 */
interface IPlayerPerformance {
  playerId: number;
  playerName: string;
  teamId: number;
  role: string;
  kills: number;
  deaths: number;
  assists: number;
  cs: number;
  gold: number;
  // Additional stats could be added as needed
}

/**
 * Interface representing a team's performance in a game
 */
interface ITeamPerformance {
  teamId: number;
  teamName: string;
  totalKills: number;
  totalDeaths: number;
  totalAssists: number;
  dragons: number;
  barons: number;
  towers: number;
  result: "win" | "loss";
  players: IPlayerPerformance[];
}

/**
 * Interface representing a game document in MongoDB
 */
export interface IGame extends Document {
  gameId: number;
  date: Date;
  duration: number; // in minutes
  patch: string; // game version
  teams: [ITeamPerformance, ITeamPerformance]; // Always exactly 2 teams
  mvpPlayerId?: number; // optional MVP player ID
  userId: mongoose.Types.ObjectId; // Reference to the user who created this game
  createdAt: Date;
  updatedAt: Date;
}

// Schema for player performance within a game
const PlayerPerformanceSchema = new Schema<IPlayerPerformance>({
  playerId: { type: Number, required: true },
  playerName: { type: String, required: true },
  teamId: { type: Number, required: true },
  role: { type: String, required: true },
  kills: { type: Number, required: true, default: 0 },
  deaths: { type: Number, required: true, default: 0 },
  assists: { type: Number, required: true, default: 0 },
  cs: { type: Number, required: true, default: 0 },
  gold: { type: Number, required: true, default: 0 },
});

// Schema for team performance within a game
const TeamPerformanceSchema = new Schema<ITeamPerformance>({
  teamId: { type: Number, required: true },
  teamName: { type: String, required: true },
  totalKills: { type: Number, required: true, default: 0 },
  totalDeaths: { type: Number, required: true, default: 0 },
  totalAssists: { type: Number, required: true, default: 0 },
  dragons: { type: Number, required: true, default: 0 },
  barons: { type: Number, required: true, default: 0 },
  towers: { type: Number, required: true, default: 0 },
  result: { type: String, required: true, enum: ["win", "loss"] },
  players: { type: [PlayerPerformanceSchema], required: true },
});

// Main game schema
const GameSchema = new Schema<IGame>({
  gameId: { type: Number, required: true, unique: true },
  date: { type: Date, required: true, default: Date.now },
  duration: { type: Number, required: true }, // in minutes
  patch: { type: String, required: true },
  teams: { type: [TeamPerformanceSchema], required: true, validate: [arrayLength, "Teams array must contain exactly 2 teams"] },
  mvpPlayerId: { type: Number },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Custom validator to ensure we have exactly 2 teams
function arrayLength(val: any[]) {
  return val.length === 2;
}

// Creating a counter to auto-increment gameId
GameSchema.pre<IGame>('save', async function(next) {
  if (this.isNew) {
    try {
      const lastGame = await GameModel.findOne().sort({ gameId: -1 });
      this.gameId = lastGame ? lastGame.gameId + 1 : 1;
      next();
    } catch (error) {
      next(error as Error);
    }
  } else {
    next();
  }
});

const GameModel: Model<IGame> = mongoose.model<IGame>("Game", GameSchema);

export { IPlayerPerformance, ITeamPerformance, GameModel };