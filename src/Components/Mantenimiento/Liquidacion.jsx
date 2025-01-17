import './mantenimiento.css';
import { object, func } from 'prop-types';
//import cash from '../../assets/cash-circulo.png';
//import edit from '../../assets/edit.png';
const Liquidacion = ({ tecnico, setModal }) => {
  const handleLiquidate = () => {
    // Lógica para manejar la liquidación
  };

  return (
    <div className='liquidacion rounded'>
      <div className='d-flex justify-content-around'>
        <h1>Liquidación {tecnico.nombre}</h1>
        <h1 className='pointer' onClick={() => setModal(false)}>
          x
        </h1>
      </div>
      <div className='liq-table d-flex justify-content-evenly'>
        <div>
          <h2>Total:</h2>
        </div>
        <div>
          <h3>{tecnico.total}</h3>
        </div>
      </div>
      <button onClick={handleLiquidate}>Liquidar</button>
    </div>
  );
};
Liquidacion.propTypes = {
  tecnico: object,
  setModal: func,
};

export default Liquidacion;
