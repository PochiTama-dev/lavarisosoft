import './mantenimiento.css';
import { object, func } from 'prop-types';
import RemitoLiquidacion from './RemitoLiquidacion';
import { useState } from 'react';
const Liquidacion = ({ tecnico, setModal }) => {
  const [newModal, setNewModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [liqParcial, setLiqParcial] = useState('');

  const handleLiquidate = () => {
    setNewModal(!newModal);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setLiqParcial(value);

    if (value) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  };
  const handleKeyPress = (event) => {
    const key = event.key;
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', '.', 'Shift', 'ArrowLeft', 'Home', 'Delete', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    //console.log(key);
    if (!/[0-9]/.test(key) && !allowedKeys.includes(key)) {
      event.preventDefault();
    }
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
              <h2 style={{ color: isDisabled ? 'gray' : 'initial', border: isDisabled ? '1px solid gray' : 'initial', textDecoration: isDisabled ? 'line-through' : 'initial' }}>Total:</h2>
              <label htmlFor='adelanto'>
                <h2>Liquidacion parcial</h2>
              </label>
            </div>
            <div>
              <h3 style={{ color: isDisabled ? 'gray' : 'initial', border: isDisabled ? '1px solid gray' : 'initial', textDecoration: isDisabled ? 'line-through' : 'initial' }}>
                {tecnico.total - tecnico.adelanto}
              </h3>
              <input
                className='m-auto '
                style={{ height: '40px', fontSize: '30px' }}
                type='number'
                name=''
                id='adelanto'
                max={tecnico.total - tecnico.adelanto}
                onChange={handleInputChange}
                onKeyDownCapture={handleKeyPress}
              />
            </div>
          </div>
          <button onClick={handleLiquidate}>Liquidar</button>
        </>
      )}
      {newModal && (
        <div>
          <RemitoLiquidacion tecnico={tecnico} setModal={setNewModal} liqParcial={liqParcial} />
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
