import { useState, useEffect, useRef, Suspense } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import '../clientesEmpleados.css';
import clientesDb from './clientesData';
import editar from '../../../images/editar.webp';

const Clientes = () => {
  const [clientesData, setClientesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState();
  const [editClient, setEditClient] = useState();
  const [modal, setModal] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [ubicacion, setUbicacion] = useState(',Cordoba,Argentina');
  const [reload, setReload] = useState(false);
  const suggestionsRef = useRef();

  useEffect(() => {
    const fetchClientesData = async () => {
      try {
        const data = await clientesDb();
        setClientesData(data);
      } catch (error) {
        console.error('Error fetching clientes data:', error);
        setClientesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClientesData();
  }, [reload]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleShowOrders = (index) => {
    console.log(clientesData[index].Ordenes);
    console.log(index);
    setActive(active === index ? null : index);
  };

  const handleEdit = (client) => {
    //console.log('Edit button clicked');
    //console.log(client);
    setEditClient(client);
    setModal(!modal);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditClient({ ...editClient, [name]: value });
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
    console.log(coordinates);
    const [lon, lat] = coordinates;
    editClient.latitud = lat;
    editClient.longitud = lon;
    setUbicacion(sugestion);
    setEditClient({ ...editClient, direccion: sugestion });
    setSuggestions([]);
  };

  const handleUpdateClient = async () => {
    const updatedClient = {
      ...editClient,
      ubicacion: ubicacion,
    };
    console.log('Updated client:', updatedClient);
    //numero_cliente, nombre, apellido, cuil, telefono, direccion, ubicacion, longitud, latitud, piso, departamento
    try {
      await fetch(`https://lv-back.online/clientes/modificar/${editClient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedClient),
      });
      setReload(!reload);
      setModal(!modal);
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };
  const modalEdit = (
    <div className='modal show d-block' tabIndex='-1' role='dialog'>
      <div className='modal-dialog modal-lg' role='document'>
        {/* Cambiado a modal-lg para hacerlo más grande */}
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>Editar cliente</h5>
          </div>
          <div className='modal-body'>
            <div className='container'>
              <div className='row'>
                {/* Primera fila */}
                <div className='col-md-6 mb-3'>
                  <label>N° Cliente:</label>
                  <input type='text' name='numero_cliente' className='form-control' value={editClient?.numero_cliente} onChange={handleInputChange} />
                </div>
                <div className='col-md-6 mb-3'>
                  <label>Nombre:</label>
                  <input type='text' name='nombre' className='form-control' value={editClient?.nombre} onChange={handleInputChange} />
                </div>
                {/* Segunda fila */}
                <div className='col-md-6 mb-3'>
                  <label>Apellido:</label>
                  <input type='text' name='apellido' className='form-control' value={editClient?.apellido} onChange={handleInputChange} />
                </div>
                <div className='col-md-6 mb-3'>
                  <label>Dirección:</label>
                  <input type='text' name='direccion' className='form-control' value={editClient?.direccion} onChange={handleSuggestions} />
                  {/* Renderizado de las sugerencias */}
                  <div ref={suggestionsRef} className='suggestions-box-modal'>
                    <Suspense fallback={<>Cargando...</>}>
                      {suggestions.length > 0 && (
                        <div className='suggestions-list'>
                          {suggestions.map((suggestion, index) => {
                            const coordinates = suggestion.geometry.coordinates;
                            const formattedAddress = suggestion.properties.formatted;

                            return (
                              <div key={index} className='suggestion-item pointer' onClick={() => handleSuggestionClick(coordinates, formattedAddress)}>
                                {formattedAddress}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </Suspense>
                  </div>
                </div>
                {/* Tercera fila */}
                <div className='col-md-6 mb-3'>
                  <label>Piso:</label>
                  <input type='number' name='piso' className='form-control' value={editClient?.piso || 0} onChange={handleInputChange} />
                </div>
                <div className='col-md-6 mb-3'>
                  <label>Departamento:</label>
                  <input type='text' name='departamento' className='form-control' value={editClient?.departamento || ''} onChange={handleInputChange} />
                </div>
                {/* Cuarta fila */}
                <div className='col-md-6 mb-3'>
                  <label>Teléfono:</label>
                  <input type='text' name='telefono' className='form-control' value={editClient?.telefono} onChange={handleInputChange} />
                </div>
                <div className='col-md-6 mb-3'>
                  <label>CUIL/CUIT:</label>
                  <input type='text' name='cuil' className='form-control' value={editClient?.cuil} onChange={handleInputChange} />
                </div>
              </div>
            </div>
          </div>
          <div className='modal-footer'>
            <button type='button' className='btn btn-secondary' onClick={() => setModal(!modal)}>
              Cerrar
            </button>
            <button type='button' className='btn btn-primary' onClick={handleUpdateClient}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className='clientes-ctn'>
      <Table striped hover>
        <thead>
          <tr>
            <th className='text-nowrap'>Nombre</th>
            <th className='text-nowrap'>Apellido</th>
            <th className='text-nowrap'>Numero de cliente</th>
            <th className='text-nowrap'>Telefono</th>
            <th className='text-nowrap'>Direccion</th>
            <th className='text-nowrap'>Orden Asignada</th>
            {/* <th className='text-nowrap'>Dato B</th>
            <th className='text-nowrap'>Dato C</th>
            <th className='text-nowrap'>WhatsApp</th> */}
          </tr>
        </thead>
        <tbody>
          {clientesData.map((cliente, index) => (
            <>
              <tr key={index}>
                <td>{cliente.nombre}</td>
                <td>{cliente.apellido}</td>
                <td>CL-{cliente.numero_cliente}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.direccion}</td>
                <td className='flecha' onClick={() => handleShowOrders(index)}>
                  {cliente.Ordenes && `${cliente.Ordenes.length} ${active === index ? '▲' : '▼'}`}
                </td>
                <td>
                  <img onClick={() => handleEdit(cliente)} className='editButton' src={editar} alt='' />
                </td>
                {/* <td>{cliente.datoB}</td>
              <td>{cliente.datoC}</td>
              <td>{cliente.whatsapp}</td> */}
              </tr>
              {active === index && (
                <>
                  <tr key={index} onClick={() => handleShowOrders(index)} className='bg-primary-subtle flecha'>
                    <th className='text-nowrap'>Antiguedad</th>
                    <th className='text-nowrap'>Equipo</th>
                    <th className='text-nowrap'>Marca</th>
                    <th className='text-nowrap'>Modelo</th>
                    <th className='text-nowrap'>Diagnostico</th>
                    <th className='text-nowrap'></th>
                  </tr>
                  {cliente.Ordenes.map((orden, orderIndex) => (
                    <tr key={orderIndex} onClick={() => handleShowOrders(index)} className='bg-primary-subtle flecha'>
                      <td>{orden.antiguedad}</td>
                      <td>{orden.equipo}</td>
                      <td>{orden.marca}</td>
                      <td>{orden.modelo}</td>
                      <td>{orden.diagnostico}</td>
                      <td></td>
                    </tr>
                  ))}
                </>
              )}
            </>
          ))}
        </tbody>
      </Table>
      {modal && modalEdit}
    </div>
  );
};

export default Clientes;
