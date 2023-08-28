import { Pokemon } from "./PokemonClass.js";
import { typeColor } from "./colors.js";

const Pokedex = (() => {
    'use strict';

    const showPokedex = (amount, name, type) => {
        _waitingCardsLoad();
        setTimeout(function() {
            removeAllCards();
            _amountPokemonsShow(amount, name, type);
            _showPokemonsLeaked(amount, type);
        }, 3000);
        _paintTypesButtons();
    }

    const removeAllCards = () => {
        const cards = document.querySelector("[data-cards]");
        if (cards.hasChildNodes() )
        {
            while ( cards.childNodes.length >= 1 ){
                cards.removeChild( cards.firstChild );
            }
        }
    }

    const _waitingCardsLoad = () => {
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

    const _showPokemonsLeaked = async(amount, type) => {
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
        }
    }

    const _amountPokemonsShow = (amount, name, type) => {
        const cards = document.querySelector("[data-cards]");
        if (name !== "null" && amount === 0) {
            const cardContainer = document.createElement('article');
            cardContainer.classList.add("card-container");
            _drawPokemonCard(name, cardContainer);
            cards.appendChild(cardContainer);
        } else if (amount > 0 && type == "null") {
            for (let i = 1; i <= amount; i++) {
                const cardContainer = document.createElement('article');
                cardContainer.classList.add("card-container");
                _drawPokemonCard(i, cardContainer);
                cards.appendChild(cardContainer);
            }
        }
    }

    const _drawPokemonCard = async(_id, _cardContainer) => {
        const data = await _fetchPokemon(_id);

        const pokemon = Pokemon(
            data.id,
            data.name,
            data.types,
            data.stats,
            data.hp,
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
                <h2 class="poke-name">${pokemon.name}</h2>
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
        //console.log(pokemon.types);
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

    const _paintTypesButtons = () => {
        const containerButtonsType = document.querySelector(".buttons-types");
        if (containerButtonsType.hasChildNodes() )
        {
            const children = containerButtonsType.childNodes;

            for (let i = 0; i < children.length; i++) {
                if ((i % 2) !== 0) {
                    let colorTheme = typeColor[children[i].textContent.toLowerCase()];
                    children[i].style.background = typeColor[children[i].textContent.toLowerCase()];
                }
                
            }
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
        showPokedex,
        removeAllCards
    }
})();

Pokedex.showPokedex(150, "null", "null");

const form = document.querySelector("[data-form]");
const imgHome = document.querySelector("[data-logo]");
const btnAll = document.querySelector("[data-all]");
const btlGrass = document.querySelector("[data-grass]");
const btnPoison = document.querySelector("[data-poison]");
const btnFire = document.querySelector("[data-fire]");
const btnFlying = document.querySelector("[data-flying]");
const btnWater = document.querySelector("[data-water]");
const btnBug = document.querySelector("[data-bug]");
const btnNormal = document.querySelector("[data-normal]");
const btnElectric = document.querySelector("[data-electric]");
const btnGround = document.querySelector("[data-ground]");
const btnFairy = document.querySelector("[data-fairy]");
const btnFighting = document.querySelector("[data-fighting]");
const btnPsychic = document.querySelector("[data-psychic]");
const btnRock = document.querySelector("[data-rock]");
const btnIce = document.querySelector("[data-ice]");
const btnGhost = document.querySelector("[data-ghost]");
const btnDragon = document.querySelector("[data-dragon]");

imgHome.addEventListener("click", () => {
    Pokedex.removeAllCards();
    Pokedex.showPokedex(150, "null", "null");
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const pokeName = document.querySelector("[data-input]").value;
    if (pokeName.length !== 0) {
        Pokedex.removeAllCards();
        Pokedex.showPokedex(0, pokeName.toLowerCase(), "null");
    } else {
        alert('Por favor ingrese el nombre del Pokémon en la caja de texto.');
        Pokedex.removeAllCards();
        Pokedex.showPokedex(150, "null", "null");
        return;
    }

    this.submit();
});

btnAll.addEventListener("click", () => {
    Pokedex.removeAllCards();
    Pokedex.showPokedex(150, "null", "null");
});

btlGrass.addEventListener("click", () => {
    Pokedex.removeAllCards();
    Pokedex.showPokedex(150, "null", "grass");
});

btnPoison.addEventListener("click", () => {
    Pokedex.removeAllCards();
    Pokedex.showPokedex(150, "null", "poison");
});
btnFire.addEventListener("click", () => {
    Pokedex.removeAllCards();
    Pokedex.showPokedex(150, "null", "fire");
});
btnFlying.addEventListener("click", () => {
    Pokedex.removeAllCards();
    Pokedex.showPokedex(150, "null", "flying");
});
btnWater.addEventListener("click", () => {
    Pokedex.removeAllCards();
    Pokedex.showPokedex(150, "null", "water");
});
btnBug.addEventListener("click", () => {
    Pokedex.removeAllCards();
    Pokedex.showPokedex(150, "null", "bug");
});
btnNormal.addEventListener("click", () => {
    Pokedex.removeAllCards();
    Pokedex.showPokedex(150, "null", "normal");
});
btnElectric.addEventListener("click", () => {
    Pokedex.removeAllCards();
    Pokedex.showPokedex(150, "null", "electric");
});
btnGround.addEventListener("click", () => {
    Pokedex.removeAllCards();
    Pokedex.showPokedex(150, "null", "ground");
});
btnFairy.addEventListener("click", () => {
    Pokedex.removeAllCards();
    Pokedex.showPokedex(150, "null", "fairy");
});
btnFighting.addEventListener("click", () => {
    Pokedex.removeAllCards();
    Pokedex.showPokedex(150, "null", "fighting");
});
btnPsychic.addEventListener("click", () => {
    Pokedex.removeAllCards();
    Pokedex.showPokedex(150, "null", "psychic");
});
btnRock.addEventListener("click", () => {
    Pokedex.removeAllCards();
    Pokedex.showPokedex(150, "null", "rock");
});
btnIce.addEventListener("click", () => {
    Pokedex.removeAllCards();
    Pokedex.showPokedex(150, "null", "ice");
});
btnGhost.addEventListener("click", () => {
    Pokedex.removeAllCards();
    Pokedex.showPokedex(150, "null", "ghost");
});
btnDragon.addEventListener("click", () => {
    Pokedex.removeAllCards();
    Pokedex.showPokedex(150, "null", "dragon");
});