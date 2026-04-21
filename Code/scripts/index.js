// will run on load
(function fetchRandomPokemon() {
  const maxid = 1025;
  const pokedexid = Math.floor(Math.random() * maxid) + 1;

  queryPokeAPI(pokedexid)
    .then((data) => processJSON(data))
    .then((clean) => renderCard(clean));
})();

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
