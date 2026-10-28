
const pokenonList = document.getElementById("pokemonList")
const pokenonDetails = document.getElementById("modalDetalhes")
const loadMoreButton = document.getElementById("loadMoreButton")
const limit = 20
let offset = 0

const maxRecords = 100000;

function criaHtmlDoPokemon(pokemon) {

    const favoritos = JSON.parse(localStorage.getItem("meusFavoritos")) || [];

    const ehFavorito = favoritos.includes(pokemon.name)

    const classeCoracao = ehFavorito ? "heart-btn favoritado" : "heart-btn";
    const iconeCoracao = ehFavorito ? "❤️" : "🤍";

    return `
        <li class="pokemon ${pokemon.type}" data-name="${pokemon.name}">
            <button class="shiny-btn" type="button" title="Versão Shiny">✨</button>
            
            <!-- Olha as nossas variáveis aqui! -->
            <button class="${classeCoracao}" type="button" title="Favoritar">${iconeCoracao}</button>
            
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            
            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join("")}
                </ol>
                <img class="pokemon-image" src="${pokemon.photo}" data-normal="${pokemon.photo}" data-shiny="${pokemon.photoShiny}" alt="${pokemon.name}">
            </div>        
        </li>
    `;
}


function loadPokemonItens(offset, limit) {

    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(criaHtmlDoPokemon).join("");
        pokenonList.innerHTML += newHtml;
    })
}

loadPokemonItens(offset ,limit)


// 1. Capturamos a sentinela que está no HTML
const sentinela = document.getElementById('sentinela');

// 2. Criamos o Guarda (IntersectionObserver)
const observer = new IntersectionObserver((entries) => {
    // entries é uma lista de coisas que ele está vigiando. 
    // Como ele só vigia a sentinela, ela é o item [0]
    const nossaSentinela = entries[0];

    // 3. A pergunta mágica: A sentinela está aparecendo na tela?
    if (nossaSentinela.isIntersecting) {
        // Se sim, fazemos a matemática das páginas exatamente como era no botão!
        offset += limit;
        loadPokemonItens(offset, limit);
    }
});

// 4. Damos a ordem oficial: "Guarda, comece a vigiar a sentinela agora!"
observer.observe(sentinela);

const buttonSearch = document.getElementById("idDuttonSearch")
const inputSearch = document.getElementById("idInputSearch")




buttonSearch.addEventListener("click", () => {
    const text = inputSearch.value.toLowerCase();
    
    if (text === "") return;

    pokeApi.getPokemonsByName(text)
        .then((pokemon) => {
            const htmlDoPokemon = criaHtmlDoPokemon(pokemon);
            
            pokenonList.innerHTML = htmlDoPokemon;

            sentinela.style.display = "none";
        })
        .catch((error) => {
            alert("Pokémon não encontrado!");
        });
});



const modal = document.getElementById("modalDetalhes");
const closed = document.getElementById("btnFecharModal")

pokenonList.addEventListener("click", (event) => {

    const botaoCoracao = event.target.closest('.heart-btn');


    if (botaoCoracao) {
    const cardClicado = botaoCoracao.closest('.pokemon');
    const nomeDoPokemon = cardClicado.dataset.name;
    
    let favoritos = JSON.parse(localStorage.getItem("meusFavoritos")) || [];

        

    if (favoritos.includes(nomeDoPokemon)) {
        favoritos = favoritos.filter((nomeNaLista) => nomeNaLista !== nomeDoPokemon);

        botaoCoracao.classList.remove('favoritado');
        botaoCoracao.innerText = "🤍";
    } else {

        favoritos.push(nomeDoPokemon);
        botaoCoracao.classList.add('favoritado');
        botaoCoracao.innerText = "❤️";
    }

    localStorage.setItem("meusFavoritos", JSON.stringify(favoritos));

    return;
}

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



const typeFilters = document.getElementById("typeFilters");

typeFilters.addEventListener("click", (event) => {
    const botaoClicado = event.target.closest('.filter-btn');

    if (!botaoClicado) return; 

    const tipoEscolhido = botaoClicado.dataset.type;
    console.log("O usuário quer filtrar por:", tipoEscolhido);
    
    if (tipoEscolhido === "all"){
        pokenonList.innerHTML = "";
        offset = 0;
        loadPokemonItens(offset, limit);

        sentinela.style.display = "block";
    } else {
        sentinela.style.display = "none";

        pokeApi.getPokemonsByType(tipoEscolhido).then((pokemons = []) => {
            const newHtml = pokemons.map(criaHtmlDoPokemon).join("");
            pokenonList.innerHTML = newHtml;
        })
    }
});
