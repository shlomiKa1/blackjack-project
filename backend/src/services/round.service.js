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
    const player = await playerService.getPlayer({ id: playerId });
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

    let newChips = player.chips;
    if (!isValidNumber(playerTotal)) status = "player_bust";

    if (!isValidNumber(dealerTotal)) {
      status = "dealer_bust";
      newChips += chips * 2;
    }

    const newCard = insureNewCard(playerCards, dealerCards);
    playerCards.push(newCard);

    if (!isValidNumber(sumNumberCard(playerCards))) status = "player_bust";

    if (newChips !== player.chips) {
      await playerService.updatePlayer(playerId, newChips);
    }

    const id = findOpenGame._id;
    const newData = { playerCards, status };
    const updatedGame = await roundRepo.update(id, newData);

    return { playerCards, playerTotal, status, chips: newChips };
  }

  async function stand(playerId) {
    const player = await playerService.getPlayer({ id: playerId });
    const findOpenGame = await roundRepo.findOne({
      playerId,
      status: "in_progress",
    });

    if (!findOpenGame) {
      throw new AppError(`Game for player ${playerId} is not exsits`);
    }

    const playerCards = findOpenGame.playerCards;
    const dealerCards = findOpenGame.dealerCards;
    let status = findOpenGame.status;

    const playerTotal = sumNumberCard(playerCards);
    if (!isValidNumber(playerTotal)) status = "player_bust";

    let dealerTotal = sumNumberCard(dealerCards);
    while (total < 17) {
      dealerCards.push(insureNewCard(playerCards, dealerCards));
      dealerTotal = sumNumberCard(dealerCards);
    }

    if (!isValidNumber(dealerTotal)) status = "dealer_bust";

    let newChips = player.chips;
    const bet = findOpenGame.bet;
    if (status === "in_progress") {
      if (dealerTotal === playerTotal) {
        status = "push";
        newChips += bet;
      } else if (dealerTotal < playerTotal) {
        status = "player_win";
        newChips += bet * 2;
      } else {
        status = "dealer_bust";
      }
    }

    if (newChips != chips) {
      await playerService.updatePlayer(playerId, newChips);
    }

    const id = findOpenGame._id;
    const updated = await roundRepo.update(id, { dealerCards, status });

    return {
      playerCards,
      dealerCards,
      playerTotal,
      dealerTotal,
      status,
      chips: newChips,
    };
  }

  async function name(params) {
    const player = await playerService.getPlayer({ id: playerId });
    const findOpenGame = await roundRepo.findOne({
      playerId,
      status: "in_progress",
    });

    if (!findOpenGame) return { round: null };

    return {
      roundId: findOpenGame.roundId,
      playerCards: findOpenGame.playerCards,
      dealerCards: findOpenGame.dealerCards[0],
      bet: findOpenGame.bet,
      status: findOpenGame.status,
    };
  }

  return { startRound, hit, stand };
}
