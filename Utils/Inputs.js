import { createInterface } from 'readline';

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

function cerrarInput() {
    rl.close();
}

export { preguntar, preguntarNumero, cerrarInput };
