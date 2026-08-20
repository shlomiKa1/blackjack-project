import express from "express";
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

  app.use(express.json());
  app.use(logs);

  app.use("/", createPlayerRoute(playerController));

  const authPlayer = middlewarePlayer(playerService);
  app.use("/", authPlayer, createRoundRoute(roundController));

  app.use(errorHandler);

  app.get("/", (req, res) => res.send("Welcome to BlackJuck game"));

  return app;
}
