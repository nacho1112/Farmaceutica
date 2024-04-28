const readlineSync = require('readline-sync');

const salarioMinimo = 1300000;

class Paciente {
    constructor(nombre, edad, genero, sisbenNivel, regimen, salario) {
        this.nombre = nombre;
        this.edad = edad;
        this.genero = genero;
        this.sisbenNivel = sisbenNivel;
        this.regimen = regimen;
        this.salario = salario;
    }
}

class Prueba {
    constructor(nombre, tipo, costo, descuentoSisben) {
        this.nombre = nombre;
        this.tipo = tipo;
        this.costo = costo;
        this.descuentoSisben = descuentoSisben;
    }
}

class Laboratorio {
    constructor(nombre) {
        this.nombre = nombre;
        this.pacientes = [];
        this.pruebas = [];
    }

    registrarPacientes() {
        let otroPaciente = 'si';
        while (otroPaciente === 'si') {
            console.log(`--- Registrando paciente en el laboratorio ${this.nombre} ---`);
            this.registrarPaciente();
            otroPaciente = readlineSync.question('¿Desea registrar otro paciente en este laboratorio? (si/no): ');
        }
    }

    registrarPaciente() {
        const nombre = readlineSync.question('Ingrese el nombre del paciente: ');
        const edad = +readlineSync.question('Ingrese la edad del paciente: ');
        const genero = readlineSync.question('Ingrese el género del paciente: ').toLowerCase();
        const sisbenNivel = readlineSync.question('Ingrese el nivel de Sisben del paciente: ');
        const regimen = readlineSync.question('Ingrese el régimen del paciente (contributivo/subsidiado): ');
        const salario = +readlineSync.question('Ingrese el salario del paciente: ');
        const paciente = new Paciente(nombre, edad, genero, sisbenNivel, regimen, salario);
        this.pacientes.push(paciente);
        this.registrarPruebasParaPaciente(paciente);
    }

    registrarPruebasParaPaciente(paciente) {
        let otraPrueba = 'si';
        while (otraPrueba === 'si') {
            console.log(`--- Registro de pruebas para el paciente ${paciente.nombre} ---`);
            this.registrarPrueba();
            otraPrueba = readlineSync.question('¿Desea registrar otra prueba para este paciente? (si/no): ').toLowerCase();
        }
    }

    registrarPrueba() {
        const nombre = readlineSync.question('Ingrese el nombre de la prueba: ');
        const tipo = readlineSync.question('Ingrese el tipo de prueba: ').toLowerCase();
        const costo = +readlineSync.question('Ingrese el costo de la prueba: ');
        const descuentoSisben = readlineSync.question('La prueba tiene descuento para Sisben (si/no): ');
        const prueba = new Prueba(nombre, tipo, costo, descuentoSisben);
        this.pruebas.push(prueba);
    }

    calcularIngresosTotales() {
        let ingresosTotales = 0;
        for (const prueba of this.pruebas) {
            ingresosTotales += prueba.costo;
        }
        return ingresosTotales;
    }

    calcularIngresosPorRegimen(regimen) {
        let ingresosPorRegimen = 0;
        for (const prueba of this.pruebas) {
            for (const paciente of this.pacientes) {
                if (paciente.regimen === regimen) {
                    ingresosPorRegimen += prueba.costo;
                }
            }
        }
        return ingresosPorRegimen;
    }

    tipoPruebaMayorIngreso() {
        let tipoPruebaMayorIngreso = '';
        let mayorIngreso = 0;
        for (const prueba of this.pruebas) {
            if (prueba.costo > mayorIngreso) {
                mayorIngreso = prueba.costo;
                tipoPruebaMayorIngreso = prueba.tipo;
            }
        }
        return tipoPruebaMayorIngreso;
    }

    calcularDescuentosSisben() {
        let descuentosSisben = 0;
        for (const prueba of this.pruebas) {
            for (const paciente of this.pacientes) {
                if (paciente.sisbenNivel === 'A' && prueba.descuentoSisben === 'si') {
                    descuentosSisben += prueba.costo * 0.1;
                } else if (paciente.sisbenNivel === 'B1' && prueba.descuentoSisben === 'si') {
                    descuentosSisben += prueba.costo * 0.05;
                } else if (paciente.sisbenNivel === 'B2' && prueba.descuentoSisben === 'si') {
                    descuentosSisben += prueba.costo * 0.02;
                }
            }
        }
        return descuentosSisben;
    }
    



