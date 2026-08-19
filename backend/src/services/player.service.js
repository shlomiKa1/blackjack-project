import { schemaPlayer } from "../moduls/player.js";
import AppError, { isValidBet } from "../utils/validation.js";

export default function createPlayerService(playerRepository) {
  async function createPlayer() {
    const { data, error, status } = await playerRepository.insertPlayer();

    if (error) {
      throw new AppError(error.message, status);
    }

    const newPlayer = data[0];
    return { id: newPlayer.id, chips: newPlayer.chips };
  }

  async function getPlayer(id) {
    const { data, error, status } = await playerRepository.selectPlayer(id);
    if (error) {
      throw new AppError(`Id Player Not Found`, status);
    }

    const player = data[0];
    return { id: player.id, chips: player.chips };
  }

  async function updatePlayer(id, data) {
    const chips = typeof data === "object" ? data.chips : data;
    const { error, status } = await playerRepository.updatePlayer(id, {
      chips,
    });

    if (error) {
      throw new AppError(error.message, status);
    }
    return status;
  }

  return { createPlayer, getPlayer, updatePlayer };
}
