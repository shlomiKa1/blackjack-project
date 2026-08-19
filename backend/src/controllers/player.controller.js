export default function createPlayerContoller(playerService) {
  async function create(req, res) {
    const player = await playerService.createPlayer();
    res.status(201).send(player);
  }
  
  return { create };
}
