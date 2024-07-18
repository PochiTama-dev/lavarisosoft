import { useState } from 'react';
import PropTypes from 'prop-types';

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
    <div  >
      <div className='row align-items-start'>
        <div className='col-md-6'>
          <h3 className='ms-5 mt-3'>Datos del incidente</h3>
          <div className='row mb-3'>
            <label className='col-sm-3 col-form-label'>Equipo:</label>
            <div className='col-sm-8 d-flex align-items-center'>
            
              <input type='text' value={equipo} disabled className='form-control rounded mx-2 ' />
            </div>
          </div>
          <div className='row mb-3'>
            <label className='col-sm-3 col-form-label'>Modelo:</label>
            <div className='col-sm-8 d-flex align-items-center'>
             
              <input type='text' value={modelo} disabled className='form-control rounded mx-2' />
            </div>
          </div>
          <div className='row mb-3'>
            <label className='col-sm-3 col-form-label'>Antigüedad:</label>
            <div className='col-sm-8 d-flex align-items-center'>
           
              <input type='text' value={antiguedad} disabled className='form-control rounded mx-2' />
            </div>
          </div>
          <div className='row mb-3'>
            <label className='col-sm-3 col-form-label'>Diagnóstico:</label>
            <div className='col-sm-8 d-flex align-items-center'>
               
              <textarea disabled className='form-control rounded mx-2' defaultValue={diagnostico}></textarea>
            </div>
          </div>
        </div>
        <div className='col-md-6'>
          <h3>Repuestos</h3>
          <div className='d-flex flex-column align-items-start'>
            {repuesto.map((repuesto, index) => (
              <span className='mx-3 mb-2' key={index}>
                {repuesto}
              </span>
            ))}
          </div>
          {showInput && (
            <>
              <input
                type='text'
                value={nuevoRepuesto}
                onChange={(e) => setNuevoRepuesto(e.target.value)}
                placeholder='Nuevo repuesto'
                className='form-control rounded mb-2'
              />
              <button onClick={handleAdd} className='btn btn-primary'>Agregar</button>
            </>
          )}
          <h2 onClick={handleShow} className='agregarRepuesto'>+</h2>
        </div>
      </div>
    </div>
  );
};

DatosIncidente.propTypes = {
  equipo: PropTypes.string.isRequired,
  modelo: PropTypes.string.isRequired,
  antiguedad: PropTypes.string.isRequired,
  diagnostico: PropTypes.string.isRequired,
};

export default DatosIncidente;
