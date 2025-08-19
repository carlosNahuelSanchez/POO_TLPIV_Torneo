import { createInterface } from 'readline';

// ================== EQUIPOS ==================
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

    actualizarPuntos(resultado, puntosPorVictoria) {
        if (resultado === "victoria") {
            this.#victorias++;
            this.#puntos += puntosPorVictoria;
        } else if (resultado === "empate") {
            this.#empates++;
            this.#puntos++;
        } else {
            this.#derrotas++;
        }
    }
}

class EquipoFutbol extends Equipo {
    constructor(nombre) {
        super(nombre);
        this.golesAFavor = 0;
        this.golesEnContra = 0;
    }
}

class EquipoBasket extends Equipo {
    constructor(nombre) {
        super(nombre);
        this.canastasAFavor = 0;
        this.canastasEnContra = 0;
    }
}

// ================== PARTIDOS ==================
class Partido {
    constructor(equipo1, equipo2, marcador1, marcador2) {
        this.equipo1 = equipo1;
        this.equipo2 = equipo2;
        this.marcador1 = marcador1;
        this.marcador2 = marcador2;
    }
}

class PartidoFutbol extends Partido {
    constructor(equipo1, equipo2, goles1, goles2) {
        super(equipo1, equipo2, goles1, goles2);
    }
}

class PartidoBasket extends Partido {
    constructor(equipo1, equipo2, puntos1, puntos2) {
        super(equipo1, equipo2, puntos1, puntos2);
    }
}

// ================== TORNEOS ==================
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

    // Método polimórfico → cada deporte implementa sus reglas
    calcularPuntos() { }

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
            const { equipo1, equipo2, marcador1, marcador2 } = partido;

            equipo1.golesAFavor += marcador1;
            equipo1.golesEnContra += marcador2;
            equipo2.golesAFavor += marcador2;
            equipo2.golesEnContra += marcador1;

            if (marcador1 > marcador2) {
                equipo1.actualizarPuntos("victoria", 3);
                equipo2.actualizarPuntos("derrota", 3);
            } else if (marcador2 > marcador1) {
                equipo2.actualizarPuntos("victoria", 3);
                equipo1.actualizarPuntos("derrota", 3);
            } else {
                equipo1.actualizarPuntos("empate", 3);
                equipo2.actualizarPuntos("empate", 3);
            }
        });
    }
}

class TorneoBasket extends Torneo {
    calcularPuntos() {
        this.partidos.forEach(partido => {
            const { equipo1, equipo2, marcador1, marcador2 } = partido;

            equipo1.canastasAFavor += marcador1;
            equipo1.canastasEnContra += marcador2;
            equipo2.canastasAFavor += marcador2;
            equipo2.canastasEnContra += marcador1;

            if (marcador1 > marcador2) {
                equipo1.actualizarPuntos("victoria", 2);
                equipo2.actualizarPuntos("derrota", 2);
            } else {
                equipo2.actualizarPuntos("victoria", 2);
                equipo1.actualizarPuntos("derrota", 2);
            }
        });
    }
}

// ================== CLI ==================
const rl = createInterface({
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

        const eq = tipoTorneo === 'futbol'
            ? new EquipoFutbol(nombre)
            : new EquipoBasket(nombre);

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

            const partido = tipoTorneo === 'futbol'
                ? new PartidoFutbol(equiposTorneo[i], equiposTorneo[j], puntos1, puntos2)
                : new PartidoBasket(equiposTorneo[i], equiposTorneo[j], puntos1, puntos2);

            torneo.agregarPartido(partido);
        }
    }

    // Calcular puntos y mostrar posiciones
    torneo.calcularPuntos();
    console.log("\n=== Tabla de posiciones ===");
    torneo.mostrarPosiciones();

    rl.close();
}

ejecutarTorneo();
