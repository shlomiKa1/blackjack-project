const START_GAME_API = `http://localhost:3000/start-game`;
const START_ROUND_API = `http://localhost:3000/start-round`;
const HIT_API = `http://localhost:3000/hit`;
const STAND_API = `http://localhost:3000/stand`;
const GET_ROUND_API = `http://localhost:3000/my-round`;
const CARD_IMG_API = "https://deckofcardsapi.com/static/img/";

let player = JSON.parse(localStorage.getItem("player")) ?? {};
const loading = document.getElementById("loading-game");
const game = document.getElementById("game");
const buttonNewGame = document.getElementById("new-game");
const betForms = document.getElementById("bet-form");

function savePlayer() {
  localStorage.setItem("player", JSON.stringify(player));
}
function normalizeDealerCards(data) {
  return data.dealerCards ?? data.dealerUpCard ?? null;
}

async function renderGame() {
  if (!player || !player.id) {
    await renderNewGame();
  } else {
    const roundGame = await myRoundGet(player.id);
    console.log("New: ", roundGame);

    if (
      !roundGame ||
      roundGame.round === null ||
      roundGame.status !== "in_progress"
    ) {
      promptToStartRound();
    } else {
      displayGame(roundGame);
    }
  }
  savePlayer();
}

function displayGame(data) {
  if (betForms) betForms.classList.add("hidden");
  if (loading) loading.classList.add("hidden");
  if (game) game.classList.remove("hidden");

  console.log(data);
  const dealer = document.getElementById("dealer");

  const dealerCardsArr = normalizeDealerCards(data);
  if (dealer && dealerCardsArr) {
    const dealerCards = Array.isArray(dealerCardsArr)
      ? dealerCardsArr
      : [dealerCardsArr];

    let dealerHTML = "";
    if (data.status === "in_progress") {
      dealerHTML += `
      <img
      src="https://deckofcardsapi.com/static/img/back.png"
      alt="Hidden card"
      class="open-card"
      style="--x: 0em;"
      />
      `;
    }

    dealerHTML += dealerCards
      .map((card, index) => {
        const position = data.status === "in_progress" ? index + 1 : index;
        const x = position * -4;
        return `
      <img
      src="${getCardImage(card.rank, card.suit)}"
      alt="Dealer card"
      class="open-card"
      style="--x: ${x}em;"
      />
      `;
      })
      .join("");

    dealer.innerHTML = dealerHTML;
  }

  const playerContainer = document.getElementById("player");
  if (playerContainer && data.playerCards) {
    playerContainer.innerHTML = data.playerCards
      .map((card, index) => {
        const x = index * -4;

        return `
          <img
            src="${getCardImage(card.rank, card.suit)}"
            alt="${card.rank} of ${card.suit}"
            class="open-card"
            style="--x: ${x}em;"
          />
      `;
      })
      .join("");
  }
  if (data.status && data.status !== "in_progress") {
    if (buttonNewGame) buttonNewGame.classList.remove("hidden");
  } else {
    if (buttonNewGame) buttonNewGame.classList.add("hidden");
  }
}

async function renderNewGame() {
  const newPlayer = await startGamePost();
  if (newPlayer && newPlayer.id) {
    player = { id: newPlayer.id };
    savePlayer();
    promptToStartRound();
  }
}

async function renderRoundGame(bet) {
  const startRound = await startRoundPost(player.id, bet);
  console.log("Start: ", startRound);
  const round = await myRoundGet(player.id);
  displayGame(round);
}

async function hit() {
  const hitGame = await hitPost(player.id);
  console.log("result of hit", hitGame);
  displayGame(hitGame);
}

async function stand() {
  const standGame = await standPost(player.id);
  console.log("result of stand", standGame);
  displayGame(standGame);
}

function promptToStartRound() {
  if (betForms) betForms.classList.remove("hidden");
  if (loading) loading.classList.add("hidden");
  if (game) game.classList.add("hidden");
  if (buttonNewGame) buttonNewGame.classList.add("hidden");

  const dealer = document.getElementById("dealer");
  const playerContainer = document.getElementById("player");
  if (dealer) dealer.innerHTML = "";
  if (playerContainer) playerContainer.innerHTML = "";
}

if (betForms) {
  betForms.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputBet = e.target.elements.bet;
    const valueBet = Number(inputBet.value);

    if (!valueBet || valueBet < 1) {
      alert("Please enter a valid bet greater than 0");
      return;
    }

    await renderRoundGame(valueBet);
  });
}

const hitDeck = document.getElementById("hit");
if (hitDeck) {
  hitDeck.addEventListener("click", async () => await hit());
}

const standBtn = document.getElementById("stand");
if (standBtn) {
  standBtn.addEventListener("click", async () => await stand());
}

if (buttonNewGame) {
  buttonNewGame.addEventListener("click", () => {
    promptToStartRound();
  });
}

// get card
function getCardImage(rank, suit) {
  const cardRank = rank === "10" ? "0" : rank;
  return `${CARD_IMG_API}${cardRank}${suit}.png`;
}

// Read APIs
async function startGamePost() {
  try {
    const res = await fetch(START_GAME_API, {
      method: "POST",
      headers: { "Content-type": "Application/json" },
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (error) {
    return error.message;
  }
}

async function startRoundPost(playerId, bet) {
  try {
    const res = await fetch(START_ROUND_API, {
      method: "POST",
      headers: { "Content-type": "Application/json", "x-player-id": playerId },
      body: JSON.stringify({ bet }),
    });

    return await res.json();
  } catch (error) {
    return error.message;
  }
}

async function hitPost(playerId) {
  try {
    const res = await fetch(HIT_API, {
      method: "POST",
      headers: { "Content-type": "Application/json", "x-player-id": playerId },
    });

    return await res.json();
  } catch (error) {
    return error.message;
  }
}

async function standPost(playerId) {
  try {
    const res = await fetch(STAND_API, {
      method: "POST",
      headers: { "Content-type": "Application/json", "x-player-id": playerId },
    });

    return await res.json();
  } catch (error) {
    return error.message;
  }
}

async function myRoundGet(playerId) {
  try {
    const res = await fetch(GET_ROUND_API, {
      method: "GET",
      headers: { "Content-type": "Application/json", "x-player-id": playerId },
    });

    return await res.json();
  } catch (error) {
    return error.message;
  }
}

renderGame();
