
const pokenonList = document.getElementById("pokemonList")
const loadMoreButton = document.getElementById("loadMoreButton")
const limit = 2
let offset = 0

const maxRecords = 100000;


function loadPokemonItens(offset, limit) {

    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map((pokemon) => `
            <li class="pokemon ${pokemon.type}">
                    <span class="number">#${pokemon.number}</span>
                    <span class="name">${pokemon.name}</span>
                    <div class="detail">
                        <ol class="types">
                            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join("")}
                        </ol>
                        <img src="${pokemon.photo}" alt="${pokemon.name}">
                    </div>        
            </li>
        `).join("")
        pokenonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset ,limit)

loadMoreButton.addEventListener("click", () => {
    offset += limit;

    const qtdRecordNextPage = offset + limit

    if (qtdRecordNextPage >= maxRecords) {
        const newlimit = maxRecords - offset;
        loadPokemonItens(offset ,newlimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset ,limit)
    }

    
})

const buttonSearch = document.getElementById("idDuttonSearch")
const inputSearch = document.getElementById("idInputSearch")



buttonSearch.addEventListener("click", () => {
    const text = inputSearch.value.toLowerCase()
    
    pokeApi.getPokemonsByName(text)
        .then((pokemon) => {
            const htmlDoPokemon = `
                <li class="pokemon ${pokemon.type}">
                    <span class="number">#${pokemon.number}</span>
                    <span class="name">${pokemon.name}</span>
                    <div class="detail">
                        <ol class="types">
                            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join("")}
                        </ol>
                        <img src="${pokemon.photo}" alt="${pokemon.name}">
                    </div>        
                </li>
            `;

            pokemonList.innerHTML = "";

            pokenonList.innerHTML = htmlDoPokemon;

            loadMoreButton.style.display = "none";
        })
        .catch((error) => {
            alert("Pokemon nao encontrado!")
        })
})

