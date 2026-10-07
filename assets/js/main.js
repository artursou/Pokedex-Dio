
const pokenonList = document.getElementById("pokemonList")
const pokenonDetails = document.getElementById("modalDetalhes")
const loadMoreButton = document.getElementById("loadMoreButton")
const limit = 2
let offset = 0

const maxRecords = 100000;


function loadPokemonItens(offset, limit) {

    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map((pokemon) => `
           <li class="pokemon ${pokemon.type}" data-name="${pokemon.name}">
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
                <li class="pokemon ${pokemon.type}" data-name="${pokemon.name}">
                    <button class="shiny-btn" type="button" title="Versão Shiny">✨</button>
                    
                    <span class="number">#${pokemon.number}</span>
                    <span class="name">${pokemon.name}</span>
                    
                    <div class="detail">
                        <ol class="types">
                            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join("")}
                        </ol>
                        <img class="pokemon-image" src="${pokemon.photo}" data-normal="${pokemon.photo}" data-shiny="${pokemon.photoShiny}" alt="${pokemon.name}"">
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



const modal = document.getElementById("modalDetalhes");
const closed = document.getElementById("btnFecharModal")

pokenonList.addEventListener("click", (event) => {
    if (event.target.closest('.shiny-btn')) {
        return; 
    }

    const cardClicado = event.target.closest('.pokemon');


    if(!cardClicado) return;

    const botaoShinyDesseCard = cardClicado.querySelector('.shiny-btn');
    const estaShiny = botaoShinyDesseCard.classList.contains('active');

    const nomeDoPokemon = cardClicado.dataset.name;

    modal.classList.remove("escondido");

    pokeApi.getPokemonsByName(nomeDoPokemon).then((pokemon) => {
        let fotoQueVaiProModal;
        if (estaShiny) {
            fotoQueVaiProModal = pokemon.photoShiny;
        } else {
            fotoQueVaiProModal = pokemon.photo;
        }
        const newHtml =  `
            <div class="modal-card">
            <button id="btnFecharModal" class="close-btn">X</button>
            <h2 id="modalNome">${pokemon.name}</h2>
            <img id="modalImagem" src="${fotoQueVaiProModal}" alt="${pokemon.name}">
            <div class="modal-stats">
                <p><strong>HP:</strong> <span id="modalHp">${pokemon.hp}</span></p>
                <p><strong>Ataque:</strong> <span id="modalAtk">${pokemon.atk}</span></p>
                <p><strong>Defesa:</strong> <span id="modalDef">${pokemon.def}</span></p>
                <p><strong>Peso:</strong> <span id="modalPeso">${pokemon.weight}</span> kg</p>
            </div>
        </div>
        `;
        pokenonDetails.innerHTML = newHtml

        const btnFechar = document.getElementById("btnFecharModal");
        btnFechar.addEventListener("click", () => {
            modal.classList.add("escondido");
        });
    })


    
})

pokemonList.addEventListener("click", (event) => {
    const botaoClicado = event.target.closest('.shiny-btn ');

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
})