import PropTypes from 'prop-types';
const OrdenesTecnico = ({ tecnico }) => {
  return (
    <div className='tecnico'>
      <h3>{tecnico}</h3>
      <ul>
        <li>
          Orden #25645 <a href=''>ver detalles</a>
        </li>
        <li>
          Orden #25646 <a href=''>ver detalles</a>
        </li>
      </ul>
    </div>
  );
};
export default OrdenesTecnico;
OrdenesTecnico.propTypes = {
  tecnico: PropTypes.object.isRequired,
};
