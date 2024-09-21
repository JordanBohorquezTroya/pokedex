const listaPokemon = document.querySelector('#listaPokemon');
const botonheader = document.querySelectorAll('.btn-header');
let url = 'https://pokeapi.co/api/v2/pokemon/';
let paginaActual = 1;
const pokemonPorPagina = 20;

function cargarPokemon(pagina) {
    listaPokemon.innerHTML = ''; // Limpiar la lista

    const inicio = (pagina - 1) * pokemonPorPagina + 1;
    const fin = inicio + pokemonPorPagina - 1;

    for (let i = inicio; i <= fin && i <= 151; i++) {
        fetch(url + i)
            .then((response) => response.json())
            .then((data) => mostrarPokemon(data))
    }
}

function mostrarPokemon(pokemon) {
    let tipo = pokemon.types.map((type) => `<p class= "${type.type.name} tipo">${type.type.name}</p>`);
    tipo = tipo.join('');

    let pokeid = pokemon.id.toString();
    if (pokeid.length === 1) {
        pokeid = '00' + pokeid;
    } else if (pokeid.length === 2) {
        pokeid = '0' + pokeid;
    }
    
    const divPokemon = document.createElement('div');
   
    divPokemon.innerHTML = `
            <div class="pokemon">
                <p class="pokemon-id-back">#${pokeid}</p>
                <div class="pokemon-imagen">
                    <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">
                </div>
                <div class="pokemon-info">
                    <div class="nombre-contenedor">
                        <p class="pokemon-id">#${pokeid}</p>
                        <h2 class="pokemon-nombre">${pokemon.name}</h2>
                    </div>
                    <div class="pokemon-tipos">
                        ${tipo}	
                    </div>
                    <div class="pokemon-stats">
                        <p class="stat">${pokemon.height}m</p>
                        <p class="stat">${pokemon.weight}kg</p>
                    </div>
                </div>
            </div> `;
            listaPokemon.appendChild(divPokemon);

}


botonheader.forEach(boton => boton.addEventListener('click', (event)=>{
    const id = event.currentTarget.id;
    listaPokemon.innerHTML = '';
    for (let i = 0; i <= 151; i++) {
        fetch(url + i)
            .then((response) => response.json())
            .then((data) => {

                if(boton.id === 'verTodos'){
                    mostrarPokemon(data);
                }else{
                    const tipo = data.types.map(type => type.type.name);
                    if (tipo.some(type => type.includes(id))) {
                        mostrarPokemon(data);
                    }
                }
            })
    }


}));
// botones de navegacion

function cambiarPagina(direccion) {
    if (direccion === 'derecha') {
        paginaActual++;
        if (paginaActual > Math.ceil(151 / pokemonPorPagina)) {
            paginaActual = 1; // Volver a la primera página si se llega al final
        }
    } else {
        paginaActual--;
        if (paginaActual < 1) {
            paginaActual = Math.ceil(151 / pokemonPorPagina); // Ir a la última página si se va demasiado atrás
        }
    }
    cargarPokemon(paginaActual);
}

// Evento para los botones de navegación derecha e izquierda
document.getElementById('derecha').addEventListener('click', () => cambiarPagina('derecha'));
document.getElementById('izquierda').addEventListener('click', () => cambiarPagina('izquierda'));

cargarPokemon(paginaActual);