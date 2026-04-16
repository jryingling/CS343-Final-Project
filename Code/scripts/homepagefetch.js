// anonymous function
// run on load
// pokedex goes up to number 1025

// pokeapi sprites are located at json[5].front_default
// Not getting random pokemon by day, just new random pokemon on reload
// need to change to a formula based on the day

const randomMonMessage = document.getElementById('randomMonMessage');
const randomMon = document.getElementById('randomMon');
const randomMonName = document.getElementById('pokemon-name');

(function () {
    console.log("running");
    randomMonMessage.textContent = "loading...";
    console.log(randomMon);

    const maxid = 1025;
    const pokedexid = Math.floor(Math.random() * maxid) + 1;


    fetch(`https://pokeapi.co/api/v2/pokemon/${pokedexid}`)
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
            randomMonName.textContent = result;
            randomMonMessage.textContent = '';
            randomMon.src = artUrl;
        });
})();