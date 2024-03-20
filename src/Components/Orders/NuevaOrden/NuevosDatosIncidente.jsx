import { useState } from 'react';
import '../OrdenDetalle/OrdenDetalle.css';
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
    <div className='d-flex m-5 justify-content-between'>
      <div className='d-flex flex-column'>
        <h3>Datos del incidente</h3>
        <ul className='d-flex flex-column justify-content-start p-0'>
          <li className='m-1'>
            <span className='pe-2'>Equipo: </span>
            <input type='text' className='rounded mx-2' />
          </li>
          <li className='m-1'>
            <span className='pe-1'>Modelo: </span>
            <input type='text' className='rounded mx-2' />
          </li>
          <li className='m-1'>
            <span>Antiguedad: </span>
            <input type='text' className='rounded' />
          </li>
          <li className='m-1 d-flex align-items-center'>
            <span>Diagnostico: </span>
            <textarea></textarea>
          </li>
        </ul>
      </div>
      <div className='mx-auto'>
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
export default NuevosDatosIncidente;
