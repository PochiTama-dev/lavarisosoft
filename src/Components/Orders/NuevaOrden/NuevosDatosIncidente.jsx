import { useState } from 'react';
import './nuevaOrden.css';

const NuevosDatosIncidente = () => {
  const [repuesto, setRepuesto] = useState([]);
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
      <div className='row'>
        <div className='col-md-6'>
          <h3 className='m-4'>Datos del incidente</h3>
          <div className='mb-3 row align-items-center'>
            <label htmlFor='equipo' className='col-sm-2 col-form-label'>Equipo:</label>
            <div className='col-sm-8'>
              <input type='text' id='equipo' className='form-control input-small' />
            </div>
          </div>
          <div className='mb-3 row align-items-center'>
            <label htmlFor='modelo' className='col-sm-2 col-form-label'>Modelo:</label>
            <div className='col-sm-8'>
              <input type='text' id='modelo' className='form-control input-small' />
            </div>
          </div>
          <div className='mb-3 row align-items-center'>
            <label htmlFor='antiguedad' className='col-sm-2 col-form-label'>Antiguedad:</label>
            <div className='col-sm-8'>
              <input type='text' id='antiguedad' className='form-control input-small' />
            </div>
          </div>
          <div className='mb-3 row align-items-center'>
            <label htmlFor='diagnostico' className='col-sm-2 col-form-label'>Diagnostico:</label>
            <div className='col-sm-8'>
              <textarea id='diagnostico' className='form-control input-small'></textarea>
            </div>
          </div>
        </div>
        <div className='col-md-6 agregar-repuesto'>
          <h3>Repuestos</h3>
          <div className='d-flex flex-column'>
            {repuesto.map((item, index) => (
              <span className='mx-3 ' key={index}>
                {item}
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
                className='form-control input-small'
              />
              <button onClick={handleAdd} className='btn btn-primary mt-2'>Agregar</button>
            </>
          )}
          <h2 onClick={handleShow} className='agregarRepuesto mt-3'>
            +
          </h2>
        </div>
      </div>
    </div>
  );
};

export default NuevosDatosIncidente;
