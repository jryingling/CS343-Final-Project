// will run on load
getTip();

(function fetchRandomPokemon() {
  const maxid = 1025;
  const pokedexid = getDailyPokemonId(maxid);

  queryPokeAPI(pokedexid)
    .then((data) => processJSON(data))
    .then((clean) => renderCard(clean))
    .catch(() => {
      document.getElementById("randomMonMessage").textContent =
        "Failed to load Pokémon. Check your connection and try again.";
    });
})();

// functions
function getDailyPokemonId(maxid) {
  const today = new Date();

  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  const random = Math.sin(seed) * 10000;
  const decimal = random - Math.floor(random);

  return Math.floor(decimal * maxid) + 1;
}

function validateSearch() {
  const pokeSearch = document.getElementById("pokemon-search").value.trim();
  const match = pokemon.find(
    (p) => p.name.toLowerCase() === pokeSearch.toLowerCase(),
  );

  if (!match) {
    console.log("Pokemon does not exist");
    return Promise.reject("Invalid pokemon name.");
  } else {
    return Promise.resolve([match.name]);
  }
}

function renderCard(clean) {
  const randomMonMessage = document.getElementById("randomMonMessage");
  const randomMon = document.getElementById("randomMon");
  const randomMonName = document.getElementById("pokemon-name");

  randomMonName.textContent = clean.name;
  randomMon.src = clean.officialArt;
  randomMon.alt = `Official Art of ${clean.name}`;
  randomMonMessage.textContent = "";
}

function getTip() {
  fetch("../data/tips.json")
    .then((response) => response.json())
    .then((tips) => {
      const randomIndex = Math.floor(Math.random() * tips.length);
      const randomTip = tips[randomIndex].tip;

      document.getElementById("daily-tip").textContent =
        `Tip of The Day: ${randomTip}`;
    })
    .catch(() => {
      document.getElementById("daily-tip").textContent =
        "Tip of The Day: Failed to load tip.";
    });
}


//trainer profile stuff

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