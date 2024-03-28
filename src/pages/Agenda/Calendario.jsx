import PropTypes from 'prop-types';
import './Calendario.css';
import { useState } from 'react';
//import { Calendar, momentLocalizer } from 'react-big-calendar';
//import moment from 'moment';

const Calendario = ({ dia, mes }) => {
  // const localizer = momentLocalizer(moment);
  const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  const dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
  const horario = [
    '8:00',
    '9:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
    '00:00',
  ];
  const fechaSeleccionada = new Date();
  fechaSeleccionada.setDate(dia);
  const primerDiaSemana = new Date(fechaSeleccionada);
  const ultimoDiaSemana = new Date(fechaSeleccionada);
  primerDiaSemana.setDate(dia + 1 - fechaSeleccionada.getDay());
  ultimoDiaSemana.setDate(dia + (7 - fechaSeleccionada.getDay()));

  const ultimoDiaMes = (anio, mes) => {
    //console.log(`${anio}/${mes}`);
    // Si el mes es febrero
    if (mes === 2) {
      // Comprobar si es año bisiesto
      if ((anio % 4 === 0 && anio % 100 !== 0) || anio % 400 === 0) {
        return 29; // Año bisiesto: febrero tiene 29 días
      } else {
        return 28; // Año no bisiesto: febrero tiene 28 días
      }
    } else {
      // demás meses
      const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      return diasPorMes[mes - 1];
    }
  };
  const fechaActual = new Date();
  const ultimoDiaMesActual = ultimoDiaMes(fechaActual.getFullYear(), fechaActual.getMonth() + 1);

  const [primerSemana, setPrimerSemana] = useState(primerDiaSemana.getDate());
  const [ultimoSemana, setUltimoSemana] = useState(ultimoDiaSemana.getDate());
  let mesNombre = meses[mes - 1];
  let contadorNegativo,
    contadorPositivo = 1;
  const ajustarSemana = (semana) => {
    if (semana - 7 <= 0) {
      mesNombre = meses[mes - contadorNegativo];
      contadorNegativo++;
      console.log(contadorNegativo);
      return semana - 7 + 30;
    } else {
      return semana - 7;
    }
  };
  const semanaAnterior = () => {
    setPrimerSemana(ajustarSemana(primerSemana));
    setUltimoSemana(ajustarSemana(ultimoSemana));
  };
  const ajustarSemanaSiguiente = (semana) => {
    if (semana + 7 > 30) {
      mesNombre = meses[mes + contadorPositivo];
      contadorPositivo++;
      console.log(contadorPositivo);
      return semana + 7 - 30;
    } else {
      return semana + 7;
    }
  };

  const semanaSiguiente = () => {
    setPrimerSemana(ajustarSemanaSiguiente(primerSemana));
    setUltimoSemana(ajustarSemanaSiguiente(ultimoSemana));
  };
  //console.log(ultimoDiaMesActual);

  const clientes = [
    { nombre: 'Josué Paz', estado: 'Concluido', dia: 'Lunes', horario: '9:00 - 10:00' },
    { nombre: 'Joan Cortés', estado: 'Visitado', dia: 'Lunes', horario: '15:00 - 16:00' },
    { nombre: 'Elena Alvarado', estado: 'Visitado', dia: 'Martes', horario: '10:00 - 13:30' },
    { nombre: 'Agustin Perez', estado: 'Agendado', dia: 'Miercoles', horario: '20:00 - 21:00' },
    { nombre: 'Tatiana Lajo', estado: 'Agendado', dia: 'Jueves', horario: '16:00 - 20:00' },
    { nombre: 'Carmen Lopresti', estado: 'Agendado', dia: 'Viernes', horario: '9:00 - 10:00' },
    { nombre: 'Daniela Lopez', estado: 'Agendado', dia: 'Viernes', horario: '11:00 - 12:30' },
    { nombre: 'Joan Cortés', estado: 'Agendado', dia: 'Viernes', horario: '14:00 - 15:00' },
    { nombre: 'Josué Paz', estado: 'Agendado', dia: 'Sabadoo', horario: '10:30 - 11:30' },
    { nombre: 'Elena Alvarado', estado: 'Agendado', dia: 'Sabado', horario: '16:00 - 18:00' },
    { nombre: 'Agustin Perez', estado: 'Agendado', dia: 'Domingo', horario: '12:30 - 13:30' },
  ];

  return (
    <div className='m-5'>
      <div className='d-flex flex-column justify-content-center align-items-center'>
        <h3>
          Semana del {primerSemana} de {mesNombre}
        </h3>
        <h3>
          <span className='bg-info flechaIzq' onClick={semanaAnterior}></span>
          {primerSemana} de {mesNombre} - {ultimoSemana} de {mesNombre}
          <span className='bg-info flechaDer' onClick={semanaSiguiente}></span>
        </h3>
      </div>
      <div className='d-flex'>
        <ul className='d-flex flex-column mt-4'>
          {horario.map((hora, index) => (
            <li className='my-3' key={index}>
              {hora}
            </li>
          ))}
        </ul>
        <ul className='d-flex justify-content-evenly dias p-0'>
          {dias.map((diaSemana, index) => (
            <li key={index} className={'dias bg-light mx-2 text-center'}>
              <span
                key={index}
                className={` ${
                  fechaActual.getDate() === primerDiaSemana.getDate() + index &&
                  'bg-info text-white text-center mx-3 rounded-pill diaSpan'
                }`}
              >
                {diaSemana} {primerDiaSemana.getDate() + index}
              </span>
            </li>
          ))}
        </ul>
        <ul>
          {clientes.map((cliente, index) => (
            <>
              <li key={index} className={`${cliente.estado}`}>
                {cliente.nombre}
                {cliente.dia}
                {cliente.horario}
              </li>
            </>
          ))}
        </ul>
      </div>
      <div className='d-flex'>
        <div className='mx-3 d-flex'>
          <span className='d-block circuloSpan bg-info'></span>
          <span>Agendado</span>
        </div>
        <div className='mx-3 d-flex'>
          <span className='d-block circuloSpan bg-body'></span>
          <span>Visitado</span>
        </div>
        <div className='mx-3 d-flex'>
          <span className='d-block circuloSpan bg-success'></span>
          <span>Concluido</span>
        </div>
      </div>
      {/* <Calendar
        localizer={localizer}
        startAccessor='start'
        endAccessor='end'
        style={{ height: 500 }}
      /> */}
    </div>
  );
};
export default Calendario;
Calendario.propTypes = {
  dia: PropTypes.number.isRequired,
  mes: PropTypes.number.isRequired,
};
