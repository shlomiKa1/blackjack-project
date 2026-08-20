const START_GAME_API = `http://localhost:3000/start-game`;
const START_ROUND_API = `http://localhost:3000/start-round`;
const HIT_API = `http://localhost:3000/hit`;
const STAND_API = `http://localhost:3000/stand`;
const GET_ROUND_API = `http://localhost:3000/my-round`;

const players = JSON.parse(localStorage.getItem("players")) ?? [];



function savePlayers() {
  localStorage.setItem("players", JSON.stringify(players));
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
      console.log(data);
      return data;
    }
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
}

async function startRoundPost(playerId, bet) {
  try {
    const res = await fetch(START_ROUND_API, {
      method: "POST",
      headers: { "Content-type": "Application/json", "x-player-id": playerId },
      body: { bet },
    });

    return await res.json();
  } catch (error) {
    return error.message;
  }
}

async function hitPost(playerId) {
  try {
    const res = await fetch(HIT_API, {
      method: "GET",
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
      method: "GET",
      headers: { "Content-type": "Application/json", "x-player-id": playerId },
    });

    return await res.json();
  } catch (error) {
    return error.message;
  }
}

async function myRoundPost(playerId) {
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
