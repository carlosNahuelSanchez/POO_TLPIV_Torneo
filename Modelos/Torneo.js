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

export default Torneo;
