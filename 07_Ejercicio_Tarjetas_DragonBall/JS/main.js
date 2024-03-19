//SELECTORES
const contenedorPersonajes = document.querySelector('#personajes-container');
const modalPersonajes = document.querySelector('#modal-container');


//Variables
const registrosPagina = 10;
let totalPaginas;
let iterador;
let paginaActual = 1;
document.addEventListener('DOMContentLoaded',()=>{
    cargarPersonajes();
})

function cargarPersonajes(){
    fetch(`https://dragonball-api.com/api/characters?page=${paginaActual}&limit=${registrosPagina}`)
        .then(resultado => resultado.json())
        .then(respuesta => {
            totalPaginas = calcularPaginas(respuesta.meta['totalItems']);
            mostrarHTMLPersonajes(respuesta.items)
        });
}

function mostrarHTMLPersonajes(personajes){
    
    limpiarHTMLPersonajes();

    //Iterar sobre cada personaje

    personajes.forEach( personaje => {
        const {name,image,ki,race} = personaje;

        //Crear scriptin

        //Imagen
        const contenedorPersonaje = document.createElement('div');
        contenedorPersonaje.classList.add('card-container');

        //Abrir modal informacion
        contenedorPersonaje.onclick = function() {mostrarModal(personaje)};

        const contenedorImagen = document.createElement('div');
        contenedorImagen.classList.add('image-container');
        
        const imagenHTML = document.createElement('img');
        imagenHTML.src = `${image}`;

        //Informacion
        const informacionPersonaje = document.createElement('div');
        informacionPersonaje.classList.add('informacion-personaje');

        const nombre = document.createElement('h2');
        nombre.textContent = name;

        const parrafoKi = document.createElement('p');
        parrafoKi.textContent = "Ki: ";
        const kiHTML = document.createElement('span');
        kiHTML.textContent = ki;

        const parrafoRaza = document.createElement('p');
        parrafoRaza.textContent = "Raza: ";
        const razaHTML = document.createElement('span');
        razaHTML.textContent = race;

        parrafoKi.appendChild(kiHTML);
        parrafoRaza.appendChild(razaHTML);

        informacionPersonaje.appendChild(nombre);
        informacionPersonaje.appendChild(parrafoKi);
        informacionPersonaje.appendChild(parrafoRaza);

        contenedorImagen.appendChild(imagenHTML);

        contenedorPersonaje.appendChild(contenedorImagen);
        contenedorPersonaje.appendChild(informacionPersonaje);

        contenedorPersonajes.appendChild(contenedorPersonaje);
    })


    //Paginador
    //Limpiar paginador
    const paginador = document.querySelector('#paginacion');
    while(paginador.firstChild){
        paginador.removeChild(paginador.firstChild);
    }

    imprimirPaginador();
}

function limpiarHTMLPersonajes(){

    while(contenedorPersonajes.firstChild){
        contenedorPersonajes.removeChild(contenedorPersonajes.firstChild)
    }

}

function mostrarModal(personaje){
    //Borrar modales abiertos
    borrarHTMLModal();

    const {name,description,image} = personaje;

    const modalContainer = document.createElement('div');
    modalContainer.classList.add('descripcion-personaje');
    
    const btnCerrar = document.createElement('button');
    btnCerrar.classList.add('cerrar');
    btnCerrar.innerHTML = '<i class="fa-solid fa-xmark" style="color: black;"></i>';
    btnCerrar.onclick = function (){
        borrarHTMLModal();
    }

    const contenedorDescripcion = document.createElement('div');
    contenedorDescripcion.classList.add('contenedor-personaje');

    const contenedorImagen = document.createElement('div');
    contenedorImagen.classList.add('contenedor-imagen-modal');
    contenedorImagen.innerHTML = `
        <img src="${image}" alt="Imagen Personaje">
    `;

    const contenedorInformacion = document.createElement('div');
    contenedorInformacion.classList.add('contenedor-informacion-modal');
    contenedorInformacion.innerHTML = `
    
        <h2>${name}</h2>
        <p>Descripcion: <br><span>${description}</span></p>

    `;

    //Botones
    const btnContenedor = document.createElement('div');
    btnContenedor.classList.add('contenedor-botones-modal');

    const btnFavoritos = document.createElement('button');
    btnFavoritos.classList.add('btnFavoritos');
    btnFavoritos.textContent = "Guardar Favoritos";
    
    const btnCerrarModal = document.createElement('button');
    btnCerrarModal.classList.add('btnCerrar');
    btnCerrarModal.textContent = "Cerrar";

    //Cerrar modal
    btnCerrarModal.onclick = function(){
        borrarHTMLModal();
    }

    btnContenedor.appendChild(btnFavoritos);
    btnContenedor.appendChild(btnCerrarModal);

    //Agregar elementos al contenedor Modal
    contenedorDescripcion.appendChild(contenedorImagen);
    contenedorDescripcion.appendChild(contenedorInformacion);

    modalContainer.appendChild(btnCerrar);
    modalContainer.appendChild(contenedorDescripcion);
    modalContainer.appendChild(btnContenedor);

    //Agregar contenedor modal a Seccion
    modalPersonajes.appendChild(modalContainer);

}

function borrarHTMLModal(){
    const contenedorModal = document.querySelector('#modal-container');

    while(contenedorModal.firstChild){
        contenedorModal.removeChild(contenedorModal.firstChild)
    }
}


//PAGINACION

function calcularPaginas (total){
    return parseInt(Math.ceil(total/registrosPagina))
}

function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas);

    while(true){
        const {value,done} = iterador.next();

        if(done) return;

        //Generamos botones del paginador
        const boton = document.createElement('a');
        boton.href = "#";
        boton.datasetContent = value;
        boton.textContent = value;

        boton.onclick = ()=>{
            paginaActual = value;
            cargarPersonajes();
        }
        
        const paginador = document.querySelector("#paginacion");
        paginador.appendChild(boton);
    }
}

function *crearPaginador(total){
    for(let i=1; i<=total; i++){
        yield i;
    }
}