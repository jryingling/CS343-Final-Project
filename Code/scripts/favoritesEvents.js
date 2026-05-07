let pokemon = [];
fetch("../data/pokemon_dex_name.json")
  .then((r) => r.json())
  .then((data) => {
    pokemon = data;
    const datalist = document.getElementById("pokemon-list");
    pokemon.forEach((p) => {
      const option = document.createElement("option");
      option.value = capitalize(p.name);
      datalist.appendChild(option);
    });
  });

document.getElementById("showSearchBtn").addEventListener("click", () => {
  document.getElementById("favoritesSection").hidden = true;
  document.querySelector(".favorites-controls").hidden = true;
  document.getElementById("favoritesheader").hidden = true;
  document.getElementById("searchSection").hidden = false;
  document.getElementById("search-error").hidden = true;
  document.getElementById("cancelSearchBtn").hidden = false;
  document.getElementById("pokemon-name").hidden = true;
  document.getElementById("randomMon").hidden = true;
  document.getElementById("officialAdd").hidden = true;
});

document.getElementById("cancelSearchBtn").addEventListener("click", () => {
  document.getElementById("searchSection").hidden = true;
  document.getElementById("favoritesSection").hidden = false;
  document.querySelector(".favorites-controls").hidden = false;
  document.getElementById("favoritesheader").hidden = false;
});

document.getElementById("searchBtn").addEventListener("click", () => {
  const searchError = document.getElementById("search-error");
  validateSearch()
    .then(([dex]) => {
      pendingResult = { dex };
      searchError.hidden = true;
      renderSearchResult(dex);
    })
    .catch(() => {
      searchError.textContent = "No Pokémon found. Please enter a valid name.";
      searchError.hidden = false;
    });
});

document.getElementById("officialAdd").addEventListener("click", () => {
  document.getElementById("searchSection").hidden = true;
  document.getElementById("favoritesSection").hidden = false;
  document.getElementById("favoritesheader").hidden = false;
  document.getElementById("officialAdd").hidden = true;
  document.querySelector(".favorites-controls").hidden = false;

  pendingResult.displayName = document.getElementById("pokemon-name").textContent;
  pendingResult.artUrl = document.getElementById("randomMon").src;
  tempFavorites.push(pendingResult);
  saveFavorites();
  pendingResult = null;
  renderFavorites();
});

document.getElementById("editFavoritesBtn").addEventListener("click", () => {
  editMode = !editMode;
  if (!editMode) {
    location.reload();
    return;
  }
  document.getElementById("editFavoritesBtn").textContent = "Done";
  document.getElementById("showSearchBtn").hidden = false;
  renderFavorites();
});
