import Header from '../Header/Header';
import './NuevaCaja.css';
import { useState } from 'react';

const NuevaCaja = () => {
  const [formData, setFormData] = useState({
    denominacion: '',
    monto: '',
    cuenta: '',
    codigo_imputacion: '',
    efectivo: '',
    dolares: '',
    banco: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await guardarCaja(formData);
    if (success) {
      await guardarEfectivo({ efectivo: formData.efectivo });
      await guardarDolares({ dolares: formData.dolares });
      await guardarBanco({ banco: formData.banco });
      alert("Caja registrada con éxito!");
      setFormData({ denominacion: '', monto: '', cuenta: '', codigo_imputacion: '', efectivo: '', dolares: '', banco: '' });
    } else {
      alert("Error al registrar la caja.");
    }
  };

  const guardarCaja = async (caja) => {
    try {
      const response = await fetch("https://lv-back.online/cajas/guardar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(caja)
      });
      const result = await response.json();
      if (result) {
        console.log("Caja registrada con exito!!!");
        return true;
      } else {
        console.log("Se produjo un error, la caja no pudo ser registrada...");
        return false;
      }
    } catch (error) {
      console.error("Error al registrar la caja.", error);
    }
  };

  const guardarEfectivo = async (data) => {
    try {
      const response = await fetch("https://lv-back.online/efectivo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error("Error al registrar efectivo.", error);
    }
  };

  const guardarDolares = async (data) => {
    try {
      const response = await fetch("https://lv-back.online/dolares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error("Error al registrar dolares.", error);
    }
  };

  const guardarBanco = async (data) => {
    try {
      const response = await fetch("https://lv-back.online/banco", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error("Error al registrar banco.", error);
    }
  };

  return (
    <div>
      <div className='mt-5'>
        <Header text='Cajas y bancos' />
      </div>
      <div className='nuevaCaja-formulario'>
        <h2>Nueva caja/banco</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <h3>Denominación:</h3>
            <input
              type='text'
              name='denominacion'
              value={formData.denominacion}
              onChange={handleChange}
            />
            <span className='required'>*</span>
          </div>
          <div>
            <h3>Saldo inicial:</h3>
            <input
              type='text'
              name='monto'
              value={formData.monto}
              onChange={handleChange}
            />
          </div>
          <div>
            <h3>Cuenta:</h3>
            <input
              type='text'
              name='cuenta'
              value={formData.cuenta}
              onChange={handleChange}
            />
            <span className='required'>*</span>
          </div>
          <div>
            <h3>Código de imputación:</h3>
            <input
              type='text'
              name='codigo_imputacion'
              value={formData.codigo_imputacion}
              onChange={handleChange}
            />
            <span className='required'>*</span>
          </div>
          <div>
            <h3>Efectivo:</h3>
            <input
              type='text'
              name='efectivo'
              value={formData.efectivo}
              onChange={handleChange}
            />
          </div>
          <div>
            <h3>Dolares:</h3>
            <input
              type='text'
              name='dolares'
              value={formData.dolares}
              onChange={handleChange}
            />
          </div>
          <div>
            <h3>Banco:</h3>
            <input
              type='text'
              name='banco'
              value={formData.banco}
              onChange={handleChange}
            />
          </div>
          <div>
            <button type='submit'>Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevaCaja;
