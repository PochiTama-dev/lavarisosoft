import './mantenimiento.css';
import { object, func } from 'prop-types';
import RemitoLiquidacion from './RemitoLiquidacion';
import { useState } from 'react';
const Liquidacion = ({ tecnico, setModal }) => {
  const [newModal, setNewModal] = useState(false);

  const handleLiquidate = () => {
    setNewModal(!newModal);
  };
  return (
    <div className='liquidacion rounded'>
      {!newModal && (
        <>
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
        </>
      )}
      {newModal && (
        <div>
          <RemitoLiquidacion tecnico={tecnico} setModal={setNewModal} />
        </div>
      )}
    </div>
  );
};
Liquidacion.propTypes = {
  tecnico: object,
  setModal: func,
};

export default Liquidacion;
