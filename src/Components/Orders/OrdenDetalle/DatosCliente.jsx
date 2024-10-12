import PropTypes from 'prop-types';

const DatosCliente = ({ nombre, apellido, legajo, telefono, direccion, localidad }) => {
  return (
    <div>
      <h3 className='ms-5'>Datos del cliente</h3>
      <div>
        <div className='row'>
          <div className='col-md-6'>
            <div className='mb-3 row align-items-center'>
              <label htmlFor='nombre' className='col-sm-3 col-form-label'>
                Nombre:
              </label>
              <div className='col-sm-8'>
                <input type='text' id='nombre' value={nombre} disabled className='form-control input-ordenes' />
              </div>
            </div>
            <div className='mb-3 row align-items-center'>
              <label htmlFor='apellido' className='col-sm-3 col-form-label'>
                Apellido:
              </label>
              <div className='col-sm-8'>
                <input type='text' id='apellido' value={apellido} disabled className='form-control input-ordenes' />
              </div>
            </div>
            <div className='mb-3 row align-items-center'>
              <label htmlFor='legajo' className='col-sm-3 col-form-label'>
                Legajo:
              </label>
              <div className='col-sm-8'>
                <input type='text' id='legajo' value={legajo} disabled className='form-control input-ordenes' />
              </div>
            </div>
          </div>
          <div className='col-md-6'>
            <div className='mb-3 row align-items-center'>
              <label htmlFor='telefono' className='col-sm-3 col-form-label'>
                Teléfono:
              </label>
              <div className='col-sm-8'>
                <input type='text' id='telefono' value={telefono} disabled className='form-control input-ordenes' />
              </div>
            </div>
            <div className='mb-3 row align-items-center'>
              <label htmlFor='direccion' className='col-sm-3 col-form-label'>
                Dirección:
              </label>
              <div className='col-sm-8'>
                <input type='text' id='direccion' value={direccion} disabled className='form-control input-ordenes' />
              </div>
            </div>
            <div className='mb-3 row align-items-center'>
              <label htmlFor='localidad' className='col-sm-3 col-form-label'>
                Localidad:
              </label>
              <div className='col-sm-8'>
                <input type='text' id='localidad' value={localidad} disabled className='form-control input-ordenes' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

DatosCliente.propTypes = {
  nombre: PropTypes.string.isRequired,
  apellido: PropTypes.string.isRequired,
  legajo: PropTypes.string.isRequired,
  telefono: PropTypes.string.isRequired,
  direccion: PropTypes.string.isRequired,
  localidad: PropTypes.string.isRequired,
};

export default DatosCliente;
