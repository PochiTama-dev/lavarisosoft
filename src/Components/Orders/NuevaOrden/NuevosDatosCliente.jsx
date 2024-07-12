import React from 'react';
import './nuevaOrden.css';

const NuevosDatosCliente = ({ setCliente, cliente }) => {
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setCliente(prevState => ({ ...prevState, [id]: value }));
  };

  return (
    <div>
      <h3 className='m-4'>Datos del cliente</h3>
      <div className='row'>
        <div className='col-md-6'>
          <div className='mb-3 row align-items-center'>
            <label htmlFor='numero_cliente' className='col-sm-2 col-form-label'>
              Número de Cliente:
            </label>
            <div className='col-sm-8'>
              <input
                type='text'
                id='numero_cliente'
                className='form-control input-small'
                value={cliente.numero_cliente}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className='mb-3 row align-items-center'>
            <label htmlFor='nombre' className='col-sm-2 col-form-label'>
              Nombre:
            </label>
            <div className='col-sm-8'>
              <input type='text' id='nombre' className='form-control input-small' onChange={handleInputChange} required />
            </div>
          </div>
          <div className='mb-3 row align-items-center'>
            <label htmlFor='apellido' className='col-sm-2 col-form-label'>
              Apellido:
            </label>
            <div className='col-sm-8'>
              <input type='text' id='apellido' className='form-control input-small' onChange={handleInputChange} required />
            </div>
          </div>
          <div className='mb-3 row align-items-center'>
        
        
          </div>
          <div className='mb-3 row align-items-center'>
            <label htmlFor='ubicacion' className='col-sm-2 col-form-label'>
              Ubicación:
            </label>
            <div className='col-sm-8'>
              <input type='text' id='ubicacion' className='form-control input-small' onChange={handleInputChange} required />
            </div>
          </div>
        </div>
        <div className='col-md-6'>
          <div className='mb-3 row align-items-center'>
            <label htmlFor='telefono' className='col-sm-2 col-form-label'>
              Teléfono:
            </label>
            <div className='col-sm-8'>
              <input type='text' id='telefono' className='form-control input-small' onChange={handleInputChange} required />
            </div>
          </div>
          <div className='mb-3 row align-items-center'>
            <label htmlFor='direccion' className='col-sm-2 col-form-label'>
              Dirección:
            </label>
            <div className='col-sm-8'>
              <input type='text' id='direccion' className='form-control input-small' onChange={handleInputChange} required />
            </div>
          </div>
          <div className='mb-3 row align-items-center'>
            <label htmlFor='localidad' className='col-sm-2 col-form-label'>
              Localidad:
            </label>
            <div className='col-sm-8'>
              <input type='text' id='localidad' className='form-control input-small' onChange={handleInputChange} required />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NuevosDatosCliente;
