let tempFavorites = loadFavorites();
let editMode = false;
let pendingResult = null;

function loadFavorites() {
  const saved = localStorage.getItem("favorites");
  return saved ? JSON.parse(saved) : [];
}

function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(tempFavorites));
}

// uses queryPokeAPI + processJSON + renderCard from util.js
function renderSearchResult(dex) {
  queryPokeAPI(dex)
    .then((data) => processJSON(data))
    .then((clean) => {
      renderCard(clean);
      document.getElementById("pokemon-name").hidden = false;
      document.getElementById("randomMon").hidden = false;
      document.getElementById("officialAdd").hidden = false;
    })
    .catch(() => {
      document.getElementById("pokemon-name").textContent =
        "Failed to load Pokémon. Check your connection and try again.";
      document.getElementById("pokemon-name").hidden = false;
      document.getElementById("randomMon").hidden = true;
      document.getElementById("officialAdd").hidden = true;
    });
}

function renderFavorites() {
  const section = document.getElementById("favoritesSection");
  section.querySelectorAll(".favorite-card").forEach((card) => card.remove());

  tempFavorites.forEach((poke, index) => {
    const card = document.createElement("article");
    card.className = "favorite-card";

    const name = document.createElement("h3");
    name.textContent = capitalize(poke.displayName || poke.name);
    card.appendChild(name);

    const img = document.createElement("img");
    img.alt = capitalize(poke.displayName || poke.name);
    img.style.width = "120px";
    card.appendChild(img);

    if (poke.artUrl) {
      img.src = poke.artUrl;
    } else if (poke.dex) {
      queryPokeAPI(poke.dex)
        .then((data) => processJSON(data))
        .then((clean) => {
          img.src = clean.officialArt;
          poke.artUrl = clean.officialArt;
          saveFavorites();
        });
    }

    if (editMode) {
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => {
        tempFavorites.splice(index, 1);
        saveFavorites();
        renderFavorites();
      });
      card.appendChild(removeBtn);
    }

    section.appendChild(card);
  });
}

renderFavorites();
