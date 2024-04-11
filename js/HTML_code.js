import { typeColor } from './colors.js';

export const drawPokemonCard = (pokemon) => {
    let card = '';//Contendrá la estructura de la card
    //Asigna los datos correspondientes de la card
    card += `
        <div class="card blur-in" data-card-${pokemon.id}>
            <p class="hp">
                <span>ID #${pokemon.id.toString().padStart(3,0)}</span>
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

    return card;//Retorna la estructura de la card
}

export const drawLoadContainer = () => {
    let divLoadContainer = '';//Variable que contiene el contenido a mostrar
    divLoadContainer += `
        <section class="load-container blur-in">
            <div class="ring"></div>
            <div class="ring"></div>
            <div class="ring"></div>
            <p>Loading...</p>
        </section>
    `;
    return divLoadContainer;
}

export const drawCardModal = (pokemon) => {
    let cardModal = '';//Contiene toda la estructura del modal
    //Le asigna la estructura del modal incluyendo los valores de cada propiedad a mostrar
    cardModal += `
    <article class="modal_container blur-in-expand" data-modalCard-${pokemon.id}>
        <div class="modal-id">
            <p class="hp">
                <span>ID #${pokemon.id.toString().padStart(3,0)}</span>
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
                <a href="#" data-moves>Moves</a>
                <div class="animation start-home"></div>
            </div>
            <div class="information" data-modalInfo>
                
            </div>
        </div>
        <a class="modal_close" data-modalClose>CLOSE</a>
    </article>
    `;
    return cardModal;
}

export const showInformation = (pokemon, divInformation, typeInfo) => {
    let information = '';//Almacena la estructura que contendrá el apartado

    if (typeInfo == "about") {//verifica si se dió click en el botón "about"
        let height = parseInt(pokemon.height) / 10;//La altura se divide entre 10 para convertir de decímetros a metros
        let weight = parseInt(pokemon.weight) / 10; //El peso se divide entre 10 para convertir de hetogramos a kilogramos          
        //Se le asigna la estructura e información correspondiente
        information += `
            <p>Species:<span>${pokemon.species.name[0].toUpperCase() + pokemon.species.name.slice(1)}</span></p>
            <p>Height:       <span>${height} m</span></p>
            <p>Weight:       <span>${weight} kg</span></p>
            <p>Abilities:<span class="abilities" data-abilities></span></p>
            <p>Base Experience:<span class="base-experience">${pokemon.experience} pst.</span></p>
        `;
        divInformation.innerHTML = information;//Se inserta la estructura en el contenedor

        const spanAbilities = document.querySelector("[data-abilities]");//Alccede al Span que contendrá las habilidades
        //Recorre cada una de las habilidades de pokémon y se agregan al texto del span
        pokemon.abilities.forEach((ability) => {
            spanAbilities.textContent += ability.ability.name + " ";
        })
    } else if (typeInfo == "stats") {
        //Si el botón al que se dió click es de "stats", se agregan cada una de las estadisticas principales al contenedor
        information += `
            <div class="info-data">
                <div class="data-name">
                    <p>HP:</p>
                    <p>Attack:</p>
                    <p>Defence:</p>
                    <p>Sp. Attk:</p>
                    <p>Sp. Def:</p>
                    <p>Speed:</p>
                </div>
                <div class="data-value">
                    <div class="bar"><div style="width: ${(pokemon.stats[0].base_stat)/200 * 100}%; background-color: ${typeColor[pokemon.types[0].type.name]};" class="hp-value">${pokemon.stats[0].base_stat}</div></div>
                    <div class="bar"><div style="width: ${(pokemon.stats[1].base_stat)/200 * 100}%; background-color: ${typeColor[pokemon.types[0].type.name]};" class="hp-value">${pokemon.stats[1].base_stat}</div></div>
                    <div class="bar"><div style="width: ${(pokemon.stats[2].base_stat)/200 * 100}%; background-color: ${typeColor[pokemon.types[0].type.name]};" class="hp-value">${pokemon.stats[2].base_stat}</div></div>
                    <div class="bar"><div style="width: ${(pokemon.stats[3].base_stat)/200 * 100}%; background-color: ${typeColor[pokemon.types[0].type.name]};" class="hp-value">${pokemon.stats[3].base_stat}</div></div>
                    <div class="bar"><div style="width: ${(pokemon.stats[4].base_stat)/200 * 100}%; background-color: ${typeColor[pokemon.types[0].type.name]};" class="hp-value">${pokemon.stats[4].base_stat}</div></div>
                    <div class="bar"><div style="width: ${(pokemon.stats[5].base_stat)/200 * 100}%; background-color: ${typeColor[pokemon.types[0].type.name]};" class="hp-value">${pokemon.stats[5].base_stat}</div></div>
                </div>
            </div>
        `;
        //------ IMPORTANTE: las estadísticas se dividen entre 200 y se multiplican por 100, ya que algunas
        //exceden el 100% y se indica que el valor máximo es de 200 para el ancho del contenedor
        divInformation.innerHTML = information;//Se inserta la estructura
        
    } else if (typeInfo == "moves") {
        //En caso de ser el botón de "moves" al que se le dió click, se asigna su estructura correspondiente
        information += `
            <div class="info-moves">
            </div>
        `;
        divInformation.innerHTML = information;
        const movesInfo = document.querySelector(".info-moves");//Accede al div que contendrá los movimientos
        for (let i = 0; i < pokemon.moves.length; i++) {//Recorre el arreglo de movimientos
            if (i <= 20) {
                const pMove = document.createElement("p");//Crea un elemento "p" por cada movimiento
                pMove.style.backgroundColor = typeColor[pokemon.types[0].type.name];//Le asigna un color de fondo "naranja
                pMove.textContent = pokemon.moves[i].move.name;//Le asigna el nombre del movimiento
                movesInfo.appendChild(pMove);//Agrega el elemento "p" al contenedor
            } else {
                break;//Cuando llegue a los 20 movimientos (porque algunos pokémons tienen más), saldrá del bucle
                //para no mostrar tantos
            }
        }
    }
}
