import PropTypes from 'prop-types';
import { useState } from 'react';
import './OrdenDetalle.css';
const DatosIncidente = ({ equipo, modelo, antiguedad, diagnostico }) => {
  const [repuesto, setRepuesto] = useState(['Fuelle de cambio lineal']);
  const [nuevoRepuesto, setNuevoRepuesto] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleAdd = () => {
    if (nuevoRepuesto.trim() !== '') {
      setRepuesto((prevRepuestos) => [...prevRepuestos, nuevoRepuesto]);
      setNuevoRepuesto('');
      handleShow();
    }
  };
  const handleShow = () => {
    setShowInput(!showInput);
  };
  return (
    <div className='d-flex m-5 justify-content-between'>
      <div className='d-flex flex-column'>
        <h3>Datos del incidente</h3>
        <ul className='d-flex flex-column justify-content-start p-0'>
          <li className='m-1'>
            <span className='pe-2'>Equipo: </span>
            <input type='text' value={equipo} disabled className='rounded mx-2' />
          </li>
          <li className='m-1'>
            <span className='pe-1'>Modelo: </span>
            <input type='text' value={modelo} disabled className='rounded mx-2' />
          </li>
          <li className='m-1'>
            <span>Antiguedad: </span>
            <input type='text' value={antiguedad} disabled className='rounded' />
          </li>
          <li className='m-1 d-flex align-items-center'>
            <span>Diagnostico: </span>
            <textarea disabled>{diagnostico}</textarea>
          </li>
        </ul>
      </div>
      <div>
        <h3>Repuestos</h3>
        <div className='d-flex flex-column'>
          {repuesto.map((repuesto, index) => (
            <>
              <span className='mx-3 ' key={index}>
                {repuesto}
              </span>
            </>
          ))}
        </div>
        {showInput && (
          <>
            <input
              type='text'
              value={nuevoRepuesto}
              onChange={(e) => setNuevoRepuesto(e.target.value)}
              placeholder='Nuevo repuesto'
            />
            <button onClick={handleAdd}>Agregar</button>
          </>
        )}
        <h2 onClick={handleShow} className='agregarRepuesto'>
          +
        </h2>
      </div>
    </div>
  );
};
export default DatosIncidente;

DatosIncidente.propTypes = {
  equipo: PropTypes.string.isRequired,
  modelo: PropTypes.string.isRequired,
  antiguedad: PropTypes.string.isRequired,
  diagnostico: PropTypes.string.isRequired,
};
