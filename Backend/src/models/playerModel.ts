import mongoose, { Document, Schema, Model } from "mongoose";

interface IPlayerHistory {
  teamId: number;
  name: string;
  role: string;
  startDate: Date;
  endDate: Date;
}

interface IPlayer extends Document {
  id: number;
  name: string;
  ingameName: string;
  playerRole: string;
  birthday: Date;
  teamId: number;
  history: IPlayerHistory[];
}

const PlayerHistorySchema = new Schema<IPlayerHistory>({
  teamId: { type: Number, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

const PlayerSchema = new Schema<IPlayer>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  ingameName: { type: String, required: true },
  playerRole: { type: String, required: true },
  birthday: { type: Date, required: true },
  teamId: { type: Number, required: true },
  history: { type: [PlayerHistorySchema], required: true },
});

const PlayerModel: Model<IPlayer> = mongoose.model<IPlayer>("Player", PlayerSchema);

export { IPlayer, IPlayerHistory, PlayerModel };
