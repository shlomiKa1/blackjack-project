export default function createRoundController(roundService) {
  async function startRound(req, res) {
    const playerId = req.headers["x-player-id"];
    console.log(req.body);

    const round = await roundService.startRound(playerId, req.body);

    res.status(201).send(round);
  }

  return { startRound };
}
