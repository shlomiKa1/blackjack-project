import express from "express";

export default function createRoundRoute(roundController) {
  const router = express.Router();
  
  router.post("/start-round", roundController.startRound);
  router.post("/hit", roundController.hit);
  router.post("/stand", roundController.stand);
  router.post("/my-round", roundController.myRound);

  return router;
}
