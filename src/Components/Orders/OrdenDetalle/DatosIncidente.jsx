import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useCustomContext } from '../../../hooks/context';

const DatosIncidente = ({ equipo, modelo, antiguedad, diagnostico, repuestosSeleccionados }) => {
  const [repuestos, setRepuestos] = useState([]);
  const [nuevoRepuesto, setNuevoRepuesto] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRepuesto, setSelectedRepuesto] = useState();

  const { listaRepuestos } = useCustomContext();

  useEffect(() => {
    fetchRepuestos();
  }, []);

  const fetchRepuestos = async () => {
    setRepuestos(await listaRepuestos());
  };

  const handleAdd = () => {
    if (selectedRepuesto) {
      setNuevoRepuesto((prevRepuestos) => [...prevRepuestos, selectedRepuesto]);
      setSelectedRepuesto(null); // Limpia el repuesto seleccionado después de agregarlo
      setSearchTerm('');
      handleShow(); // Cierra el input de búsqueda
    }
  };
  const handleSelect = (repuesto) => {
    setSelectedRepuesto(repuesto);
    setSearchTerm(repuesto.descripcion);
    repuestosSeleccionados.push(repuesto);
  };

  const handleShow = () => {
    setShowInput(!showInput);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredRepuestos = repuestos.filter((repuesto) => repuesto.descripcion.toLowerCase().includes(searchTerm));

  return (
    <div>
      <div className='row align-items-start'>
        <div className='col-md-6'>
          <h3 className='ms-5 mt-3'>Datos del incidente</h3>
          <div className='row mb-3'>
            <label className='col-sm-3 col-form-label'>Equipo:</label>
            <div className='col-sm-8 d-flex align-items-center'>
              <input type='text' value={equipo} disabled className='form-control rounded mx-2 ' />
            </div>
          </div>
          <div className='row mb-3'>
            <label className='col-sm-3 col-form-label'>Modelo:</label>
            <div className='col-sm-8 d-flex align-items-center'>
              <input type='text' value={modelo} disabled className='form-control rounded mx-2' />
            </div>
          </div>
          <div className='row mb-3'>
            <label className='col-sm-3 col-form-label'>Antigüedad:</label>
            <div className='col-sm-8 d-flex align-items-center'>
              <input type='text' value={antiguedad} disabled className='form-control rounded mx-2' />
            </div>
          </div>
          <div className='row mb-3'>
            <label className='col-sm-3 col-form-label'>Diagnóstico:</label>
            <div className='col-sm-8 d-flex align-items-center'>
              <textarea disabled className='form-control rounded mx-2' defaultValue={diagnostico}></textarea>
            </div>
          </div>
        </div>
        <div className='col-md-6'>
          <h3>Repuestos</h3>
          {nuevoRepuesto && nuevoRepuesto.map((repuesto, i) => <li key={i}>{repuesto.descripcion}</li>)}
          {showInput && (
            <>
              <input type='text' className='form-control mb-2' placeholder='Buscar repuesto...' onChange={handleSearch} value={searchTerm} />
              <ul className='ulRepuestos'>
                {filteredRepuestos.map((repuesto) => (
                  <li className='mx-3 mb-2 pointer' key={repuesto.id} value={repuesto.id} onClick={() => handleSelect(repuesto)}>
                    {repuesto.descripcion}
                  </li>
                ))}
              </ul>
              <button onClick={handleAdd} className='btn btn-primary'>
                Agregar
              </button>
            </>
          )}
          <h2 onClick={handleShow} className='agregarRepuesto'>
            +
          </h2>
        </div>
      </div>
    </div>
  );
};

DatosIncidente.propTypes = {
  equipo: PropTypes.string.isRequired,
  modelo: PropTypes.string.isRequired,
  antiguedad: PropTypes.string.isRequired,
  diagnostico: PropTypes.string,
  repuestosSeleccionados: PropTypes.array,
};

export default DatosIncidente;
