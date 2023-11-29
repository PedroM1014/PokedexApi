const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const URL = "https://pokeapi.co/api/v2/pokemon/";
const numeroDePokemons = 898;
const loadingIndicator = document.getElementById('loading');

function getPokemonData(i) {
    return fetch(URL + i)
        .then((response) => response.json());
}

function carregarTodosPokemons() {
    loadingIndicator.style.display = 'block';

    const promises = [];

    for (let i = 1; i <= numeroDePokemons; i++) {
        promises.push(getPokemonData(i));
    }

    return Promise.all(promises)
        .then(pokemons => {
            pokemons.forEach(mostrarPokemon);
            loadingIndicator.style.display = 'none';
        });
}

carregarTodosPokemons()
    .then(pokemons => pokemons.forEach(mostrarPokemon));

const inputPesquisa = document.querySelector("#inputPesquisa");
const btnPesquisar = document.querySelector("#btnPesquisar");

btnPesquisar.addEventListener("click", () => {
    const termoPesquisa = inputPesquisa.value.toLowerCase(); // Converte para minúsculas para correspondência de texto não sensível a maiúsculas e minúsculas

    listaPokemon.innerHTML = ""; // Limpa a lista atual

    for (let i = 1; i <= numeroDePokemons; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => {
                const nomePokemon = data.name.toLowerCase(); // Converte o nome do Pokémon para minúsculas
                const idPokemon = data.id.toString();

                if (nomePokemon.includes(termoPesquisa) || idPokemon.includes(termoPesquisa)) {
                    mostrarPokemon(data);
                }
            })
    }
});

function mostrarPokemon(poke) {

    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join('');

    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }


    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${poke.height}m</p>
                <p class="stat">${poke.weight}kg</p>
            </div>
        </div>
    `;
    listaPokemon.append(div);
}

botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;

    listaPokemon.innerHTML = "";

    for (let i = 1; i <= numeroDePokemons; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => {

                if (botonId === "ver-todos") {
                    mostrarPokemon(data);
                } else {
                    const tipos = data.types.map(type => type.type.name);
                    if (tipos.some(tipo => tipo.includes(botonId))) {
                        mostrarPokemon(data);
                    }
                }

            })
    }
}))