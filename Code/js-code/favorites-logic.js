//Test section
console.log("JS loaded");
//localStorage.removeItem("favorites");



// Element / Loading selection
const addFavBtn = document.querySelector("#showSearchBtn");
const cancelSearchBtn = document.querySelector("#cancelSearchBtn");
const favoritesSection = document.querySelector("#favoritesSection");
const searchSection = document.querySelector("#searchSection");
const favoritesheader = document.querySelector("#favoritesheader");
const searchBtn = document.querySelector("#searchBtn");
const searchInput = document.querySelector("#searchInput");
const searchresultIMG = document.querySelector("#searchresultIMG");
const searchPokeName = document.querySelector("#searchPokeName");
const officialAdd = document.querySelector("#officialAdd");

const favoritesControls = document.querySelector(".favorites-controls");

const editFavoritesBtn = document.querySelector("#editFavoritesBtn");
let editMode = false;

async function loadPokemonData() {
    const response = await fetch("../data/pokemon_dex_name.json");
    pokemonData = await response.json();
}

function loadFavorites() {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
}

function saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(tempFavorites));
}

let pokemonData = [];
loadPokemonData();



//For now all confirmed favorites will just be saved in this array
let tempFavorites = loadFavorites();
//console.log("Here are your favorites");
//console.log(tempFavorites);
let temp;

// Event listeners
addFavBtn.addEventListener("click", function () {
    favoritesSection.hidden = true;
    favoritesControls.hidden = true;
    favoritesheader.hidden = true;

    searchSection.hidden = false;

    searchBtn.hidden = false;
    searchInput.hidden = false;

    document.getElementById("search-error").hidden = true;
    cancelSearchBtn.hidden = false;
    searchPokeName.hidden = true;
    searchresultIMG.hidden = true;
    officialAdd.hidden = true;
});

cancelSearchBtn.addEventListener("click", function () {
    searchSection.hidden = true;
    favoritesSection.hidden = false;
    favoritesControls.hidden = false;
    favoritesheader.hidden = false;
});

searchBtn.addEventListener("click", handleSearch);

officialAdd.addEventListener("click", function () {
    searchSection.hidden = true;
    favoritesSection.hidden = false;
    favoritesheader.hidden = false;
    officialAdd.hidden = true;
    favoritesControls.hidden = false;

    temp.displayName = searchPokeName.textContent;
    temp.artUrl = searchresultIMG.src;
    tempFavorites.push(temp);
    saveFavorites();
    temp = null;
    renderFavorites();
});

editFavoritesBtn.addEventListener("click", function () {
    console.log("Edit button clicked");

    editMode = !editMode;

    editFavoritesBtn.textContent = editMode ? "Done" : "Edit Favorites";
    addFavBtn.hidden = !editMode;

    renderFavorites();
});

//Search Functions
/*function handleSearch() {
  console.log("The search button was clicked");
  const userSearch = searchInput.value;
  console.log(userSearch);
   searchSection.hidden = true;
}*/

function handleSearch() {
    const userInput = searchInput.value.trim().toLowerCase();

    const result = pokemonData.find(function (temp) {
        return (
            temp.name.toLowerCase() === userInput ||
            temp.dex === Number(userInput)
        );
    });

    temp = result;
    const searchError = document.getElementById("search-error");

    if (result) {
        searchError.hidden = true;
        rendersearchResult(result.dex);
        console.log("Found:", result);
    } else {
        searchError.textContent = "No Pokémon found. Please enter a valid name or Pokédex number.";
        searchError.hidden = false;
    }
}

//Rendering Functions

function rendersearchResult(pokeID) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokeID}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            const artUrl = data.sprites.other['official-artwork'].front_default;
            const pokeName = data.species.name;

            const result = pokeName.charAt(0).toUpperCase() + pokeName.slice(1);

            searchPokeName.textContent = result;
            searchresultIMG.src = artUrl;

            searchPokeName.hidden = false;
            searchresultIMG.hidden = false;
            officialAdd.hidden = false;
        })
        .catch(function () {
            searchPokeName.textContent = "Failed to load Pokémon. Check your connection and try again.";
            searchPokeName.hidden = false;
            searchresultIMG.hidden = true;
            officialAdd.hidden = true;
        });
}

function renderFavorites() {
    favoritesSection.querySelectorAll(".favorite-card").forEach(function (card) {
        card.remove();
    });

    tempFavorites.forEach(function (pokemon, index) {
        const card = document.createElement("article");
        card.className = "favorite-card";

        const name = document.createElement("h3");
        const rawName = pokemon.displayName || pokemon.name;
        name.textContent = capitalize(rawName);
        card.appendChild(name);

        const img = document.createElement("img");
        img.alt = pokemon.displayName || pokemon.name;
        img.style.width = "120px";
        card.appendChild(img);

        if (pokemon.artUrl) {
            img.src = pokemon.artUrl;
        } else if (pokemon.dex) {
            fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.dex}`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    const artUrl = data.sprites.other['official-artwork'].front_default;
                    img.src = artUrl;
                    pokemon.artUrl = artUrl;
                    saveFavorites();
                });
        }

        if (editMode) {
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";

            removeBtn.addEventListener("click", function () {
                card.remove();

                tempFavorites.splice(index, 1);
                saveFavorites();
            });

            card.appendChild(removeBtn);
        }

        favoritesSection.appendChild(card);
    });
}


// additional helper functions


//capitalize names
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

renderFavorites();