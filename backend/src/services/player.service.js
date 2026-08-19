import { schemaPlayer } from "../moduls/player";
import AppError, { isValidNewChips } from "../utils/validation";

export default function createPlayerService(playerRepository) {
  async function createPlayer() {
    const { data, error, status } = await playerRepository.insertPlayer();

    if (error) {
      throw AppError(error.message, status);
    }

    const newPlayer = data[0];
    return { id: newPlayer.id, chips: newPlayer.chips };
  }

  async function getPlayer(id) {
    const { data, error, status } = await playerRepository.selectPlayer(id);
    if (error) {
      throw new AppError(error.message, status);
    }

    return { id: data.id, chips: data.chips };
  }

  async function updatePlayer(id, data) {
    const parsed = schemaPlayer.safeParse(data);

    if (!parsed.success) {
      throw new AppError(parsed.error, 400);
    }

    const player = await getPlayer({ id });
    const chips = parsed.data.chips;
    if (!isValidNewChips(player.chips, chips)) {
      throw new AppError(`Your dont have enough chips`, 400);
    }

    const { error, status } = await playerRepository.updatePlayer(id, {
      chips: chips - player.chips,
    });

    if (error) {
      throw new AppError(error.message, status);
    }
    return status;
  }

  return { createPlayer, getPlayer, updatePlayer };
}
