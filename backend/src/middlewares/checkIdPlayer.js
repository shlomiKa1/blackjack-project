export function middlewarePlayer(playerService) {
  return async function getPlayerId(req, res, next) {
    try {
      const playerId = req.headers["x-player-id"];

      if (!playerId) {
        return res.status(401).send({ error: `ID ${playerId} Not Exists` });
      }

      const player = await playerService.getPlayer({ id: playerId });
      req.player = player;

      next();
    } catch (error) {
      res.status(401).send(error.message);
    }
  };
}
