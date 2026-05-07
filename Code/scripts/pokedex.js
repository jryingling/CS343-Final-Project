// State
const PAGE_SIZE = 10;
let allTypeResults = [];
let displayedCount = PAGE_SIZE;

// URL param load on page arrival (redirect from search)
(function fetchUrlParamPokemon() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (id) {
    queryPokeAPI(id)
      .then((data) => processJSON(data))
      .then((clean) => renderCard(clean))
      .catch(() => {
        document.getElementById("name").textContent =
          "Failed to load Pokémon. Check your connection and try again.";
      });
  }
})();

// Pokedex-specific renderCard — different elements from util.js renderCard
function renderCard(clean) {
  document.getElementById("sprite").src = clean.sprite;
  document.getElementById("sprite").alt = clean.name;
  document.getElementById("name").textContent = clean.name;
  document.getElementById("height").textContent = "Height: " + clean.height;
  document.getElementById("weight").textContent = "Weight: " + clean.weight;
  document.getElementById("officialArt").src = clean.officialArt;
  document.getElementById("officialArt").alt = "Official art of " + clean.name;
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
          document.getElementById("name").textContent =
            "Failed to load Pokémon. Check your connection and try again.";
        });
    });
    li.appendChild(btn);
    list.appendChild(li);
  });

  document.getElementById("load-more").hidden = displayedCount >= filtered.length;
}
