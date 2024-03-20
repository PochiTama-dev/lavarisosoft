import PropTypes from 'prop-types';
import './Calendario.css';
const Calendario = ({ dia, mes }) => {
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

  const mesNombre = meses[mes - 1];
  const primerDiaMes = new Date(fechaSeleccionada.getFullYear(), mes - 1, 1).getDay();

  console.log(primerDiaMes);
  return (
    <div className='m-5'>
      <div className='d-flex flex-column justify-content-center align-items-center'>
        <h3>
          Semana del {primerDiaSemana.getDate()} de {mesNombre}
        </h3>
        <h3>
          <span></span>
          {primerDiaSemana.getDate()} de {mesNombre} - {ultimoDiaSemana.getDate()} de {mesNombre}
          <span></span>
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
              <span className={` ${index === 2 && 'bg-info text-white rounded-pill diaSpan'}`}>
                {diaSemana} {primerDiaSemana.getDate() + index}
              </span>
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
Calendario.propTypes = {
  dia: PropTypes.number.isRequired,
  mes: PropTypes.number.isRequired,
};
