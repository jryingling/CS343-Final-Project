// currently used in index.js ONLY
let pokemon = [];
fetch("../data/pokemon_dex_name.json")
  .then((response) => response.json())
  .then((data) => {
    pokemon = data;
    getSuggestions();
  });

const input = document.getElementById("pokemon-search");
const datalist = document.getElementById("pokemon-list");

input.addEventListener("input", function () {
  const query = this.value.toLowerCase();
  datalist.innerHTML = "";

  pokemon
    .filter((p) => p.name.toLowerCase().startsWith(query))
    .slice(0, 10)
    .forEach((p) => {
      const option = document.createElement("option");
      option.value = capitalize(p.name);
      datalist.appendChild(option);
    });
});

// search navigate to pokedex page
document.querySelector(".search-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const searchError = document.getElementById("search-error");
  validateSearch()
    .then((name) => {
      searchError.hidden = true;
      goToPokemon(name[0]);
    })
    .catch(() => {
      searchError.textContent = "No Pokémon found. Please enter a valid name.";
      searchError.hidden = false;
    });
});

