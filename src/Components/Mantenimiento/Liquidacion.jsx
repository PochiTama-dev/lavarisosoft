import './mantenimiento.css';
import { useState, useEffect } from 'react';
import { func, object, any } from 'prop-types';
import { listaCajas } from '../../services/cajasService';
import { guardarLiquidacion } from '../../services/liquidacionesService';
import RemitoLiquidacion from './RemitoLiquidacion';
import { modificarCaja } from '../../services/cajasService';
import fetchDolarBlue from '../../services/ApiDolarService';

const Liquidacion = ({ tecnico, totalLiquidacion, setModal }) => {
  const [newModal, setNewModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setIsDisabled] = useState(false);
  const [selectedCaja, setSelectedCaja] = useState('');
  const [cajas, setCajas] = useState([]);
  const [efectivo, setEfectivo] = useState('');
  const [dolares, setDolares] = useState('');
  const [banco, setBanco] = useState('');
  const [codigoImputacion, setCodigoImputacion] = useState('');
  const [dolarBlueRate, setDolarBlueRate] = useState(0);

  useEffect(() => {
    const fetchCajas = async () => {
      const response = await listaCajas();
      setCajas(response);
    };
    fetchCajas();

    const fetchDolarRate = async () => {
      const rate = await fetchDolarBlue();
      setDolarBlueRate(rate);
    };
    fetchDolarRate();
  }, []);

  const handleLiquidate = async () => {
    const total = (parseFloat(efectivo) || 0) + (parseFloat(banco) || 0) + (parseFloat(dolares) || 0) * dolarBlueRate;
    if (total > totalLiquidacion) {
      alert('El monto total no puede ser mayor al monto a liquidar.');
      return;
    }
    if (!window.confirm('Seguro que desea realizar esta liquidacion')) return;
    try {
      const fecha = new Date().toISOString();
      const response = await guardarLiquidacion({
        id_tecnico: tecnico.Empleado.id,
        id_caja: selectedCaja,
        monto: total,
        efectivo: parseFloat(efectivo) || 0,
        dolares: parseFloat(dolares) || 0,
        transferencia: parseFloat(banco) || 0,
        codigo_imputacion: codigoImputacion,
        created_at: fecha,
      });
      console.log('Liquidación guardada:', response);
      setNewModal(true);
      const cajaSeleccionada = cajas.find((caja) => caja.id === parseInt(selectedCaja, 10));
      if (cajaSeleccionada) {
        const nuevoEfectivo = (parseFloat(cajaSeleccionada.efectivo) || 0) - (parseFloat(efectivo) || 0);
        const nuevoDolares = (parseFloat(cajaSeleccionada.dolares) || 0) - (parseFloat(dolares) || 0);
        const nuevoBanco = (parseFloat(cajaSeleccionada.banco) || 0) - (parseFloat(banco) || 0);

        await modificarCaja(cajaSeleccionada.id, {
          ...cajaSeleccionada,
          efectivo: nuevoEfectivo,
          dolares: nuevoDolares,
          banco: nuevoBanco,
        });
      }
    } catch (error) {
      console.error('Error al guardar la liquidación:', error);
    }
  };

  const handleCajaChange = (event) => {
    setSelectedCaja(event.target.value);
    const cajaSeleccionada = cajas.find((caja) => caja.id === parseInt(event.target.value, 10));
    if (!cajaSeleccionada) {
      setEfectivo('');
      setBanco('');
      setDolares('');
    }
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4
                  style={{
                    color: isDisabled ? 'gray' : 'initial',
                    border: isDisabled ? '1px solid gray' : 'initial',
                    textDecoration: isDisabled ? 'line-through' : 'initial',
                  }}
                >
                  A liquidar:
                </h4>
                <h3
                  style={{
                    color: isDisabled ? 'gray' : 'initial',
                    border: isDisabled ? '1px solid gray' : 'initial',
                    textDecoration: isDisabled ? 'line-through' : 'initial',
                  }}
                >
                  $ {totalLiquidacion}
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label>
                  <h4>Seleccionar Caja:</h4>
                </label>
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
                  {cajas.map((caja) => {
                    /*                     const disponible = (parseFloat(caja.efectivo || 0) + parseFloat(caja.banco || 0)) || 0;
                     */ return (
                      <option key={caja.id} value={caja.id}>
                        {caja.denominacion} {/* (Disponible: {disponible}) */}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label>
                  <h4>Efectivo:</h4>
                  Disponible: ${parseFloat(cajas.find((caja) => caja.id === parseInt(selectedCaja, 10))?.efectivo || 0)}
                </label>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <input type='number' value={efectivo} onChange={(e) => setEfectivo(parseFloat(e.target.value) || 0)} style={{ height: '40px', fontSize: '20px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label>
                  <h4>Transferencia:</h4>
                  Disponible: ${parseFloat(cajas.find((caja) => caja.id === parseInt(selectedCaja, 10))?.banco || 0)}
                </label>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <input type='number' value={banco} onChange={(e) => setBanco(parseFloat(e.target.value) || 0)} style={{ height: '40px', fontSize: '20px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label>
                  <h4>Dólares:</h4>
                  Disponible: ${parseFloat(cajas.find((caja) => caja.id === parseInt(selectedCaja, 10))?.dolares || 0)}
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <input type='number' value={dolares} onChange={(e) => setDolares(parseFloat(e.target.value) || 0)} style={{ height: '40px', fontSize: '20px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label>
                  <h4>Total:</h4>
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span
                    style={{
                      height: '40px',
                      fontSize: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 10px',
                    }}
                  >
                    $ {(parseFloat(efectivo || 0) + parseFloat(banco || 0) + parseFloat(dolares || 0) * dolarBlueRate).toFixed(2)}
                  </span>
                  {parseFloat(efectivo || 0) + parseFloat(banco || 0) + parseFloat(dolares || 0) * dolarBlueRate > totalLiquidacion && (
                    <span style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>El monto seleccionado es mayor al monto a liquidar.</span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label>
                  <h4>Código de Imputación:</h4>
                </label>
                <input type='text' value={codigoImputacion} onChange={(e) => setCodigoImputacion(e.target.value)} style={{ height: '40px', fontSize: '20px' }} />
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
          <RemitoLiquidacion tecnico={tecnico} setModal={setNewModal} liqParcial={''} selectedCaja={selectedCaja} cajas={cajas} />
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
