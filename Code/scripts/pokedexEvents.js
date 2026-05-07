let pokemon = [];
fetch("../data/pokemon_dex_name.json")
  .then((r) => r.json())
  .then((data) => {
    pokemon = data;
    const datalist = document.getElementById("pokemon-list");
    pokemon.forEach((p) => {
      const option = document.createElement("option");
      option.value = capitalize(p.name);
      datalist.appendChild(option);
    });
  });

document.getElementById("pokemon-search").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const datalist = document.getElementById("pokemon-list");
  datalist.innerHTML = "";

  pokemon
    .filter((p) => p.name.toLowerCase().startsWith(query))
    .slice(0, 10)
    .forEach((p) => {
      const option = document.createElement("option");
      option.value = capitalize(p.name);
      datalist.appendChild(option);
    });

  if (allTypeResults.length > 0) {
    displayedCount = PAGE_SIZE;
    renderTypeList();
  }
});

document.getElementById("pokedex-search-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const searchError = document.getElementById("search-error");
  validateSearch()
    .then(([dex]) => {
      searchError.hidden = true;
      queryPokeAPI(dex)
        .then((data) => processJSON(data))
        .then((clean) => renderCard(clean))
        .catch(() => {
          document.getElementById("name").textContent =
            "Failed to load Pokémon. Check your connection and try again.";
        });
    })
    .catch(() => {
      searchError.textContent = "No Pokémon found. Please enter a valid name.";
      searchError.hidden = false;
    });
});

const TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy"
];

const typeButtonsDiv = document.getElementById("type-buttons");
TYPES.forEach(function (type) {
  const btn = document.createElement("button");
  btn.textContent = capitalize(type);
  btn.addEventListener("click", function () { loadType(type); });
  typeButtonsDiv.appendChild(btn);
});

document.getElementById("load-more").addEventListener("click", function () {
  displayedCount += PAGE_SIZE;
  renderTypeList();
});
