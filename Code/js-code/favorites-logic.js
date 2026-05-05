//Test section
console.log("JS loaded");
//localStorage.removeItem("favorites");



// Element / Loading selection
const addFavBtn = document.querySelector("#showSearchBtn");
const cancelSearchBtn = document.querySelector("#cancelSearchBtn");
const favoritesSection = document.querySelector("#favoritesSection");
const searchSection = document.querySelector("#searchSection");
const searchBtn = document.querySelector("#searchBtn");
const searchInput = document.querySelector("#searchInput");
const searchresultIMG = document.querySelector("#searchresultIMG");
const searchPokeName = document.querySelector("#searchPokeName");
const officialAdd = document.querySelector("#officialAdd");

async function loadPokemonData() {
    const response = await fetch("../data/pokemon_dex_name.json");
    pokemonData = await response.json();
}

let pokeData = [];
loadPokemonData();

//For now all confirmed favorites will just be saved in this array
let tempFavorites = loadFavorites();
console.log("Here are your favorites");
console.log(tempFavorites);
let temp;

// Event listeners
addFavBtn.addEventListener("click", function () {
    favoritesSection.hidden = true;
    searchSection.hidden = false;
    favoritesheader.hidden = true;

});

cancelSearchBtn.addEventListener("click", function () {
    searchSection.hidden = true;
    favoritesSection.hidden = false;
    favoritesheader.hidden = false;
});

searchBtn.addEventListener("click", handleSearch);

officialAdd.addEventListener("click", function () {
    searchSection.hidden = true;
    favoritesSection.hidden = false;
    favoritesheader.hidden = false;
    officialAdd.hidden = true;
    // Store display name and artwork with dex data
    temp.displayName = searchPokeName.textContent;
    temp.artUrl = searchresultIMG.src;
    tempFavorites.push(temp);
    saveFavorites();
    temp = null;
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
        rendersearchResult(result.dex)
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
            //Trying to capitalize the first letter of the pokemon
            result = pokeName.charAt(0).toUpperCase() + pokeName.slice(1);
            searchPokeName.textContent = result;
            searchresultIMG.src = artUrl;
            officialAdd.hidden = false;
        })
        .catch(function () {
            searchPokeName.textContent = "Failed to load Pokémon. Check your connection and try again.";
        });
    console.log("check 1")
    
}


//save to memory
function saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(tempFavorites));
}

//pull from memory
function loadFavorites() {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
}

// Render favorite cards from our tempFavorites array
function renderFavorites() {
    favoritesSection.querySelectorAll(".favorite-card").forEach(function (card) {
        card.remove();
    });

    tempFavorites.forEach(function (pokemon, index) {
        const card = document.createElement("article");
        card.className = "favorite-card";
        const name = document.createElement("h3");
        name.textContent = pokemon.displayName || pokemon.name;
        card.appendChild(name);

        if (pokemon.artUrl) {
            const img = document.createElement("img");
            img.src = pokemon.artUrl;
            img.alt = pokemon.displayName || pokemon.name;
            img.style.width = "120px";
            card.appendChild(img);
        }

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", function () {
            tempFavorites.splice(index, 1);
            saveFavorites();
            renderFavorites();
        });
        card.appendChild(removeBtn);

        favoritesSection.appendChild(card);
    });
}

renderFavorites();