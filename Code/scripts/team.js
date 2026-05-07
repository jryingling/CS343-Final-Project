// localStorage helpers
function loadTeams() {
  const saved = localStorage.getItem("teams");
  return saved ? JSON.parse(saved) : [];
}

function saveTeams(teams) {
  localStorage.setItem("teams", JSON.stringify(teams));
}

function loadSpritePref() {
  return localStorage.getItem("showSprites") !== "false";
}

function saveSpritePref(val) {
  localStorage.setItem("showSprites", String(val));
}

// State
let activeTeamId = null;
let activeSlotIndex = null;
let pendingPokemon = null;

function renderTeams() {
  const grid = document.querySelector(".teams-grid");
  const addCard = document.getElementById("addTeamCard");

  grid.querySelectorAll(".team-card:not(#addTeamCard):not(#createTeamForm)").forEach(function (el) {
    el.remove();
  });

  const teams = loadTeams();
  const showSprites = loadSpritePref();

  teams.forEach(function (team) {
    const card = buildTeamCard(team, showSprites);
    grid.insertBefore(card, addCard);
  });
}

function buildTeamCard(team, showSprites) {
  const card = document.createElement("article");
  card.className = "team-card";
  card.dataset.teamId = team.id;

  const title = document.createElement("h3");
  title.textContent = team.name;
  card.appendChild(title);

  const membersDiv = document.createElement("div");
  membersDiv.className = "team-members";

  for (let i = 0; i < 6; i++) {
    const slot = document.createElement("div");
    slot.className = "pokemon-slot";
    const member = team.members[i];

    if (member) {
      if (showSprites) {
        const img = document.createElement("img");
        img.src = member.sprite;
        img.alt = member.name;
        img.style.width = "48px";
        img.style.height = "48px";
        slot.appendChild(img);
      }

      const name = document.createElement("div");
      name.textContent = member.name;
      slot.appendChild(name);

      slot.title = "Click to remove";
      slot.addEventListener("click", function () {
        removePokemon(team.id, i);
      });
    } else {
      slot.textContent = "Slot " + (i + 1);
      slot.title = "Click to add";
      slot.addEventListener("click", function () {
        openSlotModal(team.id, i);
      });
    }
    membersDiv.appendChild(slot);
  }
  card.appendChild(membersDiv);

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "team-action";
  deleteBtn.textContent = "Delete Team";
  deleteBtn.addEventListener("click", function () {
    deleteTeam(team.id);
  });
  card.appendChild(deleteBtn);

  return card;
}

function createTeam(name) {
  const teams = loadTeams();
  teams.push({
    id: Date.now(),
    name: name,
    createdAt: Date.now(),
    members: [null, null, null, null, null, null]
  });
  saveTeams(teams);
  renderTeams();
}

function deleteTeam(id) {
  const teams = loadTeams().filter(function (t) { return t.id !== id; });
  saveTeams(teams);
  renderTeams();
}

function removePokemon(teamId, slotIndex) {
  const teams = loadTeams();
  const team = teams.find(function (t) { return t.id === teamId; });
  if (team) {
    team.members[slotIndex] = null;
    saveTeams(teams);
    renderTeams();
  }
}

function openSlotModal(teamId, slotIndex) {
  activeTeamId = teamId;
  activeSlotIndex = slotIndex;
  pendingPokemon = null;

  document.getElementById("slotSearch").value = "";
  document.getElementById("slotError").hidden = true;
  document.getElementById("slotResult").innerHTML = "";
  document.getElementById("slotConfirm").hidden = true;
  document.getElementById("slotModal").hidden = false;
}

function closeSlotModal() {
  document.getElementById("slotModal").hidden = true;
  activeTeamId = null;
  activeSlotIndex = null;
  pendingPokemon = null;
}

renderTeams();
