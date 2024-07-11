import './nuevaOrden.css';

const NuevosDatosCliente = () => {
  return (
    <div>
      <h3 className='m-4'>Datos del cliente</h3>
      <div className='row'>
        <div className='col-md-6'>
          <div className='mb-3 row align-items-center'>
            <label htmlFor='nombre' className='col-sm-2 col-form-label'>
              Nombre:
            </label>
            <div className='col-sm-8'>
              <input type='text' id='nombre' className='form-control input-small' required />
            </div>
          </div>
          <div className='mb-3 row align-items-center'>
            <label htmlFor='apellido' className='col-sm-2 col-form-label'>
              Apellido:
            </label>
            <div className='col-sm-8'>
              <input type='text' id='apellido' className='form-control input-small' required />
            </div>
          </div>
          <div className='mb-3 row align-items-center'>
            <label htmlFor='legajo' className='col-sm-2 col-form-label'>
              Legajo:
            </label>
            <div className='col-sm-8'>
              <input type='text' id='legajo' className='form-control input-small' required />
            </div>
          </div>
        </div>
        <div className='col-md-6'>
          <div className='mb-3 row align-items-center'>
            <label htmlFor='telefono' className='col-sm-2 col-form-label'>
              Teléfono:
            </label>
            <div className='col-sm-8'>
              <input type='text' id='telefono' className='form-control input-small' required />
            </div>
          </div>
          <div className='mb-3 row align-items-center'>
            <label htmlFor='direccion' className='col-sm-2 col-form-label'>
              Dirección:
            </label>
            <div className='col-sm-8'>
              <input type='text' id='direccion' className='form-control input-small' required />
            </div>
          </div>
          <div className='mb-3 row align-items-center'>
            <label htmlFor='localidad' className='col-sm-2 col-form-label'>
              Localidad:
            </label>
            <div className='col-sm-8'>
              <input type='text' id='localidad' className='form-control input-small' required />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NuevosDatosCliente;
