import { PORT } from "./config.js";
import { db } from "./databases/mongodb.connection.js";
import { supabase } from "./databases/supabase.connection.js";
import createPlayerRepository from "./repositories/player.repository.js";
import createPlayerService from "./services/player.service.js";
import createPlayerContoller from "./controllers/player.controller.js";
import createRoundRepository from "./repositories/round.repository.js";
import createRoundService from "./services/round.service.js";
import createRoundController from "./controllers/round.controller.js";
import createApp from "./app.js";

async function start() {
  const playerRepository = createPlayerRepository(supabase);
  const playerService = createPlayerService(playerRepository);
  const playerController = createPlayerContoller(playerService);

  const collection = db.collection("round");
  const roundRepository = createRoundRepository(collection);
  const roundService = createRoundService(playerService, roundRepository);
  const roundController = createRoundController(roundService);

  const app = createApp({ playerController, roundController });

  app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
}

start().catch((err) => {
  console.error(`Failed to start server:`, err);
  process.exit(1);
});
