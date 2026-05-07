// State
const PAGE_SIZE = 10;
let allTypeResults = [];
let displayedCount = PAGE_SIZE;
const MOVES_PER_PAGE = 20;
let currentMoves = [];
let movesPage = 0;

// URL param load on page arrival (redirect from search)
(function fetchUrlParamPokemon() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (id) {
    queryPokeAPI(id)
      .then((data) => processJSON(data))
      .then((clean) => renderCard(clean))
      .catch(() => {
        const searchError = document.getElementById("search-error");
        searchError.textContent = "Failed to load Pokémon. Check your connection.";
        searchError.hidden = false;
      });
  }
})();

// Pokedex-specific renderCard — different elements from util.js renderCard
function renderCard(clean) {
  document.getElementById("pokemon-detail").hidden = false;

  document.getElementById("officialArt").src = clean.officialArt;
  document.getElementById("officialArt").alt = "Official art of " + clean.name;
  document.getElementById("sprite").src = clean.sprite;
  document.getElementById("sprite").alt = clean.name;

  document.getElementById("name").textContent = clean.name;
  document.getElementById("height").textContent = "Height: " + (clean.height / 10) + " m";
  document.getElementById("weight").textContent = "Weight: " + (clean.weight / 10) + " kg";

  const badgesEl = document.getElementById("type-badges");
  badgesEl.innerHTML = "";
  clean.types.forEach(function (type) {
    const span = document.createElement("span");
    span.className = "type-badge type-" + type;
    span.textContent = capitalize(type);
    badgesEl.appendChild(span);
  });

  const statBars = document.getElementById("stat-bars");
  statBars.innerHTML = "";
  clean.stats.forEach(function (stat) {
    const label = STAT_LABELS[stat.name] || stat.name;
    const pct = Math.min(100, (stat.value / 255) * 100).toFixed(1);
    const color = statColor(stat.value);
    const row = document.createElement("div");
    row.className = "stat-row";
    row.innerHTML =
      '<span class="stat-label">' + label + "</span>" +
      '<div class="stat-bar-bg"><div class="stat-bar-fill" style="width:' + pct + "%;background:" + color + '"></div></div>' +
      '<span class="stat-value">' + stat.value + "</span>";
    statBars.appendChild(row);
  });

  currentMoves = clean.moves;
  movesPage = 0;
  renderMoves();
}

function renderMoves() {
  const start = movesPage * MOVES_PER_PAGE;
  const total = Math.ceil(currentMoves.length / MOVES_PER_PAGE);
  const page = currentMoves.slice(start, start + MOVES_PER_PAGE);

  const grid = document.getElementById("moves-grid");
  grid.innerHTML = "";
  page.forEach(function (move) {
    const span = document.createElement("span");
    span.className = "move-badge";
    span.textContent = capitalize(move.replace(/-/g, " "));
    grid.appendChild(span);
  });

  document.getElementById("moves-page-label").textContent =
    "Page " + (movesPage + 1) + " of " + total;
  document.getElementById("moves-prev").disabled = movesPage === 0;
  document.getElementById("moves-next").disabled = movesPage >= total - 1;
}

function loadType(type) {
  const searchError = document.getElementById("search-error");
  searchError.hidden = true;

  fetch("https://pokeapi.co/api/v2/type/" + type)
    .then((resp) => resp.json())
    .then((data) => {
      allTypeResults = data.pokemon.map((p) => p.pokemon.name);
      displayedCount = PAGE_SIZE;
      document.getElementById("type-results-section").hidden = false;
      document.getElementById("type-results-title").textContent =
        capitalize(type) + " type Pokémon";
      renderTypeList();
    })
    .catch(() => {
      searchError.textContent = "Failed to load types. Check your connection.";
      searchError.hidden = false;
    });
}

function renderTypeList() {
  const query = document.getElementById("pokemon-search").value.trim().toLowerCase();
  const filtered = query
    ? allTypeResults.filter((name) => name.includes(query))
    : allTypeResults;

  const list = document.getElementById("type-results");
  list.innerHTML = "";

  filtered.slice(0, displayedCount).forEach(function (name) {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.textContent = capitalize(name);
    btn.addEventListener("click", function () {
      const dex = nameToDex(name, pokemon);
      if (!dex) return;
      queryPokeAPI(dex)
        .then((data) => processJSON(data))
        .then((clean) => renderCard(clean))
        .catch(() => {
          const searchError = document.getElementById("search-error");
          searchError.textContent = "Failed to load Pokémon. Check your connection.";
          searchError.hidden = false;
        });
    });
    li.appendChild(btn);
    list.appendChild(li);
  });

  document.getElementById("load-more").hidden = displayedCount >= filtered.length;
}
