import { bodyStartRound } from "../moduls/round.js";
import { insureNewCard, newRound, sumNumberCard } from "../utils/helper.js";
import AppError, { isValidBet, isValidNumber } from "../utils/validation.js";

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

  async function hit(playerId) {
    const player = await playerService.getPlayer(playerId);
    const findOpenGame = await roundRepo.findOne({
      playerId,
      status: "in_progress",
    });

    if (!findOpenGame) {
      throw new AppError(`Game for player ${playerId} is not exsits`);
    }

    let status = findOpenGame.status;

    const playerCards = findOpenGame.playerCards;
    const dealerCards = findOpenGame.dealerCards;
    const playerTotal = sumNumberCard(playerCards);
    const dealerTotal = sumNumberCard(dealerCards);

    if (!isValidNumber(total)) status = "player_bust";
    if (!isValidNumber(total)) status = "dealer_bust";

    const newCard = insureNewCard(playerCards, dealerCards);
    playerCards.push(newCard);

    if (!isValidNumber(sumNumberCard(playerCards))) status = "player_win";

    const id = findOpenGame._id;
    const newData = { playerCards, status };
    const updatedGame = await roundRepo.update(id, newData);

    return { playerCards, playerTotal, status, chips: player.chips };
  }

  return { startRound, hit };
}
