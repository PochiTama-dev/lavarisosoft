import { useState } from 'react';
import './Calendario.css';

const Calendario = () => {
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
  /* const horario = [
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
  ]; */
  const clientes = [
    { nombre: 'Josué Paz', estado: 'Concluido', dia: 'Lunes', horario: '9:00 - 10:00' },
    { nombre: 'Joan Cortés', estado: 'Visitado', dia: 'Lunes', horario: '15:00 - 16:00' },
    { nombre: 'Elena Alvarado', estado: 'Visitado', dia: 'Martes', horario: '10:00 - 13:30' },
    { nombre: 'Agustin Perez', estado: 'Agendado', dia: 'Miercoles', horario: '20:00 - 21:00' },
    { nombre: 'Tatiana Lajo', estado: 'Agendado', dia: 'Jueves', horario: '16:00 - 20:00' },
    { nombre: 'Carmen Lopresti', estado: 'Agendado', dia: 'Viernes', horario: '9:00 - 10:00' },
    { nombre: 'Daniela Lopez', estado: 'Agendado', dia: 'Viernes', horario: '11:00 - 12:30' },
    { nombre: 'Joan Cortés', estado: 'Agendado', dia: 'Viernes', horario: '14:00 - 15:00' },
    { nombre: 'Josué Paz', estado: 'Agendado', dia: 'Sabado', horario: '10:30 - 11:30' },
    { nombre: 'Elena Alvarado', estado: 'Agendado', dia: 'Sabado', horario: '16:00 - 18:00' },
    { nombre: 'Agustin Perez', estado: 'Agendado', dia: 'Domingo', horario: '12:30 - 13:30' },
  ];

  const fechaActual = new Date();
  const primerDiaSemana = new Date(fechaActual);
  const ultimoDiaSemana = new Date(fechaActual);
  primerDiaSemana.setDate(fechaActual.getDate() - fechaActual.getDay() + (fechaActual.getDay() === 0 ? -6 : 1));
  ultimoDiaSemana.setDate(fechaActual.getDate() - fechaActual.getDay());

  const [comienzoSemana, setComienzoSemana] = useState(primerDiaSemana);
  const [finSemana, setFinSemana] = useState(ultimoDiaSemana);

  const semanaAnterior = () => {
    let nuevaSemana = new Date(comienzoSemana);
    nuevaSemana.setDate(nuevaSemana.getDate() - 7);

    let nuevoFinde = new Date(finSemana);
    nuevoFinde.setDate(nuevoFinde.getDate() - 7);

    setComienzoSemana(nuevaSemana);
    setFinSemana(nuevoFinde);
  };

  const semanaSiguiente = () => {
    let nuevaSemana = new Date(comienzoSemana);
    nuevaSemana.setDate(nuevaSemana.getDate() + 7);

    let nuevoFinde = new Date(finSemana);
    nuevoFinde.setDate(nuevoFinde.getDate() + 7);

    setComienzoSemana(nuevaSemana);
    setFinSemana(nuevoFinde);
  };
  const ultimoDiaMes = (anio, mes) => {
    if (mes === 2) {
      if ((anio % 4 === 0 && anio % 100 !== 0) || anio % 400 === 0) {
        return 29;
      } else {
        return 28;
      }
    } else {
      const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      return diasPorMes[mes - 1];
    }
  };
  const ultimoDiaDePrimerSemana = ultimoDiaMes(fechaActual.getFullYear(), primerDiaSemana.getMonth() + 1);

  return (
    <div className='m-5'>
      <div className='d-flex flex-column justify-content-center align-items-center calendario'>
        <h3>
          Semana del {comienzoSemana.getDate()} de {meses[comienzoSemana.getMonth()]}
        </h3>
        <h3>
          <span className='bg-info flechaIzq' onClick={semanaAnterior}></span>
          {comienzoSemana.getDate()} de {meses[comienzoSemana.getMonth()]} - {finSemana.getDate()} de {meses[finSemana.getMonth()]}
          <span className='bg-info flechaDer' onClick={semanaSiguiente}></span>
        </h3>
      </div>
      <div className='d-flex'>
        {/* <ul className='d-flex flex-column mt-4'>
          {horario.map((hora, index) => (
            <li className='my-3' key={index}>
              {hora}
            </li>
          ))}
        </ul> */}
        <ul className='d-flex justify-content-evenly dias p-0'>
          {dias.map((diaSemana, index) => (
            <li key={index} className={'dias bg-light mx-2 text-center'}>
              <span className={`${fechaActual.getDate() === index - 1 ? 'bg-info text-white text-center mx-3 rounded-pill diaSpan' : ''}`}>
                {diaSemana} {comienzoSemana.getDate() + index > ultimoDiaDePrimerSemana ? index - 1 : comienzoSemana.getDate() + index}
              </span>
              {clientes
                .filter((cliente) => cliente.dia === diaSemana)
                .map((cliente, i) => (
                  <div key={i} className='my-2 text-white'>
                    <li className={`${cliente.estado}`}>
                      <li>{cliente.nombre}</li>
                      <li>{cliente.horario}</li>
                    </li>
                  </div>
                ))}
            </li>
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
    </div>
  );
};
export default Calendario;
