import AppError from "../utils/validation";

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

    return data;
  }

  return { createPlayer, getPlayer };
}
