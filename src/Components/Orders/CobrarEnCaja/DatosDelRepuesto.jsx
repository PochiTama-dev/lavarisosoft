import { useState } from 'react';
import papelito from '../../../images/papelito.webp';
import './DatosDelRepuesto.css';
import Repuestos from './Repuestos';
const DatosDelRepuesto = () => {
  const [precio, setPrecio] = useState('$');
  const [repuesto, setrepuesto] = useState(1);

  const handleAddRepuesto = () => {
    return setrepuesto(repuesto + 1);
  };
  return (
    <div className='mx-5'>
      <h1>Datos del repuesto</h1>
      <div className='d-flex   flex-wrap'>
        {[...Array(repuesto)].map((_, index) => (
          <Repuestos key={index} />
        ))}
      </div>
      <h1 className='agregarH1' onClick={handleAddRepuesto}>
        +
      </h1>
      <hr />
      <div>
        <span>Total: </span>
        <input type='text' value={precio} onChange={(e) => setPrecio(e.target.value)} />
      </div>
      <button className='bg-info text-white rounded-pill d-block mx-auto confirmButton'>
        Confirmar
      </button>
      <div className='d-flex justify-content-end'>
        <center className='bg-info rounded-circle mx-5 tagpapelitoButton'>
          <img className='papelito mx-1' src={papelito} alt='papelito' />
        </center>
      </div>
    </div>
  );
};
export default DatosDelRepuesto;
