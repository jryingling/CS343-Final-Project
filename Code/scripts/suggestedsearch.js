let pokemon = [];

// How do we filter more precisely?
// display pokemon that start with the letter first

fetch('../data/pokemon_dex_name.json')
    .then(res => res.json())
    .then(data => {
        const datalist = document.getElementById('pokemon-list');
        data.forEach(p => {
            const option = document.createElement('option');
            option.value = p.name;
            datalist.appendChild(option);
        });
    });