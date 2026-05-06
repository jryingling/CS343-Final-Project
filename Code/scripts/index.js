// IIFE
(() => {
  const maxid = 1025;
  const pokedexid = Math.floor(Math.random() * maxid) + 1;

  queryPokeAPI(pokedexid)
    .then((data) => processJSON(data))
    .then((clean) => renderCard(clean))
    .catch(() => {
      document.getElementById("randomMonMessage").textContent =
        "Failed to load Pokémon. Check your connection and try again.";
    });
})();