    calcularCostosAdicionales(salarioMinimo) {
        let costosAdicionales = 0;
        for (const paciente of this.pacientes) {
            if (paciente.regimen === 'contributivo' && paciente.salario > 3 * salarioMinimo) {
                costosAdicionales += (paciente.salario - 3 * salarioMinimo) * 0.1;
            }
        }
        return costosAdicionales;
    }

    calcularPromedioIngresos() {
        const ingresosTotales = this.calcularIngresosTotales();
        return ingresosTotales / this.pruebas.length;
    }

    laboratoriosPorEncimaPromedio(laboratorios) {
        const promedioIngresos = this.calcularPromedioIngresos();
        const laboratoriosEncimaPromedio = [];
        for (const laboratorio of laboratorios) {
            const ingresosLaboratorio = laboratorio.calcularIngresosTotales();
            if (ingresosLaboratorio > promedioIngresos) {
                laboratoriosEncimaPromedio.push(laboratorio.nombre);
            }
        }
        return laboratoriosEncimaPromedio;
    }

    laboratoriosPorDebajoPromedio(laboratorios) {
        const promedioIngresos = this.calcularPromedioIngresos();
        const laboratoriosDebajoPromedio = [];
        for (const laboratorio of laboratorios) {
            const ingresosLaboratorio = laboratorio.calcularIngresosTotales();
            if (ingresosLaboratorio < promedioIngresos) {
                laboratoriosDebajoPromedio.push(laboratorio.nombre);
            }
        }
        return laboratoriosDebajoPromedio;
    }
}


const laboratorios = [];

function registrarLaboratorio() {
    const nombre = readlineSync.question('Ingrese el nombre del laboratorio: ');
    const laboratorio = new Laboratorio(nombre);
    laboratorios.push(laboratorio);
    return laboratorio;
}


function mostrarLaboratoriosRegistrados() {
    console.log('--- Laboratorios Registrados ---');
    for (let i = 0; i < laboratorios.length; i++) {
        console.log(`${i + 1}. ${laboratorios[i].nombre}`);
    }
}


const numLaboratorios = parseInt(readlineSync.question('Ingrese el número de laboratorios a registrar: '));
for (let i = 0; i < numLaboratorios; i++) {
    console.log(`--- Registrando laboratorio ${i + 1} ---`);
    const laboratorio = registrarLaboratorio();
    laboratorio.registrarPacientes();
}


let ingresosTotales = 0;
let ingresosContributivo = 0;
let ingresosSubsidiado = 0;
let tipoPruebaMayorIngreso = '';
let descuentosSisben = 0;
let costosAdicionales = 0;

for (const laboratorio of laboratorios) {
    ingresosTotales += laboratorio.calcularIngresosTotales();
    ingresosContributivo += laboratorio.calcularIngresosPorRegimen('contributivo');
    ingresosSubsidiado += laboratorio.calcularIngresosPorRegimen('subsidiado');
    if (laboratorio.tipoPruebaMayorIngreso() > tipoPruebaMayorIngreso) {
        tipoPruebaMayorIngreso = laboratorio.tipoPruebaMayorIngreso();
    }
    descuentosSisben += laboratorio.calcularDescuentosSisben();
    costosAdicionales += laboratorio.calcularCostosAdicionales(salarioMinimo);
}

const promedioIngresos = ingresosTotales / laboratorios.length;
const laboratoriosEncimaPromedio = laboratorios[0].laboratoriosPorEncimaPromedio(laboratorios);
const laboratoriosDebajoPromedio = laboratorios[0].laboratoriosPorDebajoPromedio(laboratorios);

console.log('--- Resultados ---');
console.log('1. Ingresos totales por concepto de pruebas de laboratorio:', ingresosTotales);
console.log('2. Ingresos totales según el régimen:');
console.log('   - Contributivo:', ingresosContributivo);
console.log('   - Subsidiado:', ingresosSubsidiado);
console.log('3. Tipo de prueba que genera mayores ingresos:', tipoPruebaMayorIngreso);
console.log('4. Total de descuentos brindados según el Sisben:', descuentosSisben);
console.log('5. Costos adicionales para pacientes del régimen contributivo con salario superior a 3 salarios mínimos:', costosAdicionales);
console.log('6. Laboratorios por encima del promedio:', laboratoriosEncimaPromedio);
console.log('7. Laboratorios por debajo del promedio:', laboratoriosDebajoPromedio);
