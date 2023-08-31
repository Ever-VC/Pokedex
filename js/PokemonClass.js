//Exporta la función de tipo contructor, haciendo uso del patrón funcional
export const Pokemon = function(id, name, types, stats, sprites, species, moves, height, weight, abilities, experience) {
    //Recibe como parámetro las "propiedades", las cuales a su vez son retornadas
    return { id, name, types, stats, sprites, species, moves, height, weight, abilities, experience }
}
