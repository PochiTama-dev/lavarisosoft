import { Suspense, useEffect, useState } from 'react';
import { listaClientes } from '../../services/clienteService';
import Header from '../Header/Header';
import { useCustomContext } from '../../hooks/context';

const UploadCliente = () => {
  const { postCliente } = useCustomContext();
  const [nroCliente, setNroCliente] = useState([]);
  const [cliente, setCliente] = useState({
    numero_cliente: '',
    nombre: '',
    apellido: '',
    cuil: '',
    telefono: '',
    direccion: '',
    ubicacion: '',
    longitud: '',
    latitud: '',
    piso: '',
    departamento: '',
  });
  const [suggestions, setSuggestions] = useState([]);
  const [ubicacion, setUbicacion] = useState(',Cordoba,Argentina');
  useEffect(() => {
    getClientes();
  }, []);

  const getClientes = async () => {
    const allClients = await listaClientes();
    console.log(allClients);

    // Filtrar el cliente con el número más alto en "numero_cliente"
    const clienteConNumeroMasAlto = allClients.reduce((max, cliente) => {
      return Number(cliente.numero_cliente) > Number(max.numero_cliente) ? cliente : max;
    }, allClients[0]); // Inicializamos con el primer cliente del array

    //console.log('Cliente con el número más alto:', clienteConNumeroMasAlto);

    setNroCliente(clienteConNumeroMasAlto);
  };
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    console.log(id);
    console.log(value);

    setCliente((prevState) => ({ ...prevState, [id]: value }));
    setUbicacion(() => value);
    console.log(ubicacion);
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
          //const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&apiKey=${geoApiKey}&limit=10`);
          const response = await fetch(
            `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&apiKey=${geoApiKey}&bias=proximity:${defaultCenter.join(',')}&bbox=${ARGENTINA_BOUNDS.join(',')}&limit=5`
          );
          const data = await response.json();
          if (data.features && data.features.length > 0) {
            setSuggestions(data.features);
          } else {
            setSuggestions([]);
          }
        }, '1000');
      } catch (error) {
        console.error('Error fetching geocode:', error);
      }
    } else {
      setSuggestions([]);
    }
  };
  const handleSuggestionClick = (coordinates, sugestion) => {
    console.log(sugestion);
    const [lon, lat] = coordinates;
    cliente.latitud = lat;
    cliente.longitud = lon;
    setUbicacion(`${sugestion.properties.address_line1},${sugestion.properties.city},Argentina`);
    setSuggestions([]);
    setCliente((prevState) => ({ ...prevState, direccion: sugestion.properties.address_line2 }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    cliente.numero_cliente = Number(nroCliente.numero_cliente + 1);
    try {
      await postCliente(cliente);
      alert('Cliente guardado correctamente');
    } catch (error) {
      console.error('Error al guardar el cliente:', error);
      alert('Error al guardar el cliente');
    }
  };
  return (
    <div style={{ marginTop: '6%', marginLeft: '2%' }}>
      <Header text='Cargar Cliente' />
      <h3 className='text-center'>Cliente</h3>
      <div className='row'>
        <div className='row'>
          <div className='col-md-6'>
            <div className='mb-3 row align-items-center'>
              <label htmlFor='numero_cliente' className='col-sm-2 text-left'>
                N° Cliente:
              </label>
              <div className='col-sm-8'>
                <input type='text' id='numero_cliente' className='form-control input-small' value={Number(nroCliente.numero_cliente + 1)} onChange={handleInputChange} required disabled />
              </div>
            </div>
            <div className='mb-3 row align-items-center'>
              <label htmlFor='nombre' className='col-sm-2 text-left'>
                Nombre:
              </label>
              <div className='col-sm-8'>
                <input type='text' id='nombre' className='form-control input-small' value={cliente.nombre || ''} onChange={handleInputChange} required />
              </div>
            </div>
            <div className='mb-3 row align-items-center'>
              <label htmlFor='apellido' className='col-sm-2 text-left'>
                Apellido:
              </label>
              <div className='col-sm-8'>
                <input type='text' id='apellido' className='form-control input-small' value={cliente.apellido || ''} onChange={handleInputChange} required />
              </div>
            </div>
            <div className='mb-3 row align-items-center'>
              <label htmlFor='cuil' className='col-sm-2 text-left'>
                CUIL:
              </label>
              <div className='col-sm-8'>
                <input type='text' id='cuil' className='form-control input-small' value={cliente.cuil || ''} onChange={handleInputChange} required />
              </div>
            </div>
          </div>
          <div className='col-md-6'>
            <div className='mb-3 row align-items-center'>
              <label htmlFor='telefono' className='col-sm-3 text-left'>
                Teléfono:
              </label>
              <div className='col-sm-8'>
                <input type='text' id='telefono' className='form-control input-small' value={cliente.telefono || ''} onChange={handleInputChange} required />
              </div>
            </div>
            <div className='mb-3 row align-items-center'>
              <label htmlFor='ubicacion' className='col-sm-3 text-left'>
                Ubicacion:
              </label>
              <div className='col-sm-8'>
                <input type='text' id='ubicacion' className='form-control input-small' value={cliente.ubicacion || ''} onChange={handleInputChange} required />
              </div>
            </div>
            <div className='mb-3 row align-items-center'>
              <label htmlFor='piso' className='col-sm-3 text-left'>
                Piso:
              </label>
              <div className='col-sm-8'>
                <input type='number' id='piso' className='form-control input-small' value={cliente.piso || ''} onChange={handleInputChange} required />
              </div>
            </div>
            <div className='mb-3 row align-items-center'>
              <label htmlFor='departamento' className='col-sm-3 text-left'>
                Departamento:
              </label>
              <div className='col-sm-8'>
                <input type='text' id='departamento' className='form-control input-small' value={cliente.departamento || ''} onChange={handleInputChange} required />
              </div>
            </div>
            <div className='mb-3 row align-items-center'>
              <label htmlFor='direccion' className='col-sm-3 text-left'>
                Direccion:
              </label>
              <div className='col-sm-8'>
                <input type='text' id='direccion' className='form-control input-small' value={cliente.direccion || ''} onChange={handleSuggestions} required />
              </div>
              <Suspense fallback={<>Cargando...</>}>
                {suggestions.length > 0 && (
                  <>
                    {suggestions.map((suggestion, index) => {
                      const coordinates = suggestion.geometry.coordinates;

                      return (
                        <div key={index} className='suggestion-item pointer' onClick={() => handleSuggestionClick(coordinates, suggestion)}>
                          {suggestion.properties.formatted}
                        </div>
                      );
                    })}
                  </>
                )}
              </Suspense>
            </div>
            <button type='button' className='btn btn-primary' onClick={handleSubmit}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UploadCliente;
