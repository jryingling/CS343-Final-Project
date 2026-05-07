
// will run on load
getTip();

(function fetchRandomPokemon() {
  const maxid = 1025;
  const pokedexid = getDailyPokemonId(maxid);

  queryPokeAPI(pokedexid)
    .then((data) => processJSON(data))
    .then((clean) => renderCard(clean))
    .catch(() => {
      document.getElementById("randomMonMessage").textContent =
        "Failed to load Pokémon. Check your connection and try again.";
    });
})();

// functions
function getDailyPokemonId(maxid) {
  const today = new Date();

  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  const random = Math.sin(seed) * 10000;
  const decimal = random - Math.floor(random);

  return Math.floor(decimal * maxid) + 1;
}

function validateSearch() {
  const pokeSearch = document.getElementById("pokemon-search").value.trim();
  const match = pokemon.find(
    (p) => p.name.toLowerCase() === pokeSearch.toLowerCase(),
  );

  if (!match) {
    console.log("Pokemon does not exist");
    return Promise.reject("Invalid pokemon name.");
  } else {
    return Promise.resolve([match.name]);
  }
}

function renderCard(clean) {
  const randomMonMessage = document.getElementById("randomMonMessage");
  const randomMon = document.getElementById("randomMon");
  const randomMonName = document.getElementById("pokemon-name");

  randomMonName.textContent = clean.name;
  randomMon.src = clean.officialArt;
  randomMon.alt = `Official Art of ${clean.name}`;
  randomMonMessage.textContent = "";
}

function getTip() {
  fetch("../data/tips.json")
    .then((response) => response.json())
    .then((tips) => {
      const randomIndex = Math.floor(Math.random() * tips.length);
      const randomTip = tips[randomIndex].tip;

      document.getElementById("daily-tip").textContent =
        `Tip of The Day: ${randomTip}`;
    })
    .catch(() => {
      document.getElementById("daily-tip").textContent =
        "Tip of The Day: Failed to load tip.";
    });
}


//trainer profile stuff

function getGeneration(dex) {
  if (dex <= 151) {
    return 1;
  } else if (dex <= 251) {
    return 2;
  } else if (dex <= 386) {
    return 3;
  } else if (dex <= 493) {
    return 4;
  } else if (dex <= 649) {
    return 5;
  } else if (dex <= 721) {
    return 6;
  } else if (dex <= 809) {
    return 7;
  } else if (dex <= 905) {
    return 8;
  } else {
    return 9;
  }
}

function countFavoritesByGeneration() {
  const savedFavorites = localStorage.getItem("favorites");
  const favorites = savedFavorites ? JSON.parse(savedFavorites) : [];

  const generationCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  favorites.forEach(function (pokemon) {
    const generation = getGeneration(pokemon.dex);
    generationCounts[generation - 1]++;
  });

  return generationCounts;
}

function countTeams() {
  const savedTeams = localStorage.getItem("teams");
  const teams = savedTeams ? JSON.parse(savedTeams) : [];

  return teams.length;
}

function drawGenerationChart() {
  const canvas = document.getElementById("generationChart");
  const ctx = canvas.getContext("2d");

  const generationCounts = countFavoritesByGeneration();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const chartBottom = 250;
  const chartLeft = 40;
  const barWidth = 35;
  const gap = 15;

  const maxCount = Math.max(...generationCounts, 1);

  ctx.font = "14px Arial";

  generationCounts.forEach(function (count, index) {
    const barHeight = (count / maxCount) * 180;
    const x = chartLeft + index * (barWidth + gap);
    const y = chartBottom - barHeight;

    ctx.fillStyle = "steelblue";
    ctx.fillRect(x, y, barWidth, barHeight);

    ctx.fillStyle = "black";
    ctx.fillText(count, x + 10, y - 8);

    ctx.fillText("G" + (index + 1), x + 5, chartBottom + 20);
  });

  ctx.fillStyle = "black";
  ctx.fillText("Favorites by Generation", 170, 25);
}

function updateStats() {
  const savedFavorites = localStorage.getItem("favorites");
  const favorites = savedFavorites ? JSON.parse(savedFavorites) : [];

  document.getElementById("totalFavorites").textContent =
    "Total Favorites: " + favorites.length;

  document.getElementById("totalTeams").textContent =
    "Total Teams: " + countTeams();

  drawGenerationChart();
}

updateStats();

const displayName = document.getElementById("display-name");
const displayPic = document.getElementById("display-pic");

const editBtn = document.getElementById("edit-profile-btn");
const editor = document.getElementById("profile-editor");

const nameInput = document.getElementById("trainer-name");
const picInput = document.getElementById("profile-pic-input");
const saveBtn = document.getElementById("save-profile");

// LOAD SAVED DATA
const savedName = localStorage.getItem("trainerName");
const savedPic = localStorage.getItem("profilePic");

if (savedName) {
  displayName.textContent = savedName;
}

if (savedPic) {
  displayPic.src = savedPic;
}

// OPEN EDITOR
editBtn.addEventListener("click", function () {
  editor.hidden = false;

  // preload values into editor
  nameInput.value = savedName || "";
});

// SAVE PROFILE
saveBtn.addEventListener("click", function () {
  const newName = nameInput.value.trim();
  const file = picInput.files[0];

  if (newName !== "") {
    localStorage.setItem("trainerName", newName);
    displayName.textContent = newName;
  }

  if (file) {
    const reader = new FileReader();

    reader.onload = function () {
      localStorage.setItem("profilePic", reader.result);
      displayPic.src = reader.result;
    };

    reader.readAsDataURL(file);
  }

  editor.hidden = true;
});