function goToPokemon(name) {
  window.location.href = `pokedex.html?name=${name}`;
}

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
