import PropTypes from 'prop-types';

const DatosTecnico = ({ nombre, apellido, legajo }) => {
  return (
    <div>
      <h3 className='ms-5 mt-3'>Datos del ténico</h3>
      <div>
        <ul className='d-flex'>
          <li>
            <span>Nombre:</span>
            <input type='text' value={nombre} disabled className='rounded' />
          </li>
          <li>
            <span>Apellido:</span>
            <input type='text' value={apellido} disabled className='rounded' />
          </li>
          <li>
            <span>Legajo:</span>
            <input type='text' value={legajo} disabled className='rounded' />
          </li>
        </ul>
      </div>
    </div>
  );
};
export default DatosTecnico;

DatosTecnico.propTypes = {
  nombre: PropTypes.string.isRequired,
  apellido: PropTypes.string.isRequired,
  legajo: PropTypes.string.isRequired,
};
