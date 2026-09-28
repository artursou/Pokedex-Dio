
const pokenonList = document.getElementById("pokemonList")
const loadMoreButton = document.getElementById("loadMoreButton")
const limit = 2
let offset = 0

const maxRecords = 100000;


function loadPokemonItens(offset, limit) {

    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map((pokemon) => `
            <li class="pokemon ${pokemon.type}">
                <button class="shiny-btn" type="button" title="Versão Shiny">✨</button>
                
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>
                
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join("")}
                    </ol>
                    <img class="pokemon-image" src="${pokemon.photo}" data-normal="${pokemon.photo}" data-shiny="${pokemon.photoShiny}" alt="${pokemon.name}">
                </div>        
            </li>
        `).join("")
        pokenonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset ,limit)


pokemonList.addEventListener("click", (event) => {
    const botaoClicado = event.target.closest('.shiny-btn');

    if (!botaoClicado) return;
        const cardDoPokemon = botaoClicado.closest('.pokemon');
        const imagem = cardDoPokemon.querySelector('.pokemon-image');
        const cardAtributos = botaoClicado.closest('.pokemon');

        const urlNormal = imagem.dataset.normal;
        const urlShiny = imagem.dataset.shiny;

        if (imagem.src === urlNormal) {
            imagem.src = urlShiny;
            botaoClicado.classList.add('active');
        } else {
            imagem.src = urlNormal;
            botaoClicado.classList.remove('active'); 
        }
    if (botaoClicado) return;
        botaoClicado.classList.add('active');
})



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
                    <button class="shiny-btn" type="button" title="Versão Shiny">✨</button>
                    
                    <span class="number">#${pokemon.number}</span>
                    <span class="name">${pokemon.name}</span>
                    
                    <div class="detail">
                        <ol class="types">
                            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join("")}
                        </ol>
                        <img class="pokemon-image" src="${pokemon.photo}" alt="${pokemon.name}">
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

