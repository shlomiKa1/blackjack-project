import express from "express";

export default function createPlayerRouter(controller) {
  const router = express.Router();

  router.post("/start-game", controller.create);
  
  return router;
}
