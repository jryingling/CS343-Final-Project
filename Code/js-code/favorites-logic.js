console.log("JS loaded");

// Element selection
const showSearchBtn = document.querySelector("#showSearchBtn");
const cancelSearchBtn = document.querySelector("#cancelSearchBtn");
const favoritesSection = document.querySelector("#favoritesSection");
const searchSection = document.querySelector("#searchSection");
const searchBtn = document.querySelector("#searchBtn");

// Event listeners
showSearchBtn.addEventListener("click", function () {
  favoritesSection.hidden = true;
  searchSection.hidden = false;
});

cancelSearchBtn.addEventListener("click", function () {
  searchSection.hidden = true;
  favoritesSection.hidden = false;
});

searchBtn.addEventListener("click", handleSearch());

function handleSearch() {
  console.log("The search button was clicked");
}

// Future functions
function loadFavorites() {
  const savedFavorites = localStorage.getItem("favorites");
  return savedFavorites ? JSON.parse(savedFavorites) : [];
}