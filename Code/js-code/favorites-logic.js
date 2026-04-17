//Test section
console.log("JS loaded");

// Element / Loading selection
const addFavBtn = document.querySelector("#showSearchBtn");
const cancelSearchBtn = document.querySelector("#cancelSearchBtn");
const favoritesSection = document.querySelector("#favoritesSection");
const searchSection = document.querySelector("#searchSection");
const searchBtn = document.querySelector("#searchBtn");
const searchInput = document.querySelector("#searchInput");
const searchresultIMG = document.querySelector("#searchresultIMG");
const searchPokeName = document.querySelector("#searchPokeName");

async function loadPokemonData() {
    const response = await fetch("../data/pokemon_dex_name.json");
    pokemonData = await response.json();
}

let pokeData = [];
loadPokemonData();

//For now all confirmed favorites will just be saved in this array
let tempUserData = []

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
            temp.dex === Number(userInput)
        );
    });

    if (result) {
        rendersearchResult(result.dex)
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

function rendersearchResult(pokeID) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokeID}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //need for teams page
            //const spriteUrl = data.sprites.front_default;
            const artUrl = data.sprites.other['official-artwork'].front_default;
            const pokeName = data.species.name;
            //Trying to capitalize the first letter of the pokemon
            result = pokeName.charAt(0).toUpperCase() + pokeName.slice(1);
            searchPokeName.textContent = result;
            searchresultIMG.src = artUrl;
        });
    console.log("check 1")
    
}
