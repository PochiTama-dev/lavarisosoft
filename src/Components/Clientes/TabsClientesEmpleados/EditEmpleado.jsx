import { func, object } from 'prop-types';
import { Suspense, useState } from 'react';
import { useCustomContext } from '../../../hooks/context';

const EditEmpleado = ({ empleado, setModal, setEmpleado }) => {
  const { editEmpleado } = useCustomContext();
  const [suggestions, setSuggestions] = useState([]);
  const [porcentaje, setPorcentaje] = useState(empleado.porcentaje_arreglo);

  const handleChange = (event) => {
    setPorcentaje(event.target.value);
  };

  /* const handlePut = async (empleado) => {
    const parsedPorcentaje = parseFloat(porcentaje) / 100;
    if (isNaN(parsedPorcentaje)) {
      alert('Por favor, ingrese un número válido.');
      return;
    }
    empleado.porcentaje_arreglo = parsedPorcentaje;
    await editPorcentajeEmpleado(empleado.id, empleado);
    setModal(false);
  }; */

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setEmpleado((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleSuggestions = async (event) => {
    handleInputChange(event);
    const ARGENTINA_BOUNDS = [-73.415, -55.25, -53.628, -21.832];
    const geoApiKey = 'c7778bb5bb994ac88ff65b8732e2cbdf';
    const defaultCenter = [-31.4166867, -64.1834193];
    const query = event.target.value;
    if (query) {
      try {
        setTimeout(async () => {
          const response = await fetch(
            `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&apiKey=${geoApiKey}&bias=proximity:${defaultCenter.join(',')}&bbox=${ARGENTINA_BOUNDS.join(',')}&limit=5`
          );
          const data = await response.json();
          if (data.features && data.features.length > 0) {
            setSuggestions(data.features);
          } else {
            setSuggestions([]);
          }
        }, 1000);
      } catch (error) {
        console.error('Error fetching geocode:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (coordinates, suggestion) => {
    const [lon, lat] = coordinates;
    empleado.latitud = lat;
    empleado.longitud = lon;
    setSuggestions([]);
    setEmpleado((prevState) => ({ ...prevState, direccion: suggestion.properties.address_line2 }));
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const parsedPorcentaje = parseFloat(porcentaje) / 100;
    if (isNaN(parsedPorcentaje)) {
      alert('Por favor, ingrese un número válido.');
      return;
    }
    empleado.porcentaje_arreglo = parsedPorcentaje;
    const empleadoData = {
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      cuil: empleado.cuil,
      telefono: empleado.telefono,
      email: empleado.email,
      direccion: empleado.direccion,
      porcentaje_arreglo: empleado.porcentaje_arreglo,
    };
    await editEmpleado(empleado.id, empleadoData);
  };

  return (
    <div className='modal show d-block' tabIndex='-1' role='dialog'>
      <div className='modal-dialog modal-lg' role='document'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>Editar Empleado</h5>
          </div>
          <div className='modal-body'>
            <div className='container'>
              <div className='row'>
                <div className='col-md-6 mb-3'>
                  <label htmlFor='cuil'>CUIL:</label>
                  <input type='text' id='cuil' className='form-control' value={empleado.cuil || ''} onChange={handleInputChange} required />
                </div>
                <div className='col-md-6 mb-3'>
                  <label htmlFor='telefono'>Teléfono:</label>
                  <input type='text' id='telefono' className='form-control' value={empleado.telefono || ''} onChange={handleInputChange} required />
                </div>
                <div className='col-md-6 mb-3'>
                  <label htmlFor='email'>Email:</label>
                  <input type='text' id='email' className='form-control' value={empleado.email || ''} onChange={handleInputChange} required />
                </div>
                <div className='col-md-6 mb-3'>
                  <label htmlFor='direccion'>Dirección:</label>
                  <input type='text' id='direccion' className='form-control' value={empleado.direccion || ''} onChange={handleSuggestions} required />
                  <Suspense fallback={<>Cargando...</>}>
                    {suggestions.length > 0 && (
                      <div className='suggestions-box-modal'>
                        {suggestions.map((suggestion, index) => {
                          const coordinates = suggestion.geometry.coordinates;
                          return (
                            <div key={index} className='suggestion-item pointer' onClick={() => handleSuggestionClick(coordinates, suggestion)}>
                              {suggestion.properties.formatted}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </Suspense>
                </div>
                <div className='col-md-6 mb-3'>
                  <label>Porcentaje Arreglo:</label>
                  <input className='form-control' type='text' value={porcentaje < 1 ? porcentaje * 100 : porcentaje} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>
          <div className='modal-footer'>
            <button type='button' className='btn btn-secondary' onClick={() => setModal(false)}>
              Cerrar
            </button>
            <button type='button' className='btn btn-success' onClick={handleEdit}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

EditEmpleado.propTypes = {
  empleado: object,
  setEmpleado: func,
  setModal: func,
};

export default EditEmpleado;
