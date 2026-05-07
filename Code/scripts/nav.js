function goToPokemon(dex) {
  window.location.href = `pokedex.html?id=${dex}`;
}

function validateSearch() {
  const pokeSearch = document.getElementById("pokemon-search").value.trim();
  const dexNum = parseInt(pokeSearch);
  const match = pokemon.find(
    (p) =>
      p.name.toLowerCase() === pokeSearch.toLowerCase() ||
      (!isNaN(dexNum) && p.dex === dexNum),
  );

  if (!match) {
    console.log("Pokemon does not exist");
    return Promise.reject("Invalid pokemon name or dex number.");
  } else {
    return Promise.resolve([match.dex]);
  }
}
