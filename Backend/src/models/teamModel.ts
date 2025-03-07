// Backend/src/models/teamModel.ts
import mongoose, { Document, Schema, Model } from "mongoose";

interface ITeamPlayerHistory {
  playerId: number;
  name: string;
  role: string;
  startDate: Date;
  endDate: Date;
}

export interface ITeam extends Document {
  id: number;
  name: string;
  ingameName: string;
  foundDate: Date;
  currentPlayers: number[];
  playerHistory: ITeamPlayerHistory[];
}

const TeamPlayerHistorySchema = new Schema<ITeamPlayerHistory>({
  playerId: { type: Number, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

const TeamSchema = new Schema<ITeam>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  ingameName: { type: String, required: true },
  foundDate: { type: Date, required: true },
  currentPlayers: { type: [Number], required: true },
  playerHistory: { type: [TeamPlayerHistorySchema], required: true },
});

const TeamModel: Model<ITeam> = mongoose.model<ITeam>("Team", TeamSchema);

export { ITeamPlayerHistory, TeamModel };