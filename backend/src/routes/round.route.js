import express from "express";

export default function createRoundRoute(roundController) {
  const router = express();

  router.post("/start-round", roundController.startRound);
  router.post("/hit", roundController.hit);

  return router;
}
