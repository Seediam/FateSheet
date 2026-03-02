import OBR from "https://esm.sh/@owlbear-rodeo/sdk";

const DB_KEY = "fatesheet_db";

let state = {
  characters: {},
  combat: null
};

let playerId = null;

/* ========================= */
/*   INIT CORRETO DO SDK     */
/* ========================= */

OBR.onReady(async () => {
  playerId = OBR.player.id;

  await loadState();
  setupMetadataListener();
  setupBroadcastListener();

  document.getElementById("loading").style.display = "none";
  document.getElementById("app").style.display = "block";

  renderAll();
});

/* ========================= */
/*     DATABASE ROOM         */
/* ========================= */

async function loadState() {
  const metadata = await OBR.room.getMetadata();
  state = metadata[DB_KEY] || { characters: {}, combat: null };
}

async function saveState() {
  await OBR.room.setMetadata({
    [DB_KEY]: state
  });
}

function setupMetadataListener() {
  OBR.room.onMetadataChange((metadata) => {
    state = metadata[DB_KEY] || { characters: {}, combat: null };
    renderAll();
  });
}

/* ========================= */
/*        CHARACTERS         */
/* ========================= */

window.createCharacter = async function (charData) {
  const id = crypto.randomUUID();

  state.characters[id] = {
    ...charData,
    owner: playerId
  };

  await saveState();
};

window.updateCharacter = async function (id, updates) {
  if (!state.characters[id]) return;

  state.characters[id] = {
    ...state.characters[id],
    ...updates
  };

  await saveState();
};

window.deleteCharacter = async function (id) {
  delete state.characters[id];
  await saveState();
};

/* ========================= */
/*        COMBAT             */
/* ========================= */

window.startCombat = async function (participants) {
  state.combat = {
    active: true,
    turn: 0,
    order: participants
  };

  await saveState();
};

window.nextTurn = async function () {
  if (!state.combat) return;

  state.combat.turn =
    (state.combat.turn + 1) % state.combat.order.length;

  await saveState();
};

window.endCombat = async function () {
  state.combat = null;
  await saveState();
};

/* ========================= */
/*        ROLAGENS           */
/* ========================= */

window.rollDice = async function (characterId, attribute, sides = 20) {
  const result = Math.floor(Math.random() * sides) + 1;

  const payload = {
    characterId,
    attribute,
    result,
    timestamp: Date.now()
  };

  // NÃO abre modal local aqui
  await OBR.broadcast.sendMessage("fatesheet_roll", payload);
};

/* ========================= */
/*     BROADCAST LISTENER    */
/* ========================= */

function setupBroadcastListener() {
  OBR.broadcast.onMessage("fatesheet_roll", (event) => {
    openRollModal(event.data);
  });
}

/* ========================= */
/*        MODAL              */
/* ========================= */

async function openRollModal(data) {
  await OBR.modal.open({
    url: `/FateSheet/resultado.html?data=${encodeURIComponent(
      JSON.stringify(data)
    )}`,
    height: 400,
    width: 400
  });
}

/* ========================= */
/*        RENDER             */
/* ========================= */

function renderAll() {
  renderCharacters();
  renderCombat();
}

function renderCharacters() {
  const container = document.getElementById("character-list");
  if (!container) return;

  container.innerHTML = "";

  Object.entries(state.characters).forEach(([id, char]) => {
    const div = document.createElement("div");
    div.className = "char-card";
    div.innerHTML = `
      <strong>${char.name}</strong><br/>
      HP: ${char.hp ?? "-"} |
      MP: ${char.mp ?? "-"}
    `;
    container.appendChild(div);
  });
}

function renderCombat() {
  const container = document.getElementById("combat-tracker");
  if (!container) return;

  container.innerHTML = "";

  if (!state.combat || !state.combat.active) {
    container.innerHTML = "Sem combate ativo.";
    return;
  }

  state.combat.order.forEach((id, index) => {
    const char = state.characters[id];
    if (!char) return;

    const div = document.createElement("div");
    div.className =
      index === state.combat.turn
        ? "turn-active"
        : "turn";

    div.textContent = char.name;
    container.appendChild(div);
  });
}
