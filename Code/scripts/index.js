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
