// Definimos las variables
const lineaDeMeta = $("#pista").width();
let coches = [];
let posicionTablon = 1;

/****************
 *
 * EVENTOS
 *
 * **************/

// Añadimos un evento de clic al botón iniciar
$("#btnIniciar").click(function () {
  // Manejamos eventuales errores
  try {
    iniciarCarrera();
    // Escondemos el botón iniciar y monstramos los demás
    esconderBtns({ self: this, ids: ["#btnReiniciar"] });
    toggleSeleccion();
  } catch (err) {
    // mostramos el error
    toggleError(err);
  }
});

// Añadimos un evento de clic al botón reiniciar
$("#btnReiniciar").click(function () {
  // Escondemos el botón reiniciar y monstramos los demás
  esconderBtns({ self: this, ids: ["#btnIniciar"] });
  reiniciar();
});

// Añadimos un evento de cambio al selector de participantes
$("#numCoches").change(function () {
  const nCoches = parseInt($(this).val());
  // Creamos una lista de coches y los pintamos en la pista
  const coches = crearListaCoches(nCoches);
  pintarCoches(coches);
});

// Evento que nos lleva a la pista quitando el Header de intro
$("#carrera").click(function () {
  $("#introHeader").addClass("header--hidden");
});

// Evento para cerrar el div que muestra el resultado
$("#cerrarTablon").click(function () {
  toggleTablon();
});

/* Al cargar el documento */

// Cuando el documento termina de cargar, pinta el primer coche segun el selector
// por defecto
$(document).ready(function () {
  const nCoches = parseInt($("#numCoches").val());
  coches = crearListaCoches(nCoches);
  pintarCoches(coches);
});

/****************
 *
 * FUNCIONES
 *
 * **************/

function crearListaCoches(nCoches) {
  /* Creamos un nuevo Array cuya dimension, lo rellenamos de null,
  iteramos cada elemento y creamos una etiqueta "img" para crear los coches.
  El metodo map devuelve un nuevo array usando la función 
  de callback para modificar cada elemento.
  */
  coches = new Array(nCoches).fill(null).map((_, idx) => {
    let imgTag = `<img class="coche" src="/assets/img/car${
      idx + 1
    }.png" alt="Coche participante numero ${idx + 1}" data-nombre="coche ${
      idx + 1
    }" />`;
    return imgTag;
  });
  /* devolvemos el nuevo array modificado que incluye las etiquetas img
     de los coches */
  return coches;
}

// Pintamos los coches en la pista
function pintarCoches(coches) {
  $("#pista").html(coches.join(""));
}

// Permite esconder/mostrar los botones
function esconderBtns({ self, ids }) {
  $(self).toggle();
  ids.forEach((element) => {
    $(element).toggle();
  });
}

// Función para iniciar la carrera
function iniciarCarrera() {
  // Si hay solamente 1 coche, lanzará un error que se mostrará en pantalla
  if (coches.length < 2) {
    throw new Error("Minimo 2 coches");
  }
  // Seleccionamos cada elemento coche del DOM.
  $(".coche")
    .toArray() // Transformamos a Array y lo recorremos con un forEach
    .forEach((coche) => {
      moverCoche(coche); // Aquí cada coche empieza a moverse
    });
}

function moverCoche(coche) {
  // Calculamos el desplazamiento
  const desplazamiento = Math.floor(Math.random() * 11) + 1;
  // Animamos el coche. El primer parametros son los cambios
  // El segundo parametro son las opciones
  $(coche).animate(
    {
      marginLeft: `+=${desplazamiento}px`,
    },
    {
      duration: 10,
      ease: "linear",
      // Esta función se llama cuando la animación será terminada
      // Si el coche aun no ha llegado a la linea de meta, vuelve a llamar
      // la misma funcion. Estamos aplicando recursividad.
      // Si ya el coche ha llegado a la linea de meta, añadimos el coche al tablón
      done: function () {
        if (parseInt($(coche).css("margin-left")) < lineaDeMeta - 100) {
          moverCoche(coche);
        } else {
          aniadirAlTablon(coche);
          if (posicionTablon === coches.length + 1) {
            toggleTablon();
          }
        }
      },
    }
  );
}

// Función para reiniciar la carrera.
function reiniciar() {
  // Movemos los coches reseateando el margen izquierdo
  $(".coche")
    .toArray()
    .forEach((coche) => {
      $(coche).stop();
      $(coche).css("margin-left", 0);
    });
  // Vaciamos el array de coches
  coches = [];
  // Impostamos la primera posición del tablón
  posicionTablon = 1;
  // Cambiamos el valor del select a 1
  $("#numCoches").val(1).change();
  // Reactivamos el select
  toggleSeleccion();
  // Vaciamos el tablón
  vaciarTablon();
  // Si el tablón es visible, lo cerramos
  if ($(".resultados").hasClass("visible")) toggleTablon();
}

// Esta función se encarga de abilitar/desabilitar el selector de participantes
function toggleSeleccion() {
  // le damos al atributo disabled el valor contrario a lo que tenía antes.
  // con attr() modificamos el atributo, con prop() obtenemos el valor anterior
  // a un cambio de estado del DOM.
  $("#numCoches").attr("disabled", !$("#numCoches").prop("disabled"));
}

// Función para añadir cada coche al tablón cuando llega a la linea de meta.
function aniadirAlTablon(coche) {
  const nombre = $(coche).data("nombre"); // Obtenemos el nombre del atributo en data
  //Creamos la etiqueta tr para la tabla
  let etiquetaLinea = `
    <tr class="lineaTabla">
      <td>${posicionTablon++}</td>
      <td>${nombre}</td>
    </tr>
  `;
  $("#tablaResultadoBody").append(etiquetaLinea); // La añadimos a la tabla
}

function vaciarTablon() {
  $("#tablaResultadoBody").html("");
}

function toggleTablon() {
  $(".resultados").toggleClass("visible");
}

// Función para mostrar/esconder el mensaje de error
function toggleError(err = "") {
  $(".errorBox").text(err).addClass("errorBox--visible");
  setTimeout(() => {
    $(".errorBox").text("").removeClass("errorBox--visible");
  }, 3000);
}
