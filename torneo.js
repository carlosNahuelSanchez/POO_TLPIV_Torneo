const readline = require('readline');

class Equipo {
    #puntos = 0;
    #victorias = 0;
    #derrotas = 0;
    #empates = 0;

    constructor(nombre) {
        this.nombre = nombre;
    }

    get puntos() { return this.#puntos; }
    get victorias() { return this.#victorias; }
    get derrotas() { return this.#derrotas; }
    get empates() { return this.#empates; }

    actualizarPuntos(resultado, puntosPorVictoria = 3) {
        if (resultado === 'victoria') {
            this.#victorias += 1;
            this.#puntos += puntosPorVictoria;
        } else if (resultado === 'empate') {
            this.#empates += 1;
            this.#puntos += 1;
        } else if (resultado === 'derrota') {
            this.#derrotas += 1;
        }
    }
}

class Partido {
    #puntosEquipo1;
    #puntosEquipo2;

    constructor(equipo1, equipo2, puntosEquipo1, puntosEquipo2) {
        this.equipo1 = equipo1;
        this.equipo2 = equipo2;
        this.#puntosEquipo1 = puntosEquipo1;
        this.#puntosEquipo2 = puntosEquipo2;
    }

    get puntosEquipo1() { return this.#puntosEquipo1; }
    get puntosEquipo2() { return this.#puntosEquipo2; }

}

class Torneo {
    #equipos = [];
    #partidos = [];

    constructor(nombre) {
        this.nombre = nombre;
    }

    agregarEquipo(equipo) { this.#equipos.push(equipo); }
    agregarPartido(partido) { this.#partidos.push(partido); }

    get equipos() { return [...this.#equipos]; }
    get partidos() { return [...this.#partidos]; }

    calcularPuntos() {
    }

    posicionarEquipos() {
        this.#equipos.sort((a, b) => b.puntos - a.puntos);
    }

    mostrarPosiciones() {
        this.posicionarEquipos();
        this.#equipos.forEach((eq, idx) => {
            console.log(`${idx + 1}. ${eq.nombre} - Puntos: ${eq.puntos}`);
        });
    }
}

class TorneoFutbol extends Torneo {
    calcularPuntos() {
        this.partidos.forEach(partido => {
            const equipo1 = partido.equipo1;
            const equipo2 = partido.equipo2;

            if (equipo1.golesAFavor === undefined) equipo1.golesAFavor = 0;
            if (equipo1.golesEnContra === undefined) equipo1.golesEnContra = 0;
            if (equipo2.golesAFavor === undefined) equipo2.golesAFavor = 0;
            if (equipo2.golesEnContra === undefined) equipo2.golesEnContra = 0;

            equipo1.golesAFavor += partido.puntosEquipo1;
            equipo1.golesEnContra += partido.puntosEquipo2;
            equipo2.golesAFavor += partido.puntosEquipo2;
            equipo2.golesEnContra += partido.puntosEquipo1;

            if (partido.puntosEquipo1 > partido.puntosEquipo2) {
                equipo1.actualizarPuntos('victoria', 3);
                equipo2.actualizarPuntos('derrota', 3);
            } else if (partido.puntosEquipo2 > partido.puntosEquipo1) {
                equipo2.actualizarPuntos('victoria', 3);
                equipo1.actualizarPuntos('derrota', 3);
            } else {
                equipo1.actualizarPuntos('empate', 3);
                equipo2.actualizarPuntos('empate', 3);
            }
        });
    }
}

class TorneoBasket extends Torneo {
    calcularPuntos() {
        this.partidos.forEach(partido => {
            const equipo1 = partido.equipo1;
            const equipo2 = partido.equipo2;

            if (equipo1.canastasAFavor === undefined) equipo1.canastasAFavor = 0;
            if (equipo1.canastasEnContra === undefined) equipo1.canastasEnContra = 0;
            if (equipo2.canastasAFavor === undefined) equipo2.canastasAFavor = 0;
            if (equipo2.canastasEnContra === undefined) equipo2.canastasEnContra = 0;

            equipo1.canastasAFavor += partido.puntosEquipo1;
            equipo1.canastasEnContra += partido.puntosEquipo2;
            equipo2.canastasAFavor += partido.puntosEquipo2;
            equipo2.canastasEnContra += partido.puntosEquipo1;

            if (partido.puntosEquipo1 > partido.puntosEquipo2) {
                equipo1.actualizarPuntos('victoria', 2);
                equipo2.actualizarPuntos('derrota', 2);
            } else if (partido.puntosEquipo2 > partido.puntosEquipo1) {
                equipo2.actualizarPuntos('victoria', 2);
                equipo1.actualizarPuntos('derrota', 2);
            } else {
                equipo1.actualizarPuntos('empate', 2);
                equipo2.actualizarPuntos('empate', 2);
            }
        });
    }
}


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function preguntar(pregunta) {
    return new Promise(resolve => rl.question(pregunta, respuesta => resolve(respuesta)));
}

async function preguntarNumero(pregunta) {
    let num;
    do {
        const input = await preguntar(pregunta);
        num = parseInt(input);
    } while (isNaN(num) || num < 0);
    return num;
}

async function ejecutarTorneo() {
    console.log("=== Bienvenido al sistema de Torneo CLI ===");

    // Nombre del torneo
    let nombreTorneo;
    do { nombreTorneo = await preguntar("Ingrese el nombre del torneo: "); } while (!nombreTorneo.trim());

    // Tipo de torneo
    let tipoTorneo;
    do {
        tipoTorneo = (await preguntar("Ingrese el tipo de torneo (futbol/basket): ")).trim().toLowerCase();
    } while (tipoTorneo !== 'futbol' && tipoTorneo !== 'basket');

    // Cantidad de equipos
    const cantEquipos = await preguntarNumero("Ingrese la cantidad de equipos: ");

    // Crear torneo según tipo
    let torneo = tipoTorneo === 'futbol'
        ? new TorneoFutbol(nombreTorneo)
        : new TorneoBasket(nombreTorneo);

    // Cargar equipos
    for (let i = 0; i < cantEquipos; i++) {
        let nombre;
        do { nombre = await preguntar(`Nombre del equipo ${i + 1}: `); } while (!nombre.trim());
        const eq = new Equipo(nombre);

        if (tipoTorneo === 'futbol') {
            eq.golesAFavor = 0;
            eq.golesEnContra = 0;
        } else {
            eq.canastasAFavor = 0;
            eq.canastasEnContra = 0;
        }

        torneo.agregarEquipo(eq);
    }

    // Cargar partidos "todos contra todos"
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
                    console.log("En basket no puede haber empate. Ingrese los puntos nuevamente.");
                }
            } while (tipoTorneo === 'basket' && puntos1 === puntos2);
            torneo.agregarPartido(new Partido(equiposTorneo[i], equiposTorneo[j], puntos1, puntos2));
        }
    }

    // Calcular puntos y mostrar posiciones
    torneo.calcularPuntos();
    console.log("\n=== Tabla de posiciones ===");
    torneo.mostrarPosiciones();

    rl.close();
}

ejecutarTorneo();
