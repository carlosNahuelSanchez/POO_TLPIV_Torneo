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

export default Equipo;
