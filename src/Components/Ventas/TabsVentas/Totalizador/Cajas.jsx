import editar from '../../../../images/editar2.webp';
import PropTypes from 'prop-types';
import './Cajas.css';
const Cajas = ({ nombresCajas, cajaSeteada }) => {
  const handleCaja = (index) => {
    cajaSeteada(index);
  };
  return (
    <div className='cajas bg-secondary'>
      <h2 className='text-primary'>Cajas</h2>
      <ul>
        {nombresCajas &&
          nombresCajas.map((caja, index) => (
            <li key={index} className='bg-light cajaItem' onClick={() => handleCaja(index)}>
              <div className='d-flex justify-content-between'>
                <span>{caja}</span>
                <img src={editar} alt='' />
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};
export default Cajas;
Cajas.propTypes = {
  nombresCajas: PropTypes.array.isRequired,
  cajaSeteada: PropTypes.func.isRequired,
};
