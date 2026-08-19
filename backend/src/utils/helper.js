import { VALUE_CARDS, TYPE_CARDS } from "../config.js";

function openNewCard() {
  const valueRandom = Math.floor(Math.random() * VALUE_CARDS.length);
  const typeRandom = Math.floor(Math.random() * TYPE_CARDS.length);

  return { rank: VALUE_CARDS[valueRandom], suit: TYPE_CARDS[typeRandom] };
}
