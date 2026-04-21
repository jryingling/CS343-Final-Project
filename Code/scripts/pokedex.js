(function fetchUrlParamPokemon() {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("name");

  queryPokeAPI(name)
    .then((data) => processJSON(data))
    .then((clean) => renderCard(clean));
})();

console.log(name);

function renderCard(clean) {
  const sprite = document.getElementById("sprite");
  const name = document.getElementById("name");
  const height = document.getElementById("height");
  const weight = document.getElementById("weight");
  const officialArt = document.getElementById("officialArt");

  sprite.src = clean.sprite;
  name.textContent = clean.name;
  height.textContent = clean.height;
  weight.textContent = clean.weight;
  officialArt.src = clean.officialArt;
}
