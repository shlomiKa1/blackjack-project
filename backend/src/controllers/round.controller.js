export default function createRoundController(roundService) {
  async function startRound(req, res) {
    const playerId = req.headers["x-player-id"];
    const round = await roundService.startRound(playerId, req.body);

    res.status(201).send(round);
  }

  async function hit(req, res) {
    const playerId = req.headers;
    const hitGame = await roundService.hit(playerId);

    res.send(hitGame);
  }

  return { startRound, hit };
}
