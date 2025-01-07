import './mantenimiento.css';
import { object, func } from 'prop-types';
//import cash from '../../assets/cash-circulo.png';
//import edit from '../../assets/edit.png';
const Liquidacion = ({ tecnico, setModal }) => {
  console.log(tecnico);
  const handleLiquidate = () => {
    // Lógica para manejar la liquidación
  };

  return (
    <div className='liquidacion rounded'>
      <div className='d-flex justify-content-between'>
        <h1>Liquidación {tecnico.nombre}</h1>
        <h2 className='pointer' onClick={() => setModal(false)}>
          x
        </h2>
      </div>
      <div className='liq-table'>
        <div>
          <span>Total:</span>
          <span>Técnico domicilio:</span>
          <span>Técnico taller:</span>
          <span>Técnico entrega:</span>
        </div>
        <div>
          <input type='text' value={tecnico.ordenes.reduce((acumulador, orden) => acumulador + parseFloat(orden.total || 0), 0).toFixed(2)} />
          <input type='text' />
          <input type='text' />
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
