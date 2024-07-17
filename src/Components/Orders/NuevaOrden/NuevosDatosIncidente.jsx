import { useState, useEffect } from 'react';
import './nuevaOrden.css';

const NuevosDatosIncidente = ({ setIncidente }) => {
  const [repuestos, setRepuestos] = useState([]);
  const [nuevoRepuesto, setNuevoRepuesto] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [estados, setEstados] = useState([]);
  const [selectedEstado, setSelectedEstado] = useState(4);
  const [numeroOrden, setNumeroOrden] = useState('');
  const [showMore, setShowMore] = useState(false);
  const handleShowMore = () => {
    setShowMore(!showMore);
  };
  const listadoOrdenes = async () => {
    try {
      const response = await fetch("https://lv-back.online/ordenes/listado");
      const ordenes = await response.json();
      if (ordenes[0] !== undefined) {
        console.log(`Se encontró un listado con ${ordenes.length} ordenes!!`);
        return ordenes;
      } else {
        console.log('Aún no se registra ninguna orden...');
        return [];
      }
    } catch (error) {
      console.error("Error, no se encontraron ordenes en la base de datos....", error);
      return [];
    }
  };

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

    const fetchNumeroOrden = async () => {
      const ordenesList = await listadoOrdenes();
      if (ordenesList.length > 0) {
        const maxNumeroOrden = Math.max(...ordenesList.map(o => o.numero_orden));
        setNumeroOrden(maxNumeroOrden + 1);
        setIncidente(prevState => ({ ...prevState, numero_orden: maxNumeroOrden + 1 }));
      } else {
        setNumeroOrden(1);
        setIncidente(prevState => ({ ...prevState, numero_orden: 1 }));
      }
    };

    fetchEstados();
    fetchNumeroOrden();
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
            <label htmlFor='numero_orden' className='col-sm-2 col-form-label'>N° Orden:</label>
            <div className='col-sm-8'>
              <input 
                type='text' 
                id='numero_orden' 
                className='form-control input-small' 
                value={numeroOrden} 
                onChange={handleInputChange} 
                readOnly 
                required 
              />
            </div>
          </div>
          <div className='mb-3 row align-items-center'>
            <label htmlFor='equipo' className='col-sm-2 col-form-label'>Equipo:</label>
            <div className='col-sm-8'>
              <input type='text' id='equipo' className='form-control input-small' onChange={handleInputChange} required />
            </div>
          </div>

  
          {showMore && (
            <>
              <div className='mb-3 row align-items-center'>
                <label htmlFor='marca' className='col-sm-2 col-form-label'>Marca:</label>
                <div className='col-sm-8'>
                  <input type='text' id='marca' className='form-control input-small' onChange={handleInputChange} required />
                </div>
              </div>
              <div className='mb-3 row align-items-center'>
                <label htmlFor='modelo' className='col-sm-2 col-form-label'>Modelo:</label>
                <div className='col-sm-8'>
                  <input type='text' id='modelo' className='form-control input-small' onChange={handleInputChange} required />
                </div>
              </div>
              <div className='mb-3 row align-items-center'>
                <label htmlFor='diagnostico' className='col-sm-2 col-form-label'>Diagnóstico:</label>
                <div className='col-sm-8'>
                  <textarea id='diagnostico' className='form-control input-small' onChange={handleInputChange} required></textarea>
                </div>
              </div>
              <div className='mb-3 row align-items-center'>
                <label htmlFor='estado' className='col-sm-2 col-form-label'>Estado:</label>
                <div className='col-sm-8'>
                  <select id='estado' className='form-control' onChange={handleEstadoChange} value={selectedEstado} required>
                    <option value="">Seleccione un estado</option>
                    {estados.map(estado => (
                      <option key={estado.id} value={estado.id}>
                        {estado.tipo_estado}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Botón 'Ver más' */}
          <div className='mb-3 row'>
            <div className='col-sm-10 offset-sm-2'>
              <button className='bg-primary rounded-pill text-white papelitoButton' onClick={handleShowMore}>
                {showMore ? 'Ver menos' : 'Ver más'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NuevosDatosIncidente;