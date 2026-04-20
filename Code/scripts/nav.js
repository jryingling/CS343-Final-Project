// lives here because it is used by index and pokedex

function goToPokemon(name) {
  window.location.href = `pokedex.html?name=${name}`;
}
