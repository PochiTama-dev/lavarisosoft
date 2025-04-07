import PropTypes from 'prop-types';
import { useState } from 'react';

const CajaSeleccionada = ({ onDateChange }) => {
  const [firstDate, setFirstDate] = useState();
  const [secondDate, setSecondDate] = useState();

  const handleDateInput = (event) => {
    setFirstDate(event.target.value);
    onDateChange(event.target.value);
    console.log(firstDate);
  };
  return (
    <div>
      <div className='d-flex justify-content-evenly my-2'>
        <label className='text-primary' htmlFor=''>
          Filtrar por período
        </label>
        <div className='d-flex'>
          {/* Selector de Año */}
          <span>Año</span>
          <input className='rounded-pill mx-4' type='number' min='1900' max={new Date().getFullYear()} placeholder='YYYY' onChange={handleDateInput} />

          {/* Selector de Mes */}
          <span>Mes</span>
          <select className='rounded-pill mx-4' onChange={handleDateInput}>
            <option value=''>Selecciona un mes</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('es', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* <ul className='row'>
        <li className='pestañasFont pestañasInventario col text-center'>Efectivo</li>
        <li className='pestañasFont pestañasInventario col text-center'>Dólares</li>
        <li className='pestañasFont pestañasInventario col text-center'>Bancos</li>
      </ul> */}
      <ul className='row'>
        <li className='col text-center items'>Periodo del Mes</li>
        <li className='col text-center items'>Total Facturado</li>
        <li className='col text-center items'>Total Pagado a tecnicos</li>
        <li className='col text-center items'>Margen Bruto</li>
        <li className='col text-center items'>Gastos Operativos</li>
        <li className='col text-center items'>Ganancia Neta</li>
        <li className='col text-center items'>Facturas pendientes de cobro</li>
      </ul>
    </div>
  );
};

CajaSeleccionada.propTypes = {
  onDateChange: PropTypes.func.isRequired,
};

export default CajaSeleccionada;
