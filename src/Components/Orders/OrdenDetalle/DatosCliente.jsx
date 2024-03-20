import PropTypes from 'prop-types';

const DatosCliente = ({ nombre, apellido, legajo, telefono, direccion, localidad }) => {
  return (
    <div>
      <h3 className='ms-5'>Datos del cliente</h3>
      <div>
        <ul className='d-flex'>
          <div className='d-flex flex-column'>
            <li>
              <span>Nombre: </span>
              <input type='text' value={nombre} disabled className='rounded' />
            </li>
            <li>
              <span>Apellido: </span>
              <input type='text' value={apellido} disabled className='rounded' />
            </li>
            <li>
              <span>Legajo: </span>
              <input type='text' value={legajo} disabled className='rounded' />
            </li>
          </div>
          <div className='d-flex flex-column mx-5'>
            <li>
              <span>Telefono: </span>
              <input type='text' value={telefono} disabled className='rounded' />
            </li>
            <li>
              <span>Direccion: </span>
              <input type='text' value={direccion} disabled className='rounded' />
            </li>
            <li>
              <span>Localidad: </span>
              <input type='text' value={localidad} disabled className='rounded' />
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
};
export default DatosCliente;

DatosCliente.propTypes = {
  nombre: PropTypes.string.isRequired,
  apellido: PropTypes.string.isRequired,
  legajo: PropTypes.string.isRequired,
  telefono: PropTypes.string.isRequired,
  direccion: PropTypes.string.isRequired,
  localidad: PropTypes.string.isRequired,
};
