import express from "express";
import cors from "cors";
import createPlayerRoute from "./routes/player.route.js";
import createRoundRoute from "./routes/round.route.js";
import { errorHandler } from "./middlewares/errorhandler.js";
import { logs } from "./middlewares/logs.js";
import { middlewarePlayer } from "./middlewares/checkIdPlayer.js";

export default function createApp({
  playerController,
  roundController,
  playerService,
}) {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(logs);
  
  app.get("/", (req, res) => res.send("Welcome to BlackJuck game"));
  
  app.use("/", createPlayerRoute(playerController));
  
  const authPlayer = middlewarePlayer(playerService);
  app.use("/", authPlayer, createRoundRoute(roundController));
  
  app.use(errorHandler);

  return app;
}
