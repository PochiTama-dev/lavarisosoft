import { useState } from 'react';
import papelito from '../../../images/papelito.webp';
import './DatosDelRepuesto.css';
const DatosDelRepuesto = () => {
  const [precio, setPrecio] = useState('$');

  return (
    <div>
      <h1>Datos del repuesto</h1>
      <div>
        <span>Descripción</span>
        <input type='text' name='' id='' />
        <span>ID</span>
        <input type='text' name='' id='' />
        <span>Precio</span>
        <input type='text' name='' id='' />
        <span>Cantidad</span>
        <input type='text' name='' id='' />
      </div>
      <h1>+</h1>
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
