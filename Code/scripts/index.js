// IIFE
(() => {
  const maxid = 1025;
  const pokedexid = getDailyPokemonId(maxid);

  queryPokeAPI(pokedexid)
    .then((data) => processJSON(data))
    .then((clean) => renderCard(clean))
    .catch(() => {
      document.getElementById("randomMonMessage").textContent =
        "Failed to load Pokémon. Check your connection and try again.";
    });

  getDailyTip();
})();

// functions
function getSuggestions() {
  const list = document.querySelector(".suggestions-list");
  list.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    const p = pokemon[Math.floor(Math.random() * pokemon.length)];
    const li = document.createElement("li");
    const name = capitalize(p.name);
    li.textContent = name;
    li.addEventListener("click", () => goToPokemon(p.dex));
    list.appendChild(li);
  }
}

function getDailyTip() {
  fetch("../data/tips.json")
    .then((response) => response.json())
    .then((tips) => {
      const today = new Date();

      const seed =
        today.getFullYear() * 10000 +
        (today.getMonth() + 1) * 100 +
        today.getDate();

      const random = Math.sin(seed + 1) * 10000;
      const decimal = random - Math.floor(random);
      const index = Math.floor(decimal * tips.length);

      document.getElementById("daily-tip").textContent =
        `Tip of The Day: ${tips[index].tip}`;
    });
}

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

// trainer stats

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
