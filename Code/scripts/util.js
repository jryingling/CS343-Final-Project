let pokemon = [];

fetch('../data/pokemon_dex_name.json')
  .then(response => response.json())
  .then(data => {
    pokemon = data;
  });

const input = document.getElementById('pokemon-search');
const datalist = document.getElementById('pokemon-list');

input.addEventListener('input', function() {
  const query = this.value.toLowerCase();
  datalist.innerHTML = '';

  pokemon
    .filter(p => p.name.toLowerCase().startsWith(query))
    .slice(0, 10)
    .forEach(p => {
      const option = document.createElement('option');
      option.value = p.name.charAt(0).toUpperCase() + p.name.slice(1);
      datalist.appendChild(option);
    });
});

function queryPokeAPI(nameOrDex) {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrDex}`)
        .then(res => res.json());
}

function processJSON(data) {
  return {
    name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
    height: data.height,
    weight: data.weight,
    types: data.types.map(t => t.type.name),
    stats: data.stats.map(s => ({
      name: s.stat.name,
      value: s.base_stat
    })),
    moves: data.moves.map(m => m.move.name),
    sprite: data.sprites.front_default,
    officialArt: data.sprites.other["official-artwork"].front_default
  };
}