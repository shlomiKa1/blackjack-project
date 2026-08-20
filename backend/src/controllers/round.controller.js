export default function createRoundController(roundService) {
  async function startRound(req, res) {
    const round = await roundService.startRound(req.player, req.body);

    res.status(201).send(round);
  }

  async function hit(req, res) {
    const hitGame = await roundService.hit(req.player);

    res.send(hitGame);
  }

  async function stand(req, res) {
    const standGame = await roundService.stand(req.player);

    res.send(standGame);
  }

  async function myRound(req, res) {
    const myRoundGame = await roundService.myRound(req.player);

    res.send(myRoundGame);
  }
  return { startRound, hit, stand, myRound };
}
