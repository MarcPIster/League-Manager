import * as process from "process";
import mongoose from "mongoose";

export const SUCCEED = 1;
export const FAILED = -1;

let isConnected = false;

export async function connectDataBase() {
  if (isConnected) {
    console.log("Bereits mit der Datenbank verbunden.");
    return SUCCEED;
  }

  const MONGODB_URI = process.env.MONGODB_URI || "";
  if (!MONGODB_URI) {
    console.error("No MONGODB_URI provided");
    return FAILED;
  }

  try {
    console.log("Connecting to database...");
    mongoose.set("strictQuery", false);

    await mongoose.connect(MONGODB_URI);

    mongoose.connection.once("open", () => {
      console.log("Connected to Database");
      isConnected = true;
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB Connection Error:", err);
      isConnected = false;
    });

    return SUCCEED;
  } catch (e) {
    console.error("Fehler beim Verbinden mit der Datenbank:", e);
    isConnected = false;
    return FAILED;
  }
}
