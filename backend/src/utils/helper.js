import {
  VALUE_CARDS,
  TYPE_CARDS,
  ACE,
  SPACIEL,
  MAX_NUMBER,
  MAX_ACE,
  MIN_ACE,
  SPACIEL_NUMBER,
} from "../config.js";

function openNewCard() {
  const valueRandom = Math.floor(Math.random() * VALUE_CARDS.length);
  const typeRandom = Math.floor(Math.random() * TYPE_CARDS.length);

  return { rank: VALUE_CARDS[valueRandom], suit: TYPE_CARDS[typeRandom] };
}

export function insureNewCard(playerCards = [], dealerCards = []) {
  let newCard;

  while (!newCard) {
    const candidate = openNewCard();

    const exsitsPlayer = playerCards.some(
      (card) => card.rank === candidate.rank && card.suit === candidate.suit,
    );
    const exsitsDealer = dealerCards.some(
      (card) => card.rank === candidate.rank && card.suit === candidate.suit,
    );

    if (!exsitsPlayer && !exsitsDealer) {
      newCard = candidate;
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
  let ace = 0;
  let total = 0;

  for (const card of cards) {
    if (card.rank === ACE) {
      ace += 1;
      total += MAX_ACE;
    } else if (SPACIEL.includes(card.rank)) {
      total += SPACIEL_NUMBER;
    } else {
      total += Number(card.rank);
    }
  }

  // for (let i = 0; i < ace; i++) {
  //   if (total + MAX_ACE > MAX_NUMBER) {
  //     total += MIN_ACE;
  //   } else {
  //     total += MAX_ACE;
  //   }
  // }
  while (total > MAX_NUMBER && ace > 0) {
    total -= MAX_ACE - MIN_ACE;
    ace--;
  }
  return total;
}
