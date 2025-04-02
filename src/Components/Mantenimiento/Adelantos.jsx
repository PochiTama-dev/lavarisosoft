import { useState, useEffect } from 'react';
import './Adelantos.css';
import { listaCajas, modificarCaja } from '../../services/cajasService';
import { guardarSaldoPendiente } from '../../services/saldosPendientesService';

const Adelantos = ({ tecnico, setModal }) => {
  const [selectedCaja, setSelectedCaja] = useState('');
  const [monto, setMonto] = useState('');
  const [cajas, setCajas] = useState([]);
  const [newModal, setNewModal] = useState(false);

  useEffect(() => {
    const fetchCajas = async () => {
      const response = await listaCajas();
      setCajas(response);
    };
    fetchCajas();
  }, []);

  const closeModal = () => {
    setModal(false);
  };

  const handleCajaChange = (event) => {
    setSelectedCaja(event.target.value);
    setMonto('');
  };

  const handleMontoChange = (event) => {
    const cajaSeleccionada = cajas.find((caja) => caja.id === parseInt(selectedCaja, 10));
    if (cajaSeleccionada && parseFloat(event.target.value) > cajaSeleccionada.monto) {
      alert(`El monto ingresado excede el monto disponible en la caja (${cajaSeleccionada.monto}).`);
      setMonto(cajaSeleccionada.monto.toString());
    } else {
      setMonto(event.target.value);
    }
  };

  const handleConfirmarAdelanto = async () => {
    setNewModal(!newModal);
    console.log(newModal);
    const cajaSeleccionada = cajas.find((caja) => caja.id === parseInt(selectedCaja, 10));
    if (!cajaSeleccionada) {
      alert('Por favor, seleccione una caja válida.');
      return;
    }

    if (parseFloat(monto) > cajaSeleccionada.monto) {
      alert(`El monto ingresado excede el monto disponible en la caja (${cajaSeleccionada.monto}).`);
      return;
    }

    const saldoPendiente = {
      id_caja: parseInt(selectedCaja, 10),
      monto: parseFloat(monto),
      id_tecnico: tecnico.empleadoId,
      tipo: 'adelanto',
    };

    console.log('Saldo Pendiente:', saldoPendiente);

    const result = await guardarSaldoPendiente(saldoPendiente);
    if (result) {
      alert('Adelanto registrado con éxito');

      const nuevasCajas = cajas.map((caja) => (caja.id === cajaSeleccionada.id ? { ...caja, monto: caja.monto - parseFloat(monto) } : caja));
      setCajas(nuevasCajas);

      await modificarCaja(cajaSeleccionada.id, {
        ...cajaSeleccionada,
        monto: cajaSeleccionada.monto - parseFloat(monto),
      });

      closeModal();
    } else {
      alert('Error al registrar el adelanto');
    }
  };

  return (
    <div>
      <div className='modal-content'>
        <span
          className='close'
          onClick={closeModal}
          style={{
            display: 'flex',
            justifyContent: 'end',
            marginRight: '40px',
            fontWeight: 'bold',
          }}
        >
          X
        </span>
        <h2>Adelanto: {tecnico.nombre}</h2>
        <div style={{ display: 'flex', justifyContent: 'start' }}>
          <label>
            Caja:
            <select value={selectedCaja} onChange={handleCajaChange} style={{ marginLeft: '10px' }}>
              <option value=''>Seleccione una caja</option>
              {cajas.map((caja) => (
                <option key={caja.id} value={caja.id}>
                  {caja.denominacion} (Disponible: {caja.monto})
                </option>
              ))}
            </select>
          </label>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'start',
            marginTop: '10px',
          }}
        >
          <label>
            Monto:
            <input type='number' value={monto} onChange={handleMontoChange} style={{ marginLeft: '10px' }} />
          </label>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '20px',
          }}
        >
          <button onClick={handleConfirmarAdelanto}>Confirmar</button>
        </div>
      </div>
    </div>
  );
};

export default Adelantos;
