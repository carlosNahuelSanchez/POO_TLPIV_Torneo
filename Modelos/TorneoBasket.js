import Torneo from "./Torneo.js";

class TorneoBasket extends Torneo {
    calcularPuntos() {
        this.partidos.forEach(({ equipo1, equipo2, marcador1, marcador2 }) => {
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

export default TorneoBasket;
