import Torneo from "./Torneo.js";

class TorneoFutbol extends Torneo {
    calcularPuntos() {
        this.partidos.forEach(({ equipo1, equipo2, marcador1, marcador2 }) => {
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

export default TorneoFutbol;
