import express from "express";

export default function createPlayerRoute(controller) {
  const router = express.Router();

  router.post("/start-game", controller.create);

  return router;
}
