import React, { useState, useEffect } from 'react';
import './nuevaOrden.css';

const NuevosDatosIncidente = ({ setIncidente }) => {
  const [repuestos, setRepuestos] = useState([]);
  const [nuevoRepuesto, setNuevoRepuesto] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [estados, setEstados] = useState([]);
  const [selectedEstado, setSelectedEstado] = useState("");
  const tiposEstados = async () => {
    try {
      const response = await fetch("https://lv-back.online/opciones/estado");
      const estados = await response.json();
      if (estados[0] !== undefined) {
        console.log(`Se encontró un listado con ${estados.length} tipos de estados!!`);
        console.log(estados);
        return estados;
      } else {
        console.log('Aún no se registra ningún tipo de estado...');
        return [];
      }
    } catch (error) {
      console.error("Error, no se encontraron tipos de estados en la base de datos....", error);
      return [];
    }
  };
  
  useEffect(() => {
    const fetchEstados = async () => {
      const estadosList = await tiposEstados();
      setEstados(estadosList);
    };

    fetchEstados();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setIncidente(prevState => ({ ...prevState, [id]: value, repuestos, id_tipo_estado: selectedEstado }));
  };

  const handleEstadoChange = (e) => {
    setSelectedEstado(e.target.value);
    setIncidente(prevState => ({ ...prevState, id_tipo_estado: e.target.value }));
  };

  const handleAdd = () => {
    if (nuevoRepuesto.trim() !== '') {
      const updatedRepuestos = [...repuestos, nuevoRepuesto];
      setRepuestos(updatedRepuestos);
      setIncidente(prevState => ({ ...prevState, repuestos: updatedRepuestos }));
      setNuevoRepuesto('');
      handleShow();
    }
  };

  const handleShow = () => {
    setShowInput(!showInput);
  };

  return (
    <div>
      <div className='row'>
        <div className='col-md-6'>
          <h3 className='m-4'>Datos del incidente</h3>
          <div className='mb-3 row align-items-center'>
            <label htmlFor='numero_orden' className='col-sm-2 col-form-label'>Número de Orden:</label>
            <div className='col-sm-8'>
              <input type='text' id='numero_orden' className='form-control input-small' onChange={handleInputChange} required />
            </div>
          </div>
          <div className='mb-3 row align-items-center'>
            <label htmlFor='equipo' className='col-sm-2 col-form-label'>Equipo:</label>
            <div className='col-sm-8'>
              <input type='text' id='equipo' className='form-control input-small' onChange={handleInputChange} required />
            </div>
          </div>
          <div className='mb-3 row align-items-center'>
            <label htmlFor='modelo' className='col-sm-2 col-form-label'>Modelo:</label>
            <div className='col-sm-8'>
              <input type='text' id='modelo' className='form-control input-small' onChange={handleInputChange} required />
            </div>
          </div>
          <div className='mb-3 row align-items-center'>
            <label htmlFor='marca' className='col-sm-2 col-form-label'>Marca:</label>
            <div className='col-sm-8'>
              <input type='text' id='marca' className='form-control input-small' onChange={handleInputChange} required />
            </div>
          </div>
          <div className='mb-3 row align-items-center'>
            <label htmlFor='antiguedad' className='col-sm-2 col-form-label'>Antiguedad:</label>
            <div className='col-sm-8'>
              <input type='text' id='antiguedad' className='form-control input-small' onChange={handleInputChange} required />
            </div>
          </div>
          <div className='mb-3 row align-items-center'>
            <label htmlFor='diagnostico' className='col-sm-2 col-form-label'>Diagnostico:</label>
            <div className='col-sm-8'>
              <textarea id='diagnostico' className='form-control input-small' onChange={handleInputChange} required></textarea>
            </div>
          </div>
          <div className='mb-3 row align-items-center'>
            <label htmlFor='estado' className='col-sm-2 col-form-label'>Estado:</label>
            <div className='col-sm-8'>
              <select id='estado' className='form-control' onChange={handleEstadoChange} required>
                <option value="">Seleccione un estado</option>
                {estados.map(estado => (
                  <option key={estado.id} value={estado.id}>
                    {estado.tipo_estado}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className='col-md-6 agregar-repuesto'>
          <h3>Repuestos</h3>
          <div className='d-flex flex-column'>
            {repuestos.map((item, index) => (
              <span className='mx-3 ' key={index}>
                {item}
              </span>
            ))}
          </div>
          {showInput && (
            <>
              <input
                type='text'
                value={nuevoRepuesto}
                onChange={(e) => setNuevoRepuesto(e.target.value)}
                placeholder='Nuevo repuesto'
                className='form-control input-small'
              />
              <button onClick={handleAdd} className='btn btn-primary mt-2'>Agregar</button>
            </>
          )}
          <h2 onClick={handleShow} className='agregarRepuesto mt-3'>
            +
          </h2>
        </div>
      </div>
    </div>
  );
};

export default NuevosDatosIncidente;
