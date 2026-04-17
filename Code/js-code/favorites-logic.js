//Test section
console.log("JS loaded");

// Element / Loading selection
const addFavBtn = document.querySelector("#showSearchBtn");
const cancelSearchBtn = document.querySelector("#cancelSearchBtn");
const favoritesSection = document.querySelector("#favoritesSection");
const searchSection = document.querySelector("#searchSection");
const searchBtn = document.querySelector("#searchBtn");
const searchInput = document.querySelector("#searchInput");


async function loadPokemonData() {
    const response = await fetch("../data/pokemon_dex_name.json");
    pokemonData = await response.json();
}

let pokeData = [];
loadPokemonData();


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
            temp.id === Number(userInput)
        );
    });

    if (result) {
        console.log("Found:", result);
    } else {
        console.log("Not found");
    }
}



//Rendering Functions
function loadFavorites() {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
}
