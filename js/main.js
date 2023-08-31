//Se importan las librerias
import { Pokemon } from "./PokemonClass.js";
import { typeColor } from "./colors.js";

//Implementando el patron módulo
const Pokedex = (() => {
    'use strict';
    let _amount = 150;//Almacena la cantidad de Pokémons a mostrar

    //Única función pública (Se hace el llamado al final del código)
    const showPokedex = (name) => {
        _addEventsToTypeButtons();//Hace el llamado a la función que le asigna los eventos a los botones de filtrado
        _waitingCardsLoad();//Hace el llamado a la función que muestra el estado de "Cargando"
        _paintTypesButtons();//Hace el llamado a la función que le da el diseño a los botones de fintrado
        
        //Espera que transcurra un periodo de tiempo (en segundos) para seguir con la ejecución
        setTimeout(function() {
            _removeAllCards();//Hace el llamado a la función que remueve todas las cards del main
            _pokemonsShow(name);//Hace el llamado a la función para mostrar los Pokémons (Ya sea uno en específico o todos)
        }, 1000);
    }

    const _removeAllCards = () => {
        const cards = document.querySelector("[data-cards]");//Accede al elemento "main" el cual contiene todas las cards
        if (cards.hasChildNodes() )//Verifica si el "main" contiene nodos hijos
        {
            //Se ejecuta mientras la cantidad de nodos hijos que contiene el "main" sea mayor o igual que uno
            //lo cual significa que por lo menos tiene un hijo
            while ( cards.childNodes.length >= 1 ){
                cards.removeChild( cards.firstChild );//Remueve el primer nodo que encuentre (por cada vez)
            }
        }
    }

    const _addEventsToTypeButtons = () => {
        const containerButtonsType = document.querySelector(".buttons-types");//Accede al "section" que contiene los botones de filtrado
        const form = document.querySelector("[data-form]");//Accede al formulario de input (para buscar un Pokémon específico)
        const imgHome = document.querySelector("[data-logo]");//Accede al logotipo

        imgHome.addEventListener("click", () => {
            //Cada vez que se le dá click al logotipo se ejecuta lo siguiente....
            _waitingCardsLoad();//Hace el llamado a la función que muestra el estado de "Cargando"
            //Espera que transcurra un periodo de tiempo (en segundos) para seguir con la ejecución
            setTimeout(function() {
                _pokemonsShow("null");//Hace el llamado a la función para mostrar los Pokémons
                //Se le envía por parámetros el valor "null" ya que lo que se tiene que mostrar es la Pokédex completa                
            }, 1000);
        });

        form.addEventListener('submit', (e) => {
            //Cada vez que se le dá enviar al formulario se ejecuta lo siguiente....
            e.preventDefault();//Evita que se ejecute el evento por defecto
            const pokeName = document.querySelector("[data-input]").value;//Extrae el texto que contiene el input
            if (pokeName.length !== 0) {//Verifica que la cadena sea diferente de 0, es decir, que contenga texto
                _waitingCardsLoad();//Hace el llamado a la función que muestra el estado de "Cargando"
                //Espera que transcurra un periodo de tiempo (en segundos) para seguir con la ejecución
                setTimeout(function() {
                    _pokemonsShow(pokeName.toLowerCase());//Hace el llamado a la función para mostrar los Pokémons
                    //Se le envía por parámetros el valor "pokeName.toLowerCase()" ya que es lo que contiene el nombre
                    //del pokémon que se esta buscar
                }, 1000);
                document.querySelector("[data-input]").value = "";//Se elimina el texto del input
            } else {
                alert('Por favor ingrese el nombre del Pokémon en la caja de texto.');//Si no se ingresó ningún caracter, se le indica al usuario
            }
        });

        if (containerButtonsType.hasChildNodes() )//Verifica que el contenedor de los botones de filtrado tenga nodos hijos
        {
            const children = containerButtonsType.childNodes;//Almacena el arreglo de nodos hijos del contenedor, es decir, todos los botones
            
            for (let i = 0; i < children.length; i++) {//Recorre el arreglo de botones
                //Verifica que el residuo de la posición del elemento dividido 2 sea diferente de 0,
                //ya una posición de por medio el arreglo contiene el valor de "#Text" y no un nodo tipo "Button" como tal
                if ((i % 2) !== 0) {
                    if (children[i].textContent == "All") {//Verifica si el contenido del texto es "All"
                        children[i].addEventListener("click", () => {
                            //Si es "All" significa que se desea ver la Pokédex completa
                            _waitingCardsLoad();//Hace el llamado a la función que muestra el estado de "Cargando"
                            //Espera que transcurra un periodo de tiempo (en segundos) para seguir con la ejecución
                            setTimeout(function() {
                                _pokemonsShow("null");//Hace el llamado a la función para mostrar los Pokémons
                                //Se le envía por parámetros el valor "null" ya que lo que se tiene que mostrar es la Pokédex completa
                            }, 1000);
                        })
                    } else {//Caso contrario (Si es algún botón de filtro en específico)
                        children[i].addEventListener("click", () => {
                            _waitingCardsLoad();//Hace el llamado a la función que muestra el estado de "Cargando"
                            //Espera que transcurra un periodo de tiempo (en segundos) para seguir con la ejecución
                            setTimeout(function() {
                                _showPokemonsLeaked(children[i].textContent.toLowerCase());//Llama a la funcón que recibe un tipo en específico de Pokémon que se desea mostrar
                                //y se le pasa como parámetro el tipo de pokémon
                            }, 1000);
                        })
                    }                
                }  
            }
        }
    }

    const _waitingCardsLoad = () => {
        _removeAllCards();//Elimina todos los elementos que existan en el "main"
        const cards = document.querySelector("[data-cards]");//Accede al elemento "main"
        let dinvLoadContainer = '';//Variable que contiene el contenido a mostrar
        dinvLoadContainer += `
            <section class="load-container blur-in">
                <div class="ring"></div>
                <div class="ring"></div>
                <div class="ring"></div>
                <p>Loading...</p>
            </section>
        `;
        cards.innerHTML = dinvLoadContainer;//Se le inserta el contenido al elemnto "main"
    }

    const _addEventsToCards = () => {
        const cardsContainer = document.querySelector("[data-cards]");//Accede al elemento "main"
        if (cardsContainer.hasChildNodes()) {//Verifica si tiene nodos hijos
            const children = cardsContainer.childNodes;//Almacena el arreglo de nodos hijos
            //Recorre el arreglo de nodos
            for (let i = 0; i < children.length; i++) {     
                //Le asigna el evento click a cada uno de los nodos
                children[i].addEventListener("click", () => {     
                    //Accede a las coincidencias que cumplan con las condiciones que tengan las clases ".card .poke-name"
                    //(el cual es solo 1 por card), y se recorre con un forEach porque solo así lo permitió trabajar ¿?           
                    children[i].querySelectorAll(".card .poke-name").forEach((p) => {
                        _createModal(p.textContent.toLowerCase());//LLama a la función que crea el moda, la cual
                        //recibe como parámetro el nombre del pokémon a mostrar en el modal
                    })
                })
            }
        }
    }

    const _createModal = async(id) => {
        const modalSection = document.querySelector("[data-modal]");//Accede al elemento que contiene el modal
        const data = await _fetchPokemon(id);//Extrae los datos del pokémon especificado (realmente recibe el nombre, no el id)
        //Se le asignan los valores a cada "atributo" de el objeto Pokémon
        const pokemon = Pokemon(
            data.id,
            data.name,
            data.types,
            data.stats,
            data.sprites,
            data.species,
            data.moves,
            data.height,
            data.weight,
            data.abilities,
            data.base_experience
        );

        let cardModal = '';//Contiene toda la estructura del modal
        //Le asigna la estructura del modal incluyendo los valores de cada propiedad a mostrar
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
                    <a href="#" data-moves>Moves</a>
                    <div class="animation start-home"></div>
                </div>
                <div class="information" data-modalInfo>
                    
                </div>
            </div>
            <a class="modal_close" data-modalClose>CLOSE</a>
        </article>
        `;
        modalSection.innerHTML = cardModal;//Se le inserta el contenido al elemnto "modalSection"
        modalSection.classList.add("modal--show");//Le agrega la clase "modal--show", la cual le permite mostrarlo a través del css

        const divTypes = document.querySelector(`[data-modalTypes-${pokemon.id}]`);//Accede al div que contiene los "elementos" del pokémon
        const cardTheme = document.querySelector(`[data-modalCard-${pokemon.id}]`);//Accede a el div que contiene la card completa
        _appednTypes(pokemon.types, divTypes);//Hace el llamado a la función que agregará cada uno de los tipos a la card, recibe como parámetros el 
        //nodo al cual se agregarán los elementos y también el vector con los tipos
        const themeColor = typeColor[pokemon.types[0].type.name];//Busca dentro de la paleta de colores el color con la clave (nombre) del pokémon
        _styleCard(themeColor, cardTheme, divTypes);//LLama a la función que le dará los estilos según los "elementos" que contenga el pokémon
        //recibe como parámetros el color, la card a la cual se le asignará el color y el div que contiene los tipos 
        //para asignarles el diseño correspondiente

        loadInformation(pokemon, "about");//Hace el llamado a la función que carga la información hacerca del pokémon
        const btnAbout = document.querySelector("[data-about]");//Accede al botón que lleva al apartado de "about"
        const btnStats = document.querySelector("[data-stats]");//Accede al botón que lleva al apartado de "stats"
        const btnMoves = document.querySelector("[data-moves]");//Accede al botón que lleva al apartado de "moves"

        const animation = document.querySelector(".animation");//Accede al div que permite hacer la animación
        animation.style.left = "0";//Le asigna la posición desde dónde debe partir el div de animación
        animation.style.background = "#1abc9c";//Le asigna el color que debe contener el div
        animation.style.width = "150px";//Le asigna el ancho que debe tener el div

        btnAbout.addEventListener("click", (e) => {
            e.preventDefault();
            animation.style.left = "0";//Le asigna la posición desde dónde debe partir el div de animación
            animation.style.background = "#1abc9c";//Le asigna el color que debe contener el div
            animation.style.width = "150px";//Le asigna el ancho que debe tener el div
            loadInformation(pokemon, "about");//Llama a la función que carga los datos que corresponden al apartado
        })

        btnStats.addEventListener("click", (e) => {
            e.preventDefault();
            animation.style.left = "150px";//Le asigna la posición desde dónde debe partir el div de animación
            animation.style.background = "#e74c3c";//Le asigna el color que debe contener el div
            animation.style.width = "110px";//Le asigna el ancho que debe tener el div
            loadInformation(pokemon, "stats");//Llama a la función que carga los datos que corresponden al apartado
        })

        btnMoves.addEventListener("click", (e) => {
            e.preventDefault();
            animation.style.left = "260px";//Le asigna la posición desde dónde debe partir el div de animación
            animation.style.background = "#9b59b6";//Le asigna el color que debe contener el div
            animation.style.width = "150px";//Le asigna el ancho que debe tener el div
            loadInformation(pokemon, "moves");//Llama a la función que carga los datos que corresponden al apartado         
        })

        const btnCloseModal = document.querySelector("[data-modalClose]");//Accede al botón para cerrar el modal

        btnCloseModal.addEventListener("click", () => {
            //Cuando se le da click al botón se ejecuta lo siguiente...
            modalSection.classList.remove("modal--show");//Le elimina la clase "modal--show" para ocultarlo
            modalSection.removeChild(cardTheme);//Remueve la tarjeta "modal" del contenedor
        })
    }

    const _paintTypesButtons = () => {
        const containerButtonsType = document.querySelector(".buttons-types");//Accede al contenedor de los botones de filtrado
        if ( containerButtonsType.hasChildNodes() )//Verifica si contiene nodos hijos
        {
            const children = containerButtonsType.childNodes;//Almacena el arreglo de nodos

            for (let i = 0; i < children.length; i++) {//Recorre cada uno de los nodos
                //Verifica que el residuo de la posición del elemento dividido 2 sea diferente de 0,
                //ya una posición de por medio el arreglo contiene el valor de "#Text" y no un nodo tipo "Button" como tal
                if ((i % 2) !== 0) {
                    //Asigna el color de fondo que retorna la paleta de colores según su clave (tipo de pokémon)
                    children[i].style.background = typeColor[children[i].textContent.toLowerCase()];                  
                }
                
            }
        }

    }

    const loadInformation = async (pokemon, typeInfo) => {
        //Recibe el pokémon que contiene todos lo datos a utilizar
        //también recibe el titpo de información que se desea mostrar (depende del botón al que se le haya dado clik)
        const divInformation = document.querySelector("[data-modalInfo]");//Accede al apartado que muestra la información del pokémon en el modal
        divInformation.classList.add("blur-in");//le asigna la clase que permite hacer el efecto blur
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
                        <div class="bar"><div style="width: ${(pokemon.stats[0].base_stat)/200 * 100}%" class="hp-value">${pokemon.stats[0].base_stat}%</div></div>
                        <div class="bar"><div style="width: ${(pokemon.stats[1].base_stat)/200 * 100}%" class="hp-value">${pokemon.stats[1].base_stat}%</div></div>
                        <div class="bar"><div style="width: ${(pokemon.stats[2].base_stat)/200 * 100}%" class="hp-value">${pokemon.stats[2].base_stat}%</div></div>
                        <div class="bar"><div style="width: ${(pokemon.stats[3].base_stat)/200 * 100}%" class="hp-value">${pokemon.stats[3].base_stat}%</div></div>
                        <div class="bar"><div style="width: ${(pokemon.stats[4].base_stat)/200 * 100}%" class="hp-value">${pokemon.stats[4].base_stat}%</div></div>
                        <div class="bar"><div style="width: ${(pokemon.stats[5].base_stat)/200 * 100}%" class="hp-value">${pokemon.stats[5].base_stat}%</div></div>
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
                    pMove.textContent = pokemon.moves[i].move.name;//Le asigna el nombre del movimiento
                    movesInfo.appendChild(pMove);//Agrega el elemento "p" al contenedor
                } else {
                    break;//Cuando llegue a los 20 movimientos (porque algunos pokémons tienen más), saldrá del bucle
                    //para no mostrar tantos
                }
            }
        }
    }

    const _showPokemonsLeaked = async (type) => {
        _removeAllCards();//Elimina el contenido del "main"
        const cards = document.querySelector("[data-cards]");//Accede al elemento "main"
        if (type !== "null") {//Verifica si el "type" es diferente de "null", si es así, significa que se desea mostrar solo un tipo 
                              //específico de pokémons
            for (let i = 1; i <= _amount; i++) {//Se ejecuta un ciclo for hasta la cantidad de pokémons a mostrar (buscar en este caso)                
                const data = await _fetchPokemon(i);//Envía el "id", la cuál será la variable iterador
                data.types.forEach(item => {//Recorre los tipos que contiene el pokémon retornado
                    //--- SE JECUTA CADA VEZ QUE SE ENCUENTRE UN POKEMON CON EL TIPO INDICADO
                    if (item.type.name === type) {//Si hay una coincidencia, entonces...
                        const cardContainer = document.createElement('article');//Crea un elemento "article" el cual contiene la card
                        cardContainer.classList.add("card-container");//Agrega la clase "card'container" para poder asignarle una animación
                        _drawPokemonCard(i, cardContainer);//Llama a la función que crea la card y se le indica cuál pokémon se desea ver
                        cards.appendChild(cardContainer);//Se agrega el contenedor de la card al "main"
                        
                    }
                });
            }
            _addEventsToCards();//Le asigna los eventos de "click" a cada card creada
        }
    }

    const _pokemonsShow = async (name) => {
        //Recibe el nombre del pokémon a buscar (si esque se desea buscar uno en específico)
        //sino se desea buscar un pokémon en específico, el parámetro main debe contener "null"
        _removeAllCards();//Remueve el contenido del "main"
        const cards = document.querySelector("[data-cards]");//Accede al contenedor de las cards
        if (name !== "null") {//Verifica si "name" es diferente de null, lo cual significa que se desea buscar un pokémon por su nombre
            const data = await _fetchPokemon(name);//Almacena la información del pokémon buscado
            if (data !== null) {//Verifica si la data extraida es diferente de "null", lo cual significa
                                //que sí se ha encontrado el pokémon
                const cardContainer = document.createElement('article');//Crea un elemento "article" el cual contiene la card
                cardContainer.classList.add("card-container");//Agrega la clase "card'container" para poder asignarle una animación
                _drawPokemonCard(name, cardContainer);//Llama a la función que crea la card y se le indica cuál pokémon se desea ver
                cards.appendChild(cardContainer);//Se agrega el contenedor de la card al "main"
                _addEventsToCards();//
            }
        } else {
            for (let i = 1; i <= _amount; i++) {
                const cardContainer = document.createElement('article');
                cardContainer.classList.add("card-container");
                _drawPokemonCard(i, cardContainer);
                cards.appendChild(cardContainer);
            }
            _addEventsToCards();//Le asigna los eventos de "click" a cada card creada
        }
    }

    const _drawPokemonCard = async(_id, _cardContainer) => {
        //Recibe el id o nombre del pokémon que se desea mostrar
        //además recibe el contenedor en donde se creará la card
        const data = await _fetchPokemon(_id);//Almacena los datos del pokémon buscado
        if (data !== null) {
            //Almacena los datos del pokémon en el objeto
            const pokemon = Pokemon(
                data.id,
                data.name,
                data.types,
                data.stats,
                data.sprites,
                data.species,
                data.moves,
                data.height,
                data.weight,
                data.abilities,
                data.base_experience
            );
    
            let card = '';//Contendrá la estructura de la card
            //Asigna los datos correspondientes de la card
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
            _cardContainer.innerHTML = card;//Inserta la estructura en el contenedor
            const divTypes = document.querySelector(`[data-type-${pokemon.id}]`);//Accede al div que contendrá los tipos del pokémon
            const cardTheme = document.querySelector(`[data-card-${pokemon.id}]`);//Accede a la card creada
            _appednTypes(pokemon.types, divTypes);//Hace el llamado a la función que agregará cada uno de los tipos a la card, recibe como parámetros el 
            //nodo al cual se agregarán los elementos y también el vector con los tipos
            const themeColor = typeColor[pokemon.types[0].type.name];//Busca dentro de la paleta de colores el color con la clave (nombre) del pokémon
            _styleCard(themeColor, cardTheme, divTypes);//LLama a la función que le dará los estilos según los "elementos" que contenga el pokémon
            //recibe como parámetros el color, la card a la cual se le asignará el color y el div que contiene los tipos 
            //para asignarles el diseño correspondiente
        }
    }

    const _appednTypes = (types, divTypes) => {
        //Recibe el vector que contiene el o los tipos del pokémon
        //además, recibe el div en donde se crearán los span
        types.forEach(item => {//Recorre el vector de tipos
            const span = document.createElement("span");//Crea un elemento span
            span.textContent = item.type.name;//Le asigna el "tipo" al texto del span
            divTypes.appendChild(span);//Agrega el nodo al div contenedor
        });
    }

    const _styleCard = (themeColor, cardTheme, divTypes) => {
        //Recibe como parámetros el color, la card a la cual se le asignará el color y
        //el div que contiene los tipos para darle estilo

        //Le asigna un radial-gradient con el color que se recibe como parámetros (un circulo en la parte superior)
        cardTheme.style.background = `radial-gradient(
            circle at 50% 0%, ${themeColor} 36%, #ffffff 36%
        )`;
        
        const children = divTypes.childNodes;//Almacena los hijos que contiene el divTypes (cada uno de los span creados en "_appednTypes")

        for (let i = 1; i < children.length; i++) {//Recorre los nodos y se les asigna la propiedad de color de fondo
                                                    //segun el color que retorne su tipo
            children[i].style.background = typeColor[children[i].textContent];           
        }
    }

    const _fetchPokemon = async(id) => {
        //Recibe el id o nombre del pokemon a buscar
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);//Hace la petición
            if (!response.ok) {//verifica si la promesa NO fue resuelta
                throw new Error("Error 404");//En caso de no haberse recuelto, genera un error
            }
            return response.json();//Si se la promesa fue resuelta, retorna la respuesta como un archivo JSON
        } catch {
            return null;//Si ocurre alfún error, retorna null
        }
    }

    return {
        showPokedex//Permite que se acceda a la función desde afuera de la estructura del patrón módulo
    }
})();

Pokedex.showPokedex("null");//Ejecuta la función y envía como parámetros "null", para indicar que se desea
//mostrar toda la Pokédex

