
import { useState } from "react";

const NuevosDatosTecnico = ({setOrden}) => {
  const [nuevoTecnico, setNuevoTecnico] = useState('');

  return (
    <div >
      <h3 className='m-4'>Datos del técnico</h3>
      <div className='row'>
        <div className='col-md-6'>
          <div className='mb-3 row align-items-center'>
            <label htmlFor='nombre' className='col-sm-2 col-form-label'>Nombre:</label>
            <div className='col-sm-8'>
              <input type='text' id='nombre' className='form-control input-small' required />
            </div>
          </div>
          <div className='mb-3 row align-items-center'>
            <label htmlFor='apellido' className='col-sm-2 col-form-label'>Apellido:</label>
            <div className='col-sm-8'>
              <input type='text' id='apellido' className='form-control input-small' required />
            </div>
          </div>
          <div className='mb-3 row align-items-center'>
            <label htmlFor='legajo' className='col-sm-2 col-form-label'>Legajo:</label>
            <div className='col-sm-8'>
              <input type='text' id='legajo' className='form-control input-small' required />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NuevosDatosTecnico;
