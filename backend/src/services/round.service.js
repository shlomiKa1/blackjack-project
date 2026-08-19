import { bodyStartRound } from "../moduls/round.js";
import { newRound } from "../utils/helper.js";
import AppError, { isValidBet } from "../utils/validation.js";

export default function createRoundService(playerService, roundRepo) {
  async function startRound(playerId, data) {
    const player = await playerService.getPlayer({ id: playerId });

    const parsed = bodyStartRound.safeParse(data);
    if (!parsed.success) throw new AppError(parsed.error.issues, 400);

    const bet = parsed.data.bet;
    const chips = player.chips;

    if (!isValidBet(chips, bet)) {
      throw new AppError(`not enough chips`, 400);
    }

    const findOpenGame = await roundRepo.findOne({
      playerId,
      status: "in_progress",
    });

    if (findOpenGame) {
      throw new AppError("There is already an open game", 409);
    }

    const { playerCards, dealerCards } = newRound();

    const newround = {
      playerId,
      playerCards,
      dealerCards,
      bet,
      status: "in_progress",
      craetedAt: new Date(),
    };

    const created = await roundRepo.create(newround);

    const newChips = player.chips - bet;
    await playerService.updatePlayer(playerId, newChips);

    return {
      roundId: created.id,
      playerCards: created.playerCards,
      dealerUpCard: created.dealerCards[0],
      newChips,
    };
  }

  return { startRound };
}
