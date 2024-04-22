import PropTypes from 'prop-types';
import DatosCaja from './DatosCaja';
import { useEffect, useState } from 'react';
import '../Inventario.css';
const CajaSeleccionada = ({ cajaSelected }) => {
  const [pestaña, setPestaña] = useState('Efectivo');
  const [caja, setCaja] = useState(cajaSelected.efectivo);

  const handlePestaña = (nombre) => {
    setPestaña(nombre);
  };

  useEffect(() => {
    switch (pestaña) {
      case 'Efectivo':
        setCaja(cajaSelected.efectivo);
        break;
      case 'Dolares':
        setCaja(cajaSelected.dolares);
        break;
      case 'Bancos':
        setCaja(cajaSelected.banco);
        break;
      default:
        setCaja(cajaSelected.efectivo);
    }
  }, [pestaña, cajaSelected]);

  return (
    <div>
      <ul>
        <li>
          <div className='d-flex justify-content-between my-2 inputsItems'>
            <label className='text-primary' htmlFor=''>
              Filtrar por fecha
            </label>
            <input className='rounded-pill mx-4' type='date' name='' id='' />
          </div>
          <div className='d-flex justify-content-between my-2 inputsItems'>
            <label className='text-primary' htmlFor=''>
              Filtrar por cod.Imp
            </label>
            <input className='rounded-pill mx-4 codImp' type='search' name='' id='' />
          </div>
        </li>
      </ul>
      <ul className='row'>
        <li
          className={`pestañasFont pestañasInventario col text-center ${
            pestaña === 'Efectivo' ? 'pestañasInventarioActive' : ''
          }`}
          onClick={() => handlePestaña('Efectivo')}
        >
          Efectivo
        </li>
        <li
          className={`pestañasFont pestañasInventario col text-center ${
            pestaña === 'Dolares' ? 'pestañasInventarioActive' : ''
          }`}
          onClick={() => handlePestaña('Dolares')}
        >
          Dólares
        </li>
        <li
          className={`pestañasFont pestañasInventario col text-center ${
            pestaña === 'Bancos' ? 'pestañasInventarioActive' : ''
          }`}
          onClick={() => handlePestaña('Bancos')}
        >
          Bancos
        </li>
      </ul>
      <ul className='row'>
        <li className='col text-center items'>Fecha de ingreso</li>
        <li className='col text-center items'>Código de imputacíon</li>
        <li className='col text-center items'>Número de operacíon</li>
        <li className='col text-center items'>Nombre del cliente</li>
        <li className='col text-center items'>ID Cliente</li>
        <li className='col text-center items'>Valor</li>
      </ul>
      <DatosCaja datosCajaSelected={caja} monedaSeteada={pestaña} />
    </div>
  );
};
export default CajaSeleccionada;

CajaSeleccionada.propTypes = {
  cajaSelected: PropTypes.object.isRequired,
};
