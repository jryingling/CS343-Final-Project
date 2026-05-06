function queryPokeAPI(nameOrDex) {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrDex}`).then((res) =>
    res.json(),
  );
}

function processJSON(data) {
  return {
    name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
    height: data.height,
    weight: data.weight,
    types: data.types.map((t) => t.type.name),
    stats: data.stats.map((s) => ({
      name: s.stat.name,
      value: s.base_stat,
    })),
    moves: data.moves.map((m) => m.move.name),
    sprite: data.sprites.front_default,
    officialArt: data.sprites.other["official-artwork"].front_default,
  };
}

// utility + specific to index
function renderCard(clean) {
  const randomMonMessage = document.getElementById("randomMonMessage");
  const randomMon = document.getElementById("randomMon");
  const randomMonName = document.getElementById("pokemon-name");

  randomMonName.textContent = clean.name;
  randomMon.src = clean.officialArt;
  randomMon.alt = `Official Art of ${clean.name}`;
  randomMonMessage.textContent = "";
}
