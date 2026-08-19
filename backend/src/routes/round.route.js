import express from "express";

export default function createRoundRoute(roundController) {
  const router = express();

  router.post("/start-round", roundController.startRound);
  router.post("/hit", roundController.hit);
  router.post("/stand", roundController.stand);

  return router;
}
