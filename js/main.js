/* const modeDarkLight = document.querySelector("[data-mode]");
const cards = document.querySelector("[data-cards]");

console.log(modeDarkLight)

modeDarkLight.addEventListener("change", () => {
    if (modeDarkLight.checked) {
        console.log("Hola Mundo");
        cards.classList.add("light");
    } else {
        cards.classList.remove("light")
    }
}); */

import { Pokemon } from "./PokemonClass.js";
import { typeColor } from "./colors.js";

const Pokedex = (() => {
    'use strict';

    const _amountPokemonsShow = (amount, name) => {
        const cards = document.querySelector("[data-cards]");
        if (amount == 0) {
            const cardContainer = document.createElement('article');
            cardContainer.classList.add("card-container");
            _drawPokemonCard(name, cardContainer);
            cards.appendChild(cardContainer);
        } else {
            for (let i = 1; i <= amount; i++) {
                const cardContainer = document.createElement('article');
                cardContainer.classList.add("card-container");
                _drawPokemonCard(i, cardContainer);
                cards.appendChild(cardContainer);
            }
        }
    }

    const _drawPokemonCard = async(_id, _cardContainer) => {
        const {id, name, types, stats, hp, sprites} = await _fetchPokemon(_id);
        const pokemon = Pokemon(id, name, types, stats,hp, sprites);
        let card = '';
        card += `
            <div class="card" data-card-${pokemon.id}>
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
                        <p>Taque</p>
                    </div>
                    <div>
                        <h3>${pokemon.stats[2].base_stat}</h3>
                        <p>Defensa</p>
                    </div>
                    <div>
                        <h3>${pokemon.stats[5].base_stat}</h3>
                        <p>Velocidad</p>
                    </div>
                </div>
            </div>
        `;
        _cardContainer.innerHTML = card;
        const divTypes = document.querySelector(`[data-type-${pokemon.id}]`);
        const cardTheme = document.querySelector(`[data-card-${pokemon.id}]`);
        _appednTypes(pokemon.types, divTypes);
        const themeColor = typeColor[pokemon.types[0].type.name];
        _styleCard(themeColor, cardTheme);
    }

    const _appednTypes = (types, divTypes) => {
        types.forEach(item => {
            const span = document.createElement("span");
            span.textContent = item.type.name;
            divTypes.appendChild(span);
        });
    }

    const _styleCard = (themeColor, cardTheme) => {
        cardTheme.style.background = `radial-gradient(
            circle at 50% 0%, ${themeColor} 36%, #ffffff 36%
        )`;
        cardTheme.querySelectorAll(".types span").forEach(typeColor => {
            typeColor.style.background = themeColor;
        });
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

    const searchPokemon = async (name) => {
        const cards = document.querySelector("[data-cards]");
        const cardContainer = document.createElement('article');
        cardContainer.classList.add("card-container");
        _drawPokemonCard(name, cardContainer);
        cards.appendChild(cardContainer);
    }

    const showPokedex = (amount, name) => {
        _amountPokemonsShow(amount, name);
    }

    return {
        showPokedex
    }
})();

const removeAllCards = () => {
    const cards = document.querySelector("[data-cards]");
    if (cards.hasChildNodes() )
    {
        while ( cards.childNodes.length >= 1 ){
            cards.removeChild( cards.firstChild );
        }
    }
}

Pokedex.showPokedex(150, "null");

const form = document.querySelector("[data-form]");

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const pokeName = document.querySelector("[data-input]").value;
    if (pokeName.length !== 0) {
        removeAllCards();
        Pokedex.showPokedex(0, pokeName.toLowerCase());
    } else {
        alert('No has escrito nada en el usuario');
        removeAllCards();
        Pokedex.showPokedex(150, "null");
        return;
    }

    this.submit();
    //Pokedex.searchPokemon(input.value.toLowerCase());
});