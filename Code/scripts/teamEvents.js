let pokemon = [];
fetch("../data/pokemon_dex_name.json")
  .then((r) => r.json())
  .then((data) => { pokemon = data; });

// respect saved sprite preference on load
document.getElementById("showSprites").checked = loadSpritePref();

document.getElementById("showSprites").addEventListener("change", function (e) {
  saveSpritePref(e.target.checked);
  renderTeams();
});

document.getElementById("addTeamCard").addEventListener("click", function () {
  document.getElementById("addTeamCard").hidden = true;
  document.getElementById("createTeamForm").hidden = false;
  document.getElementById("teamNameInput").value = "";
  document.getElementById("teamNameInput").focus();
});

document.getElementById("confirmCreateTeam").addEventListener("click", function () {
  const name = document.getElementById("teamNameInput").value.trim();
  if (!name) return;
  document.getElementById("createTeamForm").hidden = true;
  document.getElementById("addTeamCard").hidden = false;
  createTeam(name);
});

document.getElementById("cancelCreateTeam").addEventListener("click", function () {
  document.getElementById("createTeamForm").hidden = true;
  document.getElementById("addTeamCard").hidden = false;
});

document.getElementById("slotSearchBtn").addEventListener("click", function () {
  const query = document.getElementById("slotSearch").value.trim().toLowerCase();
  if (!query) return;

  const errorEl = document.getElementById("slotError");
  const resultEl = document.getElementById("slotResult");
  const confirmBtn = document.getElementById("slotConfirm");
  errorEl.hidden = true;
  resultEl.innerHTML = "";
  confirmBtn.hidden = true;
  pendingPokemon = null;

  const dex = nameToDex(query, pokemon);
  if (!dex) {
    errorEl.textContent = "No Pokémon found. Please enter a valid name.";
    errorEl.hidden = false;
    return;
  }

  // uses queryPokeAPI + processJSON from util.js
  queryPokeAPI(dex)
    .then((data) => processJSON(data))
    .then((clean) => {
      pendingPokemon = { name: clean.name, sprite: clean.sprite };

      const img = document.createElement("img");
      img.src = clean.sprite;
      img.alt = clean.name;

      const nameEl = document.createElement("p");
      nameEl.textContent = clean.name;

      resultEl.appendChild(img);
      resultEl.appendChild(nameEl);
      confirmBtn.hidden = false;
    })
    .catch(function () {
      errorEl.textContent = "Pokémon not found. Check the name or Pokédex number.";
      errorEl.hidden = false;
    });
});

document.getElementById("slotConfirm").addEventListener("click", function () {
  if (!pendingPokemon || activeTeamId === null) return;
  const teams = loadTeams();
  const team = teams.find(function (t) { return t.id === activeTeamId; });
  if (team) {
    team.members[activeSlotIndex] = pendingPokemon;
    saveTeams(teams);
  }
  closeSlotModal();
  renderTeams();
});

document.getElementById("slotCancel").addEventListener("click", closeSlotModal);
