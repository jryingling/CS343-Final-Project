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

const STAT_LABELS = {
  "hp": "HP",
  "attack": "Attack",
  "defense": "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  "speed": "Speed",
};

function statColor(value) {
  if (value < 50) return "#FF6B6B";
  if (value < 80) return "#FFA94D";
  if (value < 100) return "#FFD43B";
  return "#69DB7C";
}

function renderCard(clean) {
  document.getElementById("randomMon").src = clean.officialArt;
  document.getElementById("randomMon").alt = "Official Art of " + clean.name;
  document.getElementById("randomSprite").src = clean.sprite;
  document.getElementById("randomSprite").alt = clean.name;
  document.getElementById("pokemon-name").textContent = clean.name;
  document.getElementById("randomHeight").textContent = "Height: " + (clean.height / 10) + " m";
  document.getElementById("randomWeight").textContent = "Weight: " + (clean.weight / 10) + " kg";

  const badges = document.getElementById("randomTypeBadges");
  badges.innerHTML = "";
  clean.types.forEach(function (type) {
    const span = document.createElement("span");
    span.className = "type-badge type-" + type;
    span.textContent = capitalize(type);
    badges.appendChild(span);
  });

  const statBars = document.getElementById("randomStatBars");
  statBars.innerHTML = "";
  clean.stats.forEach(function (stat) {
    const label = STAT_LABELS[stat.name] || stat.name;
    const pct = Math.min(100, (stat.value / 255) * 100).toFixed(1);
    const color = statColor(stat.value);
    const row = document.createElement("div");
    row.className = "stat-row";
    row.innerHTML =
      '<span class="stat-label">' + label + "</span>" +
      '<div class="stat-bar-bg"><div class="stat-bar-fill" style="width:' + pct + "%;background:" + color + '"></div></div>' +
      '<span class="stat-value">' + stat.value + "</span>";
    statBars.appendChild(row);
  });

  const msg = document.getElementById("randomMonMessage");
  if (msg) msg.hidden = true;
}
