const START_GAME_API = `http://localhost:3000/start-game`;
const START_ROUND_API = `http://localhost:3000/start-round`;
const HIT_API = `http://localhost:3000/hit`;
const STAND_API = `http://localhost:3000/stand`;
const GET_ROUND_API = `http://localhost:3000/my-round`;

// const players = JSON.parse(localStorage.getItem("players")) ?? [];

// async function renderGame() {
//   if (players.length === 0) {
//     return await renderNewGame();
//   } else {
//     renderStartRound();
//   }
// }

// Read APIs
async function startGamePost() {
  try {
    const res = await fetch(START_GAME_API, {
      method: "POST",
      headers: { "Content-type": "Application/json" },
    });

    if (res.ok) {
      const data = await res.json();
      console.log(data);
      return data;
    }
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
}

