// currently used in index.js ONLY
let pokemon = [];
fetch("../data/pokemon_dex_name.json")
  .then((response) => response.json())
  .then((data) => {
    pokemon = data;
    getSuggestions();
  });

const input = document.getElementById("pokemon-search");
const datalist = document.getElementById("pokemon-list");

input.addEventListener("input", function () {
  const query = this.value.toLowerCase();
  datalist.innerHTML = "";

  pokemon
    .filter((p) => p.name.toLowerCase().startsWith(query))
    .slice(0, 10)
    .forEach((p) => {
      const option = document.createElement("option");
      option.value = capitalize(p.name);
      datalist.appendChild(option);
    });
});

// search navigate to pokedex page
document.querySelector(".search-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const searchError = document.getElementById("search-error");
  validateSearch()
    .then((name) => {
      searchError.hidden = true;
      goToPokemon(name[0]);
    })
    .catch(() => {
      searchError.textContent = "No Pokémon found. Please enter a valid name.";
      searchError.hidden = false;
    });
});

// trainer profile stuff

const displayName = document.getElementById("display-name");
const displayPic = document.getElementById("display-pic");

const editBtn = document.getElementById("edit-profile-btn");
const editor = document.getElementById("profile-editor");

const nameInput = document.getElementById("trainer-name");
const picInput = document.getElementById("profile-pic-input");
const saveBtn = document.getElementById("save-profile");

// LOAD SAVED DATA
const savedName = localStorage.getItem("trainerName");
const savedPic = localStorage.getItem("profilePic");

if (savedName) {
  displayName.textContent = savedName;
}

if (savedPic) {
  displayPic.src = savedPic;
}

// OPEN EDITOR
editBtn.addEventListener("click", function () {
  editor.hidden = false;

  // preload values into editor
  nameInput.value = savedName || "";
});

// SAVE PROFILE
saveBtn.addEventListener("click", function () {
  const newName = nameInput.value.trim();
  const file = picInput.files[0];

  if (newName !== "") {
    localStorage.setItem("trainerName", newName);
    displayName.textContent = newName;
  }

  if (file) {
    const reader = new FileReader();

    reader.onload = function () {
      localStorage.setItem("profilePic", reader.result);
      displayPic.src = reader.result;
    };

    reader.readAsDataURL(file);
  }

  editor.hidden = true;
});
