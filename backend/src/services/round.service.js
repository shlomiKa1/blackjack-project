import { bodyStartRound } from "../moduls/round.js";
import { insureNewCard, newRound, sumNumberCard } from "../utils/helper.js";
import AppError, { isValidBet, isValidNumber } from "../utils/validation.js";

export default function createRoundService(playerService, roundRepo) {
  async function startRound(player, data) {
    const playerId = player.id;

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

  async function hit(player) {
    const playerId = player.id;
    const game = await roundRepo.findOne({
      playerId,
      status: "in_progress",
    });

    if (!game) {
      throw new AppError(
        `There is not an opining game for player ${playerId}`,
        400,
      );
    }

    let status = game.status;
    let playerTotal = sumNumberCard(game.playerCards);
    const dealerTotal = sumNumberCard(game.dealerCards);

    if (!isValidNumber(playerTotal)) status = "player_bust";

    const bet = game.bet;
    const chips = player.chips;
    let newChips = chips;

    if (!isValidNumber(dealerTotal)) {
      status = "dealer_bust";
      newChips += bet * 2;
    }

    const newCard = insureNewCard(game.playerCards, game.dealerCards);
    game.playerCards.push(newCard);

    playerTotal = sumNumberCard(game.playerCards);
    if (!isValidNumber(playerTotal)) status = "player_bust";

    if (newChips !== chips) {
      await playerService.updatePlayer(playerId, newChips);
    }

    const id = game._id;
    const newData = { playerCards: game.playerCards, status: status };
    await roundRepo.update(id, newData);

    return {
      playerCards: game.playerCards,
      playerTotal,
      status,
      chips: newChips,
    };
  }

  async function stand(player) {
    const playerId = player.id;
    const game = await roundRepo.findOne({
      playerId,
      status: "in_progress",
    });

    if (!game) {
      throw new AppError(`Game for player ${playerId} is not exsits`);
    }

    const playerCards = game.playerCards;
    const dealerCards = game.dealerCards;
    let status = game.status;

    const playerTotal = sumNumberCard(playerCards);
    if (!isValidNumber(playerTotal)) status = "player_bust";

    let dealerTotal = sumNumberCard(dealerCards);
    while (dealerTotal < 17) {
      dealerCards.push(insureNewCard(playerCards, dealerCards));
      dealerTotal = sumNumberCard(dealerCards);
    }

    if (!isValidNumber(dealerTotal)) status = "dealer_bust";

    const chips = player.chips;
    const bet = game.bet;
    let newChips = chips;

    if (status === "in_progress") {
      if (dealerTotal === playerTotal) {
        status = "push";
        newChips += bet;
      } else if (dealerTotal < playerTotal) {
        status = "player_win";
        newChips += bet * 2;
      } else {
        status = "dealer_win";
      }
    }

    if (newChips != chips) {
      await playerService.updatePlayer(playerId, newChips);
    }

    const id = game._id;
    await roundRepo.update(id, { dealerCards, status });

    return {
      playerCards,
      dealerCards,
      playerTotal,
      dealerTotal,
      status,
      chips: newChips,
    };
  }

  async function myRound(player) {
    const playerId = player.id;
    const game = await roundRepo.findOne({
      playerId,
      status: "in_progress",
    });

    if (!game) return { round: null };

    return {
      roundId: game.roundId,
      playerCards: game.playerCards,
      dealerCards: game.dealerCards[0],
      bet: game.bet,
      status: game.status,
      chips: player.chips,
    };
  }

  return { startRound, hit, stand, myRound };
}
