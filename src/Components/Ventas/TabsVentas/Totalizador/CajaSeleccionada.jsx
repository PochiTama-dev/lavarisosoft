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
          Filtrar por fecha
        </label>
        <div className='d-flex'>
          <span>Desde</span>
          <input className='rounded-pill mx-4' type='date' onChange={handleDateInput} />
          <span>Hasta</span>
          <input className='rounded-pill mx-4' type='date' onChange={handleDateInput} />
        </div>
      </div>
      <ul className='row'>
        <li className='pestañasFont pestañasInventario col text-center'>Efectivo</li>
        <li className='pestañasFont pestañasInventario col text-center'>Dólares</li>
        <li className='pestañasFont pestañasInventario col text-center'>Bancos</li>
      </ul>
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
