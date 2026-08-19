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

  async function stand(req, res) {
    const playerId = req.headers;
    const standGame = await roundService.stand(playerId);

    res.send(standGame);
  }

  async function myRound(req, res) {
    const playerId = req.headers;
    const myRoundGame = await roundService.myRound(playerId);

    res.send(myRoundGame);
  }
  return { startRound, hit, stand, myRound };
}
