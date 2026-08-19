import { VALUE_CARDS, TYPE_CARDS, ACE, SPACIEL } from "../config.js";

function openNewCard() {
  const valueRandom = Math.floor(Math.random() * VALUE_CARDS.length);
  const typeRandom = Math.floor(Math.random() * TYPE_CARDS.length);

  return { rank: VALUE_CARDS[valueRandom], suit: TYPE_CARDS[typeRandom] };
}

export function insureNewCard(playerCards = [], dealerCards = []) {
  let newCard;

  while (!newCard) {
    newCard = openNewCard();

    const exsitsPlayer = playerCards.some(
      (card) => card.rank === newCard.rank && card.suit === newCard.suit,
    );
    const exsitsDealer = dealerCards.some(
      (card) => card.rank === newCard.rank && card.suit === newCard.suit,
    );

    if (exsitsPlayer || exsitsDealer) {
      newCard = {};
      break;
    }
  }
  return newCard;
}

export function newRound() {
  const playerCards = [];
  const dealerCards = [];

  playerCards.push(insureNewCard(playerCards, dealerCards));
  playerCards.push(insureNewCard(playerCards, dealerCards));
  dealerCards.push(insureNewCard(playerCards, dealerCards));
  dealerCards.push(insureNewCard(playerCards, dealerCards));

  return { playerCards, dealerCards };
}

export function sumNumberCard(cards) {
  const ace = 0;
  let total = 0;

  for (const card in cards) {
    if (card.rank === ACE) {
      ace += 1;
    } else if (SPACIEL.includes(card.rank)) {
      total += 10;
    } else {
      total += +card.rank;
    }
  }

  if (ace > 0) {
    if (total + ace * 11 > 21) {
      total += ace * 1;
    } else {
      total += ace * 11;
    }
  }
  return total;
}
