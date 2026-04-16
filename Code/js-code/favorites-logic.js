//Test section
console.log("JS loaded");

// Element selection
const addFavBtn = document.querySelector("#showSearchBtn");
const cancelSearchBtn = document.querySelector("#cancelSearchBtn");
const favoritesSection = document.querySelector("#favoritesSection");
const searchSection = document.querySelector("#searchSection");
const searchBtn = document.querySelector("#searchBtn");
const searchInput = document.querySelector("#searchInput");

// Event listeners
addFavBtn.addEventListener("click", function () {
  favoritesSection.hidden = true;
  searchSection.hidden = false;
});

cancelSearchBtn.addEventListener("click", function () {
  searchSection.hidden = true;
  favoritesSection.hidden = false;
});

searchBtn.addEventListener("click", handleSearch);

//Search Functions
function handleSearch() {
  console.log("The search button was clicked");
  const userSearch = searchInput.value;
  console.log(userSearch);
   searchSection.hidden = true;
}

//Rendering Functions
function loadFavorites() {
  const savedFavorites = localStorage.getItem("favorites");
  return savedFavorites ? JSON.parse(savedFavorites) : [];
}
