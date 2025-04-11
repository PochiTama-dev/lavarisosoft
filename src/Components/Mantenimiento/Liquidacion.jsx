import './mantenimiento.css';
import { useState, useEffect } from 'react';
import { func, object, any } from 'prop-types';
import { listaCajas } from '../../services/cajasService';
import { guardarLiquidacion } from '../../services/liquidacionesService';
import RemitoLiquidacion from './RemitoLiquidacion';
import { modificarCaja } from '../../services/cajasService';
const Liquidacion = ({ tecnico, totalLiquidacion, setModal }) => {
  //import RemitoLiquidacion from './RemitoLiquidacion';

  const [newModal, setNewModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [liqParcial, setLiqParcial] = useState('');
  const [selectedCaja, setSelectedCaja] = useState('');
  const [cajas, setCajas] = useState([]);

  useEffect(() => {
    const fetchCajas = async () => {
      const response = await listaCajas();
      setCajas(response);
    };
    fetchCajas();
  }, []);

  const handleLiquidate = async () => {
    if (!window.confirm('Seguro que desea realizar esta liquidacion')) return;
    try {
      const fecha = new Date().toISOString();
      const response = await guardarLiquidacion({
        id_tecnico: tecnico.Empleado.id,

        monto: liqParcial,
        created_at: fecha,
      });
      console.log('Liquidación guardada:', response);
      setNewModal(true);
      // setModal(false); // Removed to keep Liquidacion open for modal display
      const cajaSeleccionada = cajas.find((caja) => caja.id === parseInt(selectedCaja, 10));
      if (cajaSeleccionada) {
        const nuevoMonto = cajaSeleccionada.monto - (liqParcial ? liqParcial : tecnico.total);
        await modificarCaja(cajaSeleccionada.id, {
          ...cajaSeleccionada,
          monto: nuevoMonto,
        });
      }
    } catch (error) {
      console.error('Error al guardar la liquidación:', error);
    }
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
    if (!/[0-9]/.test(key) && !allowedKeys.includes(key)) {
      event.preventDefault();
    }
  };

  const handleCajaChange = (event) => {
    setSelectedCaja(event.target.value);
  };

  return (
    <div className='liquidacion rounded'>
      {!newModal && (
        <>
          <div className='d-flex justify-content-around' style={{ position: 'relative' }}>
            <h1 className='pointer' onClick={() => setModal(false)} style={{ position: 'absolute', top: '-40px', right: '-20px' }}>
              x
            </h1>
            <h3>
              Liquidación {tecnico.nombre} {tecnico.apellido}
            </h3>
          </div>
          <div className='liq-table d-flex justify-content-evenly'>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h4
                style={{
                  color: isDisabled ? 'gray' : 'initial',
                  border: isDisabled ? '1px solid gray' : 'initial',
                  textDecoration: isDisabled ? 'line-through' : 'initial',
                }}
              >
                Total:
              </h4>
              <label htmlFor='adelanto'>
                <h4>Liquidacion parcial</h4>
              </label>
              <label>
                <h4>Seleccionar Caja:</h4>
              </label>
              <label>
                <h4>Metodo de pago: </h4>
              </label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3
                style={{
                  color: isDisabled ? 'gray' : 'initial',
                  border: isDisabled ? '1px solid gray' : 'initial',
                  textDecoration: isDisabled ? 'line-through' : 'initial',
                }}
              >
                $ {totalLiquidacion}
              </h3>
              <input
                className='m-auto'
                style={{ height: '40px', fontSize: '30px' }}
                type='number'
                id='adelanto'
                max={totalLiquidacion}
                onChange={handleInputChange}
                onKeyDownCapture={handleKeyPress}
              />
              <select
                value={selectedCaja}
                onChange={handleCajaChange}
                style={{
                  backgroundColor: '#e6e6e6',
                  border: '1px solid black',
                  width: '250px',
                }}
              >
                <option value=''>Seleccione una caja</option>
                {cajas.map((caja) => (
                  <option key={caja.id} value={caja.id}>
                    {caja.denominacion} (Disponible: {caja.monto})
                  </option>
                ))}
              </select>
              <div>
                <h3>Metodo de pago</h3>
              </div>
            </div>
          </div>
          <div className='d-flex  mt-3' style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <button onClick={handleLiquidate} disabled={!selectedCaja}>
              Liquidar
            </button>
          </div>
        </>
      )}
      {newModal && (
        <div>
          <RemitoLiquidacion tecnico={tecnico} setModal={setNewModal} liqParcial={liqParcial} selectedCaja={selectedCaja} cajas={cajas} />
        </div>
      )}
    </div>
  );
};

Liquidacion.propTypes = {
  tecnico: object,
  totalLiquidacion: any,
  setModal: func,
  selectedCaja: any,
  cajas: any,
};

export default Liquidacion;
