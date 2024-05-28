import PropTypes from 'prop-types';
import { useState } from 'react';
import './OrdenesTecnico.css';
const OrdenesTecnico = ({ tecnico }) => {
  const [show, setShow] = useState(false);

  const handleShowOrder = () => {
    setShow(!show);
  };
  return (
    <div className='bg-secondary ordenes-tecnico'>
      <div className='d-flex'>
        <h3 className='subtitle'>{tecnico}</h3>
        <ul onClick={handleShowOrder} className='ordenTecnico'>
          <li></li>
        </ul>
      </div>
      {show && (
        <ul className='ordenes'>
          <li>
            Orden #25645 <a href='#'>ver detalles</a>
          </li>
          <li>
            Orden #25646 <a href='#'>ver detalles</a>
          </li>
        </ul>
      )}
    </div>
  );
};
export default OrdenesTecnico;
OrdenesTecnico.propTypes = {
  tecnico: PropTypes.string.isRequired,
};
