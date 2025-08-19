import Equipo from "./Equipo.js";

class EquipoFutbol extends Equipo {
    constructor(nombre) {
        super(nombre);
        this.golesAFavor = 0;
        this.golesEnContra = 0;
    }
}

export default EquipoFutbol;
