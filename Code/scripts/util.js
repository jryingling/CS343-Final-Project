// Always query PokeAPI by dex number, never by name.
// Many pokemon with non-standard or multiple forms (e.g. Wormadam, Deoxys)
// will fail or return incorrect results when queried by name. Dex number
// always resolves to the correct default form.
function queryPokeAPI(dex) {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${dex}`).then((res) =>
    res.json(),
  );
}

function nameToDex(name, list) {
  const match = list.find((p) => p.name.toLowerCase() === name.toLowerCase());
  return match ? match.dex : null;
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

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function renderCard(clean) {
  const randomMonMessage = document.getElementById("randomMonMessage");
  const randomMon = document.getElementById("randomMon");
  const randomMonName = document.getElementById("pokemon-name");

  randomMonName.textContent = clean.name;
  randomMon.src = clean.officialArt;
  randomMon.alt = `Official Art of ${clean.name}`;
  if (randomMonMessage) randomMonMessage.textContent = "";
}
