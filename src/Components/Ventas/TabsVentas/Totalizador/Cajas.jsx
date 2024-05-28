import editar from '../../../../images/editar2.webp';
import PropTypes from 'prop-types';
import './Cajas.css';

const Cajas = ({ nombresCajas, cajaSeteada }) => {
  const handleCaja = (event) => {
    const selectedIndex = event.target.value;
    cajaSeteada(Number(selectedIndex));
  };

  return (
    <div className='cajas bg-secondary'>
 
      <select onChange={handleCaja} className='form-select' defaultValue="">
    <option value="" disabled>Seleccione una caja</option>
        {nombresCajas && 
          nombresCajas.map((caja, index) => (
            <option key={index} value={index}>
              {caja}
            </option>
          ))
        }
      </select>
    </div>
  );
};

Cajas.propTypes = {
  nombresCajas: PropTypes.array.isRequired,
  cajaSeteada: PropTypes.func.isRequired,
};

export default Cajas;
