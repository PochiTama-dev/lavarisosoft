import { useState, useEffect, useRef } from 'react';
import Header from '../Header/Header';
import Map from './Map';
import './Ubicaciones.css';
import { haversine } from './calcularDistancia';
import { ordenes } from "../../services/ordenesService";
import { listaClientes } from "../../services/clienteService";
import { listadoEmpleados } from "../../services/empleadoService";
import socket from '../services/socketService';
const Ubicaciones = () => {
  const [showTareas, setShowTareas] = useState({});
  const [view, setView] = useState('clientesTecnicos'); // Estado para controlar la vista inicial
  const [clientes, setClientes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [selectedClient, setSelectedClient] = useState([]);
  const [selectedTecnico, setSelectedTecnico] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTec, setSearchTec] = useState('');
  const [showAllClientes, setShowAllClientes] = useState(false);
  const [showAllTecnicos, setShowAllTecnicos] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState('');
  const [position, setPosition] = useState({
    latitude: '-31.67750630032039',
    longitude: '-65.4105635773489',
  });
  const [filterTec, setFilterTec] = useState(tecnicos);
  const ref = useRef();
 
  const [tecnicosStatus, setTecnicosStatus] = useState({});
  const [loggedInUsers, setLoggedInUsers] = useState(new Set());
 
  useEffect(() => {
    // Leer estado de conexión de los técnicos desde localStorage
    const storedTecnicosStatus = JSON.parse(localStorage.getItem('tecnicosStatus'));
    if (storedTecnicosStatus) {
      setTecnicosStatus(storedTecnicosStatus);
    }

    const handleUserStatus = (technicians) => {
      const newStatus = {};
      for (const [id, technician] of Object.entries(technicians)) {
        newStatus[id] = technician.status;
      }
      setTecnicosStatus(newStatus);
      localStorage.setItem('tecnicosStatus', JSON.stringify(newStatus));
    };

    const handleUserLoggedIn = (data, isLogged) => {
      if (isLogged) {
        setTecnicosStatus((prevStatus) => {
          const newStatus = {
            ...prevStatus,
            [data.id]: 'conectado'
          };
          localStorage.setItem('tecnicosStatus', JSON.stringify(newStatus));
          return newStatus;
        });
        setLoggedInUsers((prevUsers) => new Set(prevUsers).add(data.id));
      }
    };

    const handleUserLoggedOut = (data) => {
      setTecnicosStatus((prevStatus) => {
        const newStatus = {
          ...prevStatus,
          [data.id]: 'desconectado'
        };
        localStorage.setItem('tecnicosStatus', JSON.stringify(newStatus));
        return newStatus;
      });
      setLoggedInUsers((prevUsers) => {
        const updatedUsers = new Set(prevUsers);
        updatedUsers.delete(data.id);
        return updatedUsers;
      });
    };

    socket.on('userStatus', handleUserStatus);
    socket.on('userLoggedIn', handleUserLoggedIn);
    socket.on('userLoggedOut', handleUserLoggedOut);

    return () => {
      socket.off('userStatus', handleUserStatus);
      socket.off('userLoggedIn', handleUserLoggedIn);
      socket.off('userLoggedOut', handleUserLoggedOut);
    };
  }, []);

  
 




  
  useEffect(() => {
    async function initialize() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setPosition({ latitude, longitude });
          },
          (error) => {
            console.error('Error al obtener la posición:', error.message);
          }
        );
      } else {
        console.error('El navegador no soporta geolocalización.');
      }
    }

    initialize();
    fetchClientes();
    fetchTecnicos();
  }, []);

  const fetchClientes = async () => {
    try {
      const data = await listaClientes();
      if (data.length > 0) {
 
 
        setClientes(data);
      } else {
        console.log('Aún no se registra ningún cliente...');
      }
    } catch (error) {
      console.error("Error, no se encontraron clientes en la base de datos....", error);
    }
  };

  const fetchTecnicos = async () => {
    try {
      const data = await listadoEmpleados();
      if (data.length > 0) {
  
        setTecnicos(data);
        setFilterTec(data);
      } else {
        console.log('Aún no se registra ningún técnico...');
      }
    } catch (error) {
      console.error("Error, no se encontraron técnicos en la base de datos....", error);
    }
  };

  const [newClient, setNewClient] = useState({
    numero_cliente: '',
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: '',
    cuilCuit: '',
  });

  const [errors, setErrors] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    cuilCuit: '',
  });

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'nombre':
        if (!value) error = 'El nombre es requerido.';
        break;
      case 'direccion':
        if (!value) error = 'La dirección es requerida.';
        break;
      case 'telefono':
        if (!value) {
          error = 'El teléfono es requerido.';
        } else if (!/^\d+$/.test(value)) {
          error = 'El teléfono debe contener solo números.';
        }
        break;
      case 'cuilCuit':
        if (!value) {
          error = 'El CUIL/CUIT es requerido.';
        } else if (!/^\d+$/.test(value)) {
          error = 'El CUIL/CUIT debe contener solo números.';
        }
        break;
      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(newClient).forEach((key) => {
      const error = validateField(key, newClient[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient({ ...newClient, [name]: value });
  };

  const handleAddClient = async () => {
    if (validateForm()) {
      const clientId = await guardarCliente(newClient); 
      if (clientId) {
        setClientes([...clientes, { ...newClient, id: clientId, distancia: '0 km', latitud: 0, longitud: 0, Ordenes: [] }]);
        setNewClient({ nombre: '', direccion: '', telefono: '', cuilCuit: '', ubicacion: '' });
        setErrors({});
        setView('clientesTecnicos');
        window.location.reload(); 
      }
    }
  };

  const handleSelectClient = (cliente) => {
    setSelectedClient(cliente);
    setView('detalleClienteBuscarTecnico');
    
    const { latitud, longitud } = cliente;
    handlePosition(latitud, longitud);
  };

  const handleSelectTecnico = (tecnico) => {
    setSelectedTecnico(tecnico);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchTec = (e) => {
    setSearchTec(e.target.value);
    if (filteredTecnicos.length > 0) setFilterTec(filteredTecnicos);
    else setFilterTec(tecnicos);
  };

  const handleShowAllClientes = () => {
    setShowAllClientes(true);
  };

  const handleShowAllTecnicos = () => {
    setShowAllTecnicos(true);
  };

  const handleShowTareas = (id) => {
    setShowTareas({
      ...showTareas,
      [id]: !showTareas[id],
    });
  };

  const filteredClientes = clientes.filter((cliente) => cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

  const filteredTecnicos = tecnicos.filter((tecnico) => tecnico.nombre.toLowerCase().includes(searchTec.toLowerCase()));
 
  const activeTecnicos = tecnicos.filter((t) => t.estado == 1);

  const handleBack = () => {
    setView('clientesTecnicos');
    setSelectedTecnico(null);
  };

  const handlePosition = (latitud, longitud) => {
    setPosition({
      latitude: latitud,
      longitude: longitud,
    });
  };

  const guardarCliente = async (cliente) => {
    try {
      const clienteExistente = await verificarExistenciaCliente(cliente);
  
      if (clienteExistente) {
        console.log("El cliente ya existe en la base de datos.");
        return cliente.id; // Return the existing client's ID
      } else {
        const response = await fetch("https://lv-back.online/clientes/guardar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cliente)
        });
  
        const result = await response.json();
        if (result) {
          console.log("Cliente guardado con éxito!!!");
          return result.id; // Assuming the backend returns the saved client's ID
        } else {
          console.log("Se produjo un error, el cliente no pudo ser guardado...");
          return null;
        }
      }
    } catch (error) {
      console.error("Error al guardar el cliente.", error);
      return null;
    }
  };

  const verificarExistenciaCliente = async (cliente) => {
    try {
      const response = await fetch(`https://lv-back.online/clientes/${cliente.numero_cliente}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      const result = await response.json();
      return !!result; // True if client exists, false otherwise
    } catch (error) {
      console.error("Error al verificar la existencia del cliente.", error);
      return false;
    }
  };

  const verificarNumeroCliente = async () => {
    try {
      const response = await fetch("https://lv-back.online/clientes/lista", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      const clientes = await response.json();
      const maxNumeroCliente = Math.max(...clientes.map(cliente => parseInt(cliente.numero_cliente, 10)), 0);
      return maxNumeroCliente;
    } catch (error) {
      console.error("Error al verificar el número de cliente.", error);
      return 0;
    }
  };

  useEffect(() => {
    const fetchMaxNumeroCliente = async () => {
      const maxNumeroCliente = await verificarNumeroCliente();
      setNewClient(prevState => ({ ...prevState, numero_cliente: maxNumeroCliente + 1 }));
    }

    fetchMaxNumeroCliente();
  }, []);
  const tareas = [
    {
      id_tecnico: '1',
      detalle: 'Partió a la casa del cliente',
      estado: 'activo',
    },
    {
      id_tecnico: '1',
      detalle: 'Está solucionando el problema',
      estado: 'finalizado',
    },
    { id_tecnico: '1', detalle: 'Está de regreso', estado: 'finalizado' },
    {
      id_tecnico: '2',
      detalle: 'Partió a la casa del cliente',
      estado: 'activo',
    },
    {
      id_tecnico: '2',
      detalle: 'Está solucionando el problema',
      estado: 'finalizado',
    },
    { id_tecnico: '2', detalle: 'Está de regreso', estado: 'finalizado' },
    {
      id_tecnico: '3',
      detalle: 'Partió a la casa del cliente',
      estado: 'finalizado',
    },
    {
      id_tecnico: '3',
      detalle: 'Está solucionando el problema',
      estado: 'finalizado',
    },
    { id_tecnico: '3', detalle: 'Está de regreso', estado: 'activo' },
  ];
 
  return (
    <div className='ventas-container'>
      <Header text='Ubicaciones'></Header>
      <div className='row w-100 p-5 mt-5'>
        <div className='col-4'>
          {/* Listado Clientes */}
          {(view === 'clientesTecnicos' || view === 'formClientes') && (
            <>
              <div id='clientes' className='container-lists list-clientes-container'>
                <h2 className='px-3 pb-2 feedback-containers-heading'>Clientes</h2>
                <div className='px-4 mx-3'>
                  <input className='caja-input' type='text' placeholder='Buscar' value={searchTerm} onChange={handleSearchChange} />
                  <button className='caja-button-search'>🔍︎</button>
                </div>
                <div className='scrollable-container-top'>
                  {(showAllClientes ? filteredClientes : filteredClientes.slice(0, 3)).map((t, i) => (
                    <div key={i} className='my-2'>
                      <div className='feedback-tecnicos-container align-items-center'>
                        <button className='feedback-tecnicos-heading-button' onClick={() => handleSelectClient(t)}>
                          {t.nombre} {t.apellido}
                        </button>
                        <span className='mx-2'>
                          Se encuentra a{' '}
                          {haversine(t.latitud, t.longitud, position.latitude, position.longitude)}
                          km
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {!showAllClientes && filteredClientes.length > 3 && (
                  <div className='d-flex justify-content-center'>
                    <button onClick={handleShowAllClientes} className='bg-info rounded-pill py-1 px-4 text-white'>
                      Mostrar todos
                    </button>
                  </div>
                )}
              </div>
              <hr></hr>
            </>
          )}
          {/* Lista Tecnicos */}
          {view === 'clientesTecnicos' && (
            <>
 


 {view === 'clientesTecnicos' && (
  <div id='tecnicos' className='container-lists list-tecnicos-container'>
    <h2 className='px-3 feedback-containers-heading'>Técnicos</h2>
    <div className='px-4 mx-3'>
      <input
        className='caja-input'
        type='text'
        placeholder='Buscar'
        value={searchTec}
        onChange={handleSearchTec}
      />
      <button className='caja-button-search'>🔍︎</button>
    </div>
    <div className='scrollable-container-top'>
      {filteredTecnicos.map((t) => {
     
        const estadoTecnico = tecnicosStatus[t.id];
 
        const badgeClass = `notification-badge-tecnico ${
          estadoTecnico === 'conectado' ? 'connected' :
          estadoTecnico === 'ocupado' ? 'busy' : 
          estadoTecnico === 'desconectado' ? 'disconnected' :
          'disconnected'  
        }`;

        return (
          <div key={t.id}>
            <div className='feedback-tecnicos-container align-items-center'>
              <h3 className='feedback-tecnicos-heading mx-2'>{t.nombre} {t.apellido}</h3>
              <div className={badgeClass}></div>
              <ul onClick={() => handleShowTareas(t.id)} className='feedback-tecnico'>
                <li></li>
              </ul>
            </div>
            {showTareas[t.id] && (
              <ul className='feedback-ordenes'>
                {tareas
                  .filter((tarea) => tarea.id_tecnico === t.id)
                  .map((tarea, index) => (
                    <div key={index} className='feedback-tecnicos-container align-items-center'>
                      <div
                        className={`notification-badge-tarea ${tarea.estado === 'activo' ? 'active' : 'ending'}`}
                      ></div>
                      <li className='li-tarea'>{tarea.detalle}</li>
                    </div>
                  ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}















            </>
          )}
          {/* Form Clientes */}
          {view === 'formClientes' && (
            <div id='formClientes' className='container-lists'>
              <h2 className='p-3 feedback-containers-heading'>Cargar cliente</h2>
              <div className='scrollable-container-top'>
                <ul>

                <li className='d-flex grey-text'>
                    <span>N° Cliente:</span>
                  </li>
                  <li className='d-flex justify-content-between py-2 grey-text'>
                    <input
                      type='text'
                      name='numero_cliente'
                      className='rounded text-center grey-text'
                      value={newClient.numero_cliente}
                      onChange={handleInputChange}
                    />
                  </li>

                  <li className='d-flex grey-text'>
                    <span>Nombre:</span>
                  </li>
                  <li className='d-flex justify-content-between py-2 grey-text'>
                    <input
                      type='text'
                      name='nombre'
                      className='rounded text-center grey-text'
                      value={newClient.nombre}
                      onChange={handleInputChange}
                    />
                  </li>

                  <li className='d-flex grey-text'>
                    <span>Apellido:</span>
                  </li>
                  <li className='d-flex justify-content-between py-2 grey-text'>
                    <input
                      type='text'
                      name='apellido'
                      className='rounded text-center grey-text'
                      value={newClient.apellido}
                      onChange={handleInputChange}
                    />
                  </li>



                  <li className='pb-1'>{errors.nombre && <div className='text-danger'>{errors.nombre}</div>}</li>
                  <li className='d-flex grey-text'>
                    <span>Dirección:</span>
                  </li>
                  <li className='d-flex justify-content-between py-2 grey-text'>
                    <input
                      type='text'
                      name='direccion'
                      className='rounded text-center grey-text'
                      value={newClient.direccion}
                      onChange={handleInputChange}
                    />
                  </li>
                  <li className='pb-1'>{errors.direccion && <div className='text-danger'>{errors.direccion}</div>}</li>
                  <li className='d-flex grey-text'>
                    <span>Telefono:</span>
                  </li>
                  <li className='d-flex justify-content-between py-2 grey-text'>
                    <input
                      type='text'
                      name='telefono'
                      className='rounded text-center grey-text'
                      value={newClient.telefono}
                      onChange={handleInputChange}
                    />
                  </li>
                  <li className='pb-1'>{errors.telefono && <div className='text-danger'>{errors.telefono}</div>}</li>
                  <li className='d-flex grey-text'>
                    <span>CUIL/CUIT:</span>
                  </li>
                  <li className='d-flex justify-content-between py-2 grey-text'>
                    <input
                      type='text'
                      name='cuilCuit'
                      className='rounded text-center grey-text'
                      value={newClient.cuilCuit}
                      onChange={handleInputChange}
                    />
                  </li>
                  <li className='pb-1'>{errors.cuilCuit && <div className='text-danger'>{errors.cuilCuit}</div>}</li>
                </ul>
                <div className='d-flex justify-content-center mt-4'>
                  <button className='bg-info rounded-pill py-1 px-2 text-white' onClick={handleAddClient}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='25' height='25' fill='currentColor' className='bi bi-check' viewBox='0 0 13 13'>
                      <path d='M10.97 4.97a.75.75 0 0 1 1.07 1.05L7.475 11.585a.75.75 0 0 1-1.08 0l-2.475-2.5a.75.75 0 1 1 1.08-1.04L7 10.22l3.97-5.25z' />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}









          {/* Detalle cliente, Buscar tecnico */}
          {view === 'detalleClienteBuscarTecnico' && (
            <>
              <div id='detalleCliente' className='container-lists'>
                <h2 className='px-3 pt-3 feedback-containers-heading'>Cliente</h2>
                <div className='scrollable-container-top'>
                  <div className='feedback-tecnicos-container align-items-center'>
                    <h4 className='feedback-tecnicos-heading'>{selectedClient.nombre}</h4>
                    <span className='mx-2'>{selectedClient.distancia}</span>
                  </div>
                  <div className='feedback-tecnicos-container align-items-center'>
                    <h4 className='feedback-tecnicos-heading'>Teléfono: {selectedClient.telefono}</h4>
                  </div>
                  <div className='feedback-tecnicos-container align-items-center'>
                    <h4 className='feedback-tecnicos-heading'>Calle: {selectedClient.direccion}</h4>
                  </div>
                  <div className='feedback-tecnicos-container align-items-center'>
                    <h4 className='feedback-tecnicos-heading'>CUIL/CUIT: {selectedClient.cuil}</h4>
                  </div>
                  <button className='feedback-tecnicos-heading-button' onClick={handleBack}>
                    volver
                  </button>
                </div>
              </div>
              <div id='buscarTecnico' className='container-lists list-tecnicos-container'>
                <h2 className='px-3 pt-3 feedback-containers-heading'>Buscar técnico</h2>
                <div className='scrollable-container-top'>
                  {(showAllTecnicos ? activeTecnicos : activeTecnicos.slice(0, 3)).map((t) => (
                    <div key={t.id}>
                      <div className='feedback-tecnicos-container align-items-center'>
                        <button className='feedback-tecnicos-heading-button' onClick={() => handleSelectTecnico(t)}>
                          {t.nombre}
                        </button>
                        <span className='mx-2'>
                          Se encuentra a{' '}
                          {haversine(t.latitud, t.longitud, selectedClient.latitud, selectedClient.longitud)}
                          km
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {!showAllTecnicos && activeTecnicos.length > 3 && (
                  <div className='d-flex justify-content-center mt-4'>
                    <button className='bg-info rounded-pill py-1 px-4 text-white' onClick={handleShowAllTecnicos}>
                      Mostrar todos
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <div className='col-8'>
          <Map
            position={position}
            zoom={6}
            activeTechnicians={activeTecnicos}
            selectedClient={selectedClient}
            selectedTechnician={selectedTecnico}
            setSelectedTechnician={setSelectedTecnico}
            clientes={clientes}
            refClient={ref}
          />
          <div className='d-flex justify-content-end mt-4'>
            <button
              className='bg-info rounded-pill py-1 px-2 text-white'
              onClick={() => setView(view === 'clientesTecnicos' ? 'formClientes' : 'clientesTecnicos')}
            >
              <svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' fill='currentColor' className='bi bi-plus' viewBox='0 0 16 16'>
                <path d='M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4' />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ubicaciones;
