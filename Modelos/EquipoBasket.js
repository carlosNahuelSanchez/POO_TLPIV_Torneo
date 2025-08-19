import Equipo from "./Equipo.js";

class EquipoBasket extends Equipo {
    constructor(nombre) {
        super(nombre);
        this.canastasAFavor = 0;
        this.canastasEnContra = 0;
    }
}

export default EquipoBasket;
