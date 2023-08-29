import { Pokemon } from "./PokemonClass.js";
import { typeColor } from "./colors.js";

const Pokedex = (() => {
    'use strict';

    const showPokedex = (amount, name) => {
        _addEventsToTypeButtons();
        _waitingCardsLoad();
        _paintTypesButtons();
        setTimeout(function() {
            _removeAllCards();
            _amountPokemonsShow(amount, name);
        }, 1000);
    }

    const _removeAllCards = () => {
        const cards = document.querySelector("[data-cards]");
        if (cards.hasChildNodes() )
        {
            while ( cards.childNodes.length >= 1 ){
                cards.removeChild( cards.firstChild );
            }
        }
    }

    const _addEventsToTypeButtons = () => {
        const containerButtonsType = document.querySelector(".buttons-types");
        if (containerButtonsType.hasChildNodes() )
        {
            const children = containerButtonsType.childNodes;
    
            for (let i = 0; i < children.length; i++) {
                if ((i % 2) !== 0) {
                    if (children[i].textContent == "All") {
                        children[i].addEventListener("click", () => {
                            _amountPokemonsShow(150, "null");
                        })
                    } else {
                        children[i].addEventListener("click", () => {
                            _showPokemonsLeaked(150, children[i].textContent.toLowerCase());
                        })
                    }                
                }  
            }
        }
    }

    const _waitingCardsLoad = () => {
        _removeAllCards();
        const cards = document.querySelector("[data-cards]");
        let dinvLoadContainer = '';
        dinvLoadContainer += `
            <section class="load-container blur-in">
                <div class="ring"></div>
                <div class="ring"></div>
                <div class="ring"></div>
                <p>Loading...</p>
            </section>
        `;
        cards.innerHTML = dinvLoadContainer;
    }

    const _addEventsToCards = () => {
        const cardsContainer = document.querySelector("[data-cards]");
        if (cardsContainer.hasChildNodes()) {
            const children = cardsContainer.childNodes;
    
            for (let i = 0; i < children.length; i++) {     
                children[i].addEventListener("click", () => {
                    children[i].querySelectorAll(".card .poke-name").forEach((p) => {
                        _createModal(p.textContent.toLowerCase());
                    })
                })
            }
        }
    }

    const _createModal = async(id) => {
        const modalSection = document.querySelector("[data-modal]");
        const data = await _fetchPokemon(id);
        const pokemon = Pokemon(
            data.id,
            data.name,
            data.types,
            data.stats,
            data.sprites
        );

        let cardModal = '';
        cardModal += `
        <article class="modal_container blur-in blur-in-expand" data-modalCard-${pokemon.id}>
            <div class="modal-id">
                <p class="hp">
                    <span>HP</span>
                    #${pokemon.id.toString().padStart(3,0)}
                </p>
            </div>
            <div class="modal-main">
            <img src="${pokemon.sprites.versions['generation-v']['black-white'].animated.front_default}" alt="">
                <h2 class="poke-name">${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</h2>
                <div class="types" data-modalTypes-${pokemon.id}>
                </div>
            </div>
            <div class="modal-about">
                <div class="nav">
                    <a href="#" data-about>About</a>
                    <a href="#" data-stats>Base Stats</a>
                    <a href="#" data-evolutions>Evolution</a>
                    <a href="#" data-moves>Moves</a>
                    <div class="animation start-home"></div>
                </div>
                <div class="information" data-modalInfo>
                    
                </div>
            </div>
            <a class="modal_close" data-modalClose>CLOSE</a>
        </article>
        `;
        modalSection.innerHTML = cardModal;
        modalSection.classList.add("modal--show");

        

        const divTypes = document.querySelector(`[data-modalTypes-${pokemon.id}]`);
        const cardTheme = document.querySelector(`[data-modalCard-${pokemon.id}]`);
        _appednTypes(pokemon.types, divTypes);
        const themeColor = typeColor[pokemon.types[0].type.name];
        _styleCard(themeColor, cardTheme, divTypes);

        loadInformation(pokemon, "about");

        //---- HACIENDO PRUEBAS ---

        if (modalSection.classList.contains("modal--show")){

            window.addEventListener('click', function(e) {
                /*2. Si el article [data-modalCard-${pokemon.id}] contiene a e. target*/
            
                console.log("Si contiene la clase modal--show");
                if (!(cardTheme.contains(e.target))) {
                    modalSection.classList.remove("modal--show");
                    while ( modalSection.childNodes.length >= 1 ){
                        modalSection.removeChild( modalSection.firstChild );
                    }
                    
                } /* else {
                    alert("Clicked outside Box");
                    console.log(e.target);
                    
                } */
                
            })
            
            const btnCloseModal = document.querySelector("[data-modalClose]");
            btnCloseModal.addEventListener("click", () => {
                modalSection.classList.remove("modal--show");
                modalSection.removeChild(cardTheme);
            })
        }
        
        
    }

    const _paintTypesButtons = () => {
        const containerButtonsType = document.querySelector(".buttons-types");
        if ( containerButtonsType.hasChildNodes() )
        {
            const children = containerButtonsType.childNodes;

            for (let i = 0; i < children.length; i++) {
                if ((i % 2) !== 0) {
                    children[i].style.background = typeColor[children[i].textContent.toLowerCase()];                  
                }
                
            }
        }

    }

    const loadInformation = (pokemon, typeInfo) => {
        const divInformation = document.querySelector("[data-modalInfo]");
        let information = '';

        if (typeInfo == "about") {
            console.log("Entroooo")
            console.log(divInformation);
            information += `
                <pre>Species      <span>${pokemon.stats[5].base_stat}</span></pre>
                <pre>Height       <span>2'3*(0.70 cm)</span></pre>
                <pre>Weight       <span>15.2 lbs (6.9 kg)</span></pre>
                <pre>Abilities    <span>Overgrow Chlorophyl</span></pre>
                <h2>Breending</h2>
                <pre>Gender       <span>87.5%    12.6%</span></pre>
                <pre>Egg Groups   <span>Monster</span></pre>
                <pre>Egg Cycle    <span>Grass</span></pre>
            `;
            divInformation.innerHTML = information;
        }

    }

    const _showPokemonsLeaked = async(amount, type) => {
        _removeAllCards();
        const cards = document.querySelector("[data-cards]");
        if (type !== "null") {
            for (let i = 1; i <= amount; i++) {
                const data = await _fetchPokemon(i);
                data.types.forEach(item => {
                    if (item.type.name === type) {
                        const cardContainer = document.createElement('article');
                        cardContainer.classList.add("card-container");
                        _drawPokemonCard(i, cardContainer);
                        cards.appendChild(cardContainer);
                    }
                });
            }
            _addEventsToCards();
        }
    }

    const _amountPokemonsShow = (amount, name) => {
        _removeAllCards();
        const cards = document.querySelector("[data-cards]");
        if (name !== "null" && amount === 0) {
            const cardContainer = document.createElement('article');
            cardContainer.classList.add("card-container");
            _drawPokemonCard(name, cardContainer);
            cards.appendChild(cardContainer);
            _addEventsToCards();
        } else if (amount > 0) {
            for (let i = 1; i <= amount; i++) {
                const cardContainer = document.createElement('article');
                cardContainer.classList.add("card-container");
                _drawPokemonCard(i, cardContainer);
                cards.appendChild(cardContainer);
            }
            _addEventsToCards();
        }
    }

    const _drawPokemonCard = async(_id, _cardContainer) => {
        const data = await _fetchPokemon(_id);

        const pokemon = Pokemon(
            data.id,
            data.name,
            data.types,
            data.stats,
            data.sprites
        );

        let card = '';
        card += `
            <div class="card blur-in" data-card-${pokemon.id}>
                <p class="hp">
                    <span>HP</span>
                    #${pokemon.id.toString().padStart(3,0)}
                </p>
                <img src="${pokemon.sprites.other.dream_world.front_default}" alt="">
                <h2 class="poke-name">${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</h2>
                <div class="types" data-type-${pokemon.id}>

                </div>
                <div class="stats">
                    <div>
                        <h3>${pokemon.stats[1].base_stat}</h3>
                        <p>Attack</p>
                    </div>
                    <div>
                        <h3>${pokemon.stats[2].base_stat}</h3>
                        <p>Defense</p>
                    </div>
                    <div>
                        <h3>${pokemon.stats[5].base_stat}</h3>
                        <p>Speed</p>
                    </div>
                </div>
            </div>
        `;
        _cardContainer.innerHTML = card;
        const divTypes = document.querySelector(`[data-type-${pokemon.id}]`);
        const cardTheme = document.querySelector(`[data-card-${pokemon.id}]`);
        _appednTypes(pokemon.types, divTypes);
        const themeColor = typeColor[pokemon.types[0].type.name];
        _styleCard(themeColor, cardTheme, divTypes);
    }

    const _appednTypes = (types, divTypes) => {
        types.forEach(item => {
            const span = document.createElement("span");
            span.textContent = item.type.name;
            divTypes.appendChild(span);
        });
    }

    const _styleCard = (themeColor, cardTheme, divTypes) => {
        cardTheme.style.background = `radial-gradient(
            circle at 50% 0%, ${themeColor} 36%, #ffffff 36%
        )`;
        
        const children = divTypes.childNodes;

        for (let i = 1; i < children.length; i++) {
            children[i].style.background = typeColor[children[i].textContent];           
        }
    }

    const _fetchPokemon = async(id) => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
            if (!response.ok) {
                throw new Error("Error 404");
            }
            return response.json();
        } catch {
            return null;
        }
    }

    return {
        showPokedex
    }
})();

const form = document.querySelector("[data-form]");
const imgHome = document.querySelector("[data-logo]");

Pokedex.showPokedex(150, "null");

imgHome.addEventListener("click", () => {
    Pokedex.showPokedex(150, "null");
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const pokeName = document.querySelector("[data-input]").value;
    if (pokeName.length !== 0) {
        Pokedex.showPokedex(0, pokeName.toLowerCase());
    } else {
        alert('Por favor ingrese el nombre del Pokémon en la caja de texto.');
        Pokedex.showPokedex(150, "null");
        return;
    }
});
