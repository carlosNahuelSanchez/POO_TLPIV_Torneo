import { preguntar, preguntarNumero, cerrarInput } from "./Utils/Inputs.js";

import EquipoFutbol from "./Modelos/EquipoFutbol.js";
import EquipoBasket from "./Modelos/EquipoBasket.js";
import PartidoFutbol from "./Modelos/PartidoFútbol.js";
import PartidoBasket from "./Modelos/PartidoBasket.js";
import TorneoFutbol from "./Modelos/TorneoFútbol.js";
import TorneoBasket from "./Modelos/TorneoBasket.js";

async function ejecutarTorneo() {
    console.log("=== Bienvenido al sistema de Torneo CLI ===");

    let nombreTorneo;
    do { nombreTorneo = await preguntar("Ingrese el nombre del torneo: "); } while (!nombreTorneo.trim());

    let tipoTorneo;
    do {
    const opcion = (await preguntar("Ingrese el tipo de torneo (1: Futbol / 2: Basket): ")).trim();

    if (opcion === "1") {
        tipoTorneo = "futbol";
    } else if (opcion === "2") {
        tipoTorneo = "basket";
    } else {
        console.log(" Opción inválida. Intente de nuevo.");
    }

} while (tipoTorneo !== "futbol" && tipoTorneo !== "basket");
    const cantEquipos = await preguntarNumero("Ingrese la cantidad de equipos: ");

    let torneo = tipoTorneo === 'futbol'
        ? new TorneoFutbol(nombreTorneo)
        : new TorneoBasket(nombreTorneo);

 
    for (let i = 0; i < cantEquipos; i++) {
        let nombre;
        do { nombre = await preguntar(`Nombre del equipo ${i + 1}: `); } while (!nombre.trim());

        const eq = tipoTorneo === 'futbol'
            ? new EquipoFutbol(nombre)
            : new EquipoBasket(nombre);

        torneo.agregarEquipo(eq);
    }

    const equiposTorneo = torneo.equipos;
    console.log("\n--- Ingrese resultados de cada partido ---");

    for (let i = 0; i < equiposTorneo.length; i++) {
        for (let j = i + 1; j < equiposTorneo.length; j++) {
            console.log(`\nPartido: ${equiposTorneo[i].nombre} vs ${equiposTorneo[j].nombre}`);
            const palabra = tipoTorneo === 'futbol' ? 'Goles' : 'Puntos';
            let puntos1, puntos2;
            do {
                puntos1 = await preguntarNumero(`${palabra} de ${equiposTorneo[i].nombre}: `);
                puntos2 = await preguntarNumero(`${palabra} de ${equiposTorneo[j].nombre}: `);
                if (tipoTorneo === 'basket' && puntos1 === puntos2) {
                    console.log("En basket no puede haber empate. Ingrese nuevamente.");
                }
            } while (tipoTorneo === 'basket' && puntos1 === puntos2);

            const partido = tipoTorneo === 'futbol'
                ? new PartidoFutbol(equiposTorneo[i], equiposTorneo[j], puntos1, puntos2)
                : new PartidoBasket(equiposTorneo[i], equiposTorneo[j], puntos1, puntos2);

            torneo.agregarPartido(partido);
        }
    }

    torneo.calcularPuntos();
    console.log("\n=== Tabla de posiciones ===");
    torneo.mostrarPosiciones();

    cerrarInput();
}

ejecutarTorneo();
