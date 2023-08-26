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

const url = "https://pokeapi.co/api/v2/pokemon/ditto";
const card = document.querySelector("[data-card]");