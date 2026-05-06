// currently used in index.js ONLY
let pokemon = [];
fetch("../data/pokemon_dex_name.json")
  .then((response) => response.json())
  .then((data) => {
    pokemon = data;
    renderSuggestions();
  });

function renderSuggestions() {
  const list = document.querySelector(".suggestions-list");
  list.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    const p = pokemon[Math.floor(Math.random() * pokemon.length)];
    const li = document.createElement("li");
    const name = p.name.charAt(0).toUpperCase() + p.name.slice(1);
    li.textContent = name;
    li.addEventListener("click", () => goToPokemon(p.name));
    list.appendChild(li);
  }
}

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
      option.value = p.name.charAt(0).toUpperCase() + p.name.slice(1);
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
