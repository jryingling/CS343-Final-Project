// Load Pokemon from URL param on page arrival (redirect from home search)
(function fetchUrlParamPokemon() {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("name");

  if (name) {
    queryPokeAPI(name)
      .then((data) => processJSON(data))
      .then((clean) => renderCard(clean))
      .catch(() => {
        document.getElementById("name").textContent =
          "Failed to load Pokémon. Check your connection and try again.";
      });
  }
})();

// Autocomplete search data
let pokemonList = [];
fetch("../data/pokemon_dex_name.json")
  .then((r) => r.json())
  .then((data) => { pokemonList = data; });

const searchInput = document.getElementById("pokemon-search");
const datalistEl = document.getElementById("pokemon-list");

// Autocomplete suggestions + live type list filter when we r typing
searchInput.addEventListener("input", function () {
  const query = this.value.toLowerCase();

  datalistEl.innerHTML = "";
  pokemonList
    .filter((p) => p.name.toLowerCase().startsWith(query))
    .slice(0, 10)
    .forEach((p) => {
      const option = document.createElement("option");
      option.value = p.name.charAt(0).toUpperCase() + p.name.slice(1);
      datalistEl.appendChild(option);
    });

  // when type is loaded, re filter the list and reset to first page
  if (allTypeResults.length > 0) {
    displayedCount = PAGE_SIZE;
    renderTypeList();
  }
});

// Search form submit and update detail card in place
document.getElementById("pokedex-search-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const val = searchInput.value.trim();
  const searchError = document.getElementById("search-error");
  const match = pokemonList.find((p) => p.name.toLowerCase() === val.toLowerCase());

  if (!match) {
    searchError.textContent = "No Pokémon found. Please enter a valid name.";
    searchError.hidden = false;
    return;
  }

  searchError.hidden = true;
  queryPokeAPI(match.name)
    .then((data) => processJSON(data))
    .then((clean) => renderCard(clean))
    .catch(() => {
      document.getElementById("name").textContent =
        "Failed to load Pokémon. Check your connection and try again.";
    });
});

function renderCard(clean) {
  document.getElementById("sprite").src = clean.sprite;
  document.getElementById("sprite").alt = clean.name;
  document.getElementById("name").textContent = clean.name;
  document.getElementById("height").textContent = "Height: " + clean.height;
  document.getElementById("weight").textContent = "Weight: " + clean.weight;
  document.getElementById("officialArt").src = clean.officialArt;
  document.getElementById("officialArt").alt = "Official art of " + clean.name;
}

// type chooser

const TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy"
];

const PAGE_SIZE = 10;
let allTypeResults = [];
let displayedCount = 0;

const typeButtonsDiv = document.getElementById("type-buttons");
TYPES.forEach(function (type) {
  const btn = document.createElement("button");
  btn.textContent = type.charAt(0).toUpperCase() + type.slice(1);
  btn.addEventListener("click", function () { loadType(type); });
  typeButtonsDiv.appendChild(btn);
});

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
        type.charAt(0).toUpperCase() + type.slice(1) + " type Pokémon";
      renderTypeList();
    })
    .catch(() => {
      searchError.textContent = "Failed to load types. Check your connection.";
      searchError.hidden = false;
    });
}

function renderTypeList() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = query
    ? allTypeResults.filter((name) => name.includes(query))
    : allTypeResults;

  const list = document.getElementById("type-results");
  const loadMoreBtn = document.getElementById("load-more");

  list.innerHTML = "";
  filtered.slice(0, displayedCount).forEach(function (name) {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    btn.addEventListener("click", function () {
      queryPokeAPI(name)
        .then((data) => processJSON(data))
        .then((clean) => renderCard(clean))
        .catch(() => {
          document.getElementById("name").textContent =
            "Failed to load Pokémon. Check your connection and try again.";
        });
    });
    li.appendChild(btn);
    list.appendChild(li);
  });

  loadMoreBtn.hidden = displayedCount >= filtered.length;
}

document.getElementById("load-more").addEventListener("click", function () {
  displayedCount += PAGE_SIZE;
  renderTypeList();
});
