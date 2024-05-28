import { useState, useEffect } from "react";
import Header from "../Header/Header";
import Map from "./Map";

import "./Ubicaciones.css";

const Ubicaciones = () => {
  const [showTareas, setShowTareas] = useState({});
  const [view, setView] = useState("clientesTecnicos"); // Estado para controlar la vista inicial
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedTecnico, setSelectedTecnico] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllClientes, setShowAllClientes] = useState(false);
  const [showAllTecnicos, setShowAllTecnicos] = useState(false);
  const [position, setPosition] = useState({
    latitude: -33.9913,
    longitude: -64.3435,
  });

  const [clientes, setClientes] = useState([
    {
      nombre: "Francisco Padilla",
      distancia: "8 km",
      telefono: "1155246987",
      direccion: "Calle prueba 123",
      cuilCuit: "00-12345678-9",
    },
    {
      nombre: "Alejandra Korn",
      distancia: "2.4 km",
      telefono: "1155246987",
      direccion: "Calle prueba 123",
      cuilCuit: "00-12345678-9",
    },
    {
      nombre: "Susana Gimenez",
      distancia: "3.9 km",
      telefono: "1155246987",
      direccion: "Calle prueba 123",
      cuilCuit: "00-12345678-9",
    },
    {
      nombre: "Juan Perez",
      distancia: "1.2 km",
      telefono: "1155246987",
      direccion: "Calle prueba 123",
      cuilCuit: "00-12345678-9",
    },
  ]);

  const [newClient, setNewClient] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    cuilCuit: "",
  });
  const [errors, setErrors] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    cuilCuit: "",
  });

  const tecnicos = [
    {
      id: "1",
      nombre: "Alan Almendra",
      estado: "activo",
      distancia: "se encuentra a 2.4 km",
      telefono: "1123658741",
      position: { latitude: -31.4167, longitude: -64.1833 }, // Coordenadas de Córdoba capital
    },
    {
      id: "2",
      nombre: "Mariela Paz",
      estado: "activo",
      distancia: "se encuentra a 3.9 km",
      telefono: "1123658741",
      position: { latitude: -30.4201, longitude: -65.1888 }, // Coordenadas cercanas a Córdoba capital
    },
    {
      id: "3",
      nombre: "Leandro Sueyro",
      estado: "pendiente",
      distancia: "se encuentra a 8 km",
      telefono: "1123658741",
      position: { latitude: -31.1000, longitude: -63.7000 }, // Coordenadas cercanas a Córdoba capital
    },
    {
      id: "4",
      nombre: "Laura Campos",
      estado: "activo",
      distancia: "se encuentra a 5.1 km",
      telefono: "1123658741",
      position: { latitude: -31.2000, longitude: -62.5000 }, // Coordenadas cercanas a Córdoba capital
    },
    {
      id: "5",
      nombre: "Carlos Ramirez",
      estado: "pendiente",
      distancia: "se encuentra a 6.7 km",
      telefono: "1123658741",
      position: { latitude: -32.9000, longitude: -64.1950 }, // Coordenadas cercanas a Córdoba capital
    },
    {
      id: "6",
      nombre: "Fernanda Silva",
      estado: "activo",
      distancia: "se encuentra a 1.3 km",
      telefono: "1123658741",
      position: { latitude: -30.4130, longitude: -64.1850 }, // Coordenadas cercanas a Córdoba capital
    },
    {
      id: "7",
      nombre: "Fernando Perez",
      estado: "activo",
      distancia: "se encuentra a 1.5 km",
      telefono: "1123658741",
      position: { latitude: -32.4100, longitude: -64.1800 }, // Coordenadas cercanas a Córdoba capital
    },
  ];

  const tareas = [
    {
      id_tecnico: "1",
      detalle: "Partió a la casa del cliente",
      estado: "activo",
    },
    {
      id_tecnico: "1",
      detalle: "Está solucionando el problema",
      estado: "finalizado",
    },
    { id_tecnico: "1", detalle: "Está de regreso", estado: "finalizado" },
    {
      id_tecnico: "2",
      detalle: "Partió a la casa del cliente",
      estado: "activo",
    },
    {
      id_tecnico: "2",
      detalle: "Está solucionando el problema",
      estado: "finalizado",
    },
    { id_tecnico: "2", detalle: "Está de regreso", estado: "finalizado" },
    {
      id_tecnico: "3",
      detalle: "Partió a la casa del cliente",
      estado: "finalizado",
    },
    {
      id_tecnico: "3",
      detalle: "Está solucionando el problema",
      estado: "finalizado",
    },
    { id_tecnico: "3", detalle: "Está de regreso", estado: "activo" },
  ];

  useEffect(() => {
    async function initialize() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setPosition({ latitude, longitude });
          },
          (error) => {
            console.error("Error al obtener la posición:", error);
          }
        );
      } else {
        console.error("El navegador no soporta geolocalización.");
      }
    }

    initialize();
  }, []);

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "nombre":
        if (!value) error = "El nombre es requerido.";
        break;
      case "direccion":
        if (!value) error = "La dirección es requerida.";
        break;
      case "telefono":
        if (!value) {
          error = "El teléfono es requerido.";
        } else if (!/^\d+$/.test(value)) {
          error = "El teléfono debe contener solo números.";
        }
        break;
      case "cuilCuit":
        if (!value) {
          error = "El CUIL/CUIT es requerido.";
        } else if (!/^\d+$/.test(value)) {
          error = "El CUIL/CUIT debe contener solo números.";
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

  const handleAddClient = () => {
    if (validateForm()) {
      setClientes([...clientes, { ...newClient, distancia: "0 km" }]);
      setSelectedClient(newClient);
      setNewClient({ nombre: "", direccion: "", telefono: "", cuilCuit: "" });
      setErrors({});
      setView("clientesTecnicos");
    }
  };

  const handleSelectClient = (cliente) => {
    setSelectedClient(cliente);
    setView("detalleClienteBuscarTecnico");
  };

  const handleSelectTecnico = (tecnico) => {
    setSelectedTecnico(tecnico);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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

  const filteredClientes = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeTecnicos = tecnicos.filter(t => t.estado === 'activo');

  return (
    <div className="ventas-container">
      <Header text="Ubicaciones"></Header>
      <div className="row w-100 p-5 mt-5">
        <div className="col-4">
          {/* Listado Clientes */}
          {(view === "clientesTecnicos" || view === "formClientes") && (
            <>
              <div
                id="clientes"
                className="container-lists list-clientes-container"
              >
                <h2 className="px-3 pb-2 feedback-containers-heading">
                  Clientes
                </h2>
                <div className="px-4 mx-3">
                  <input
                    className="caja-input"
                    type="text"
                    placeholder="Buscar"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <button className="caja-button-search">🔍︎</button>
                </div>
                <div className="scrollable-container-top">
                  {(showAllClientes
                    ? filteredClientes
                    : filteredClientes.slice(0, 3)
                  ).map((t, i) => (
                    <div key={i} className="my-2">
                      <div className="feedback-tecnicos-container align-items-center">
                        <button
                          className="feedback-tecnicos-heading-button"
                          onClick={() => handleSelectClient(t)}
                        >
                          {t.nombre}
                        </button>
                        <span className="mx-2">
                          se encuentra a {t.distancia}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {!showAllClientes && filteredClientes.length > 3 && (
                  <div className="d-flex justify-content-center">
                    <button
                      onClick={handleShowAllClientes}
                      className="bg-info rounded-pill py-1 px-4 text-white"
                    >
                      Mostrar todos
                    </button>
                  </div>
                )}
              </div>
              <hr></hr>
            </>
          )}
          {/* Lista Tecnicos */}
          {view === "clientesTecnicos" && (
            <>
              <div
                id="tecnicos"
                className="container-lists list-tecnicos-container"
              >
                <h2 className="px-3 feedback-containers-heading">Técnicos</h2>
                <div className="scrollable-container-top">
                  {tecnicos.map((t, i) => (
                    <div key={i}>
                      <div className="feedback-tecnicos-container align-items-center">
                        <h3 className="feedback-tecnicos-heading mx-2">
                          {t.nombre}
                        </h3>
                        <div
                          className={`notification-badge-tecnico ${
                            t.estado === "activo" ? "active" : "pending"
                          }`}
                        ></div>
                        <ul
                          onClick={() => handleShowTareas(t.id)}
                          className="feedback-tecnico"
                        >
                          <li></li>
                        </ul>
                      </div>
                      {showTareas[t.id] && (
                        <ul className="feedback-ordenes">
                          {tareas
                            .filter((tarea) => tarea.id_tecnico === t.id)
                            .map((tarea, index) => (
                              <div
                                key={index}
                                className="feedback-tecnicos-container align-items-center"
                              >
                                <div
                                  className={`notification-badge-tarea ${
                                    tarea.estado === "activo"
                                      ? "active"
                                      : "ending"
                                  }`}
                                ></div>
                                <li className="li-tarea">{tarea.detalle}</li>
                              </div>
                            ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {/* Form Clientes */}
          {view === "formClientes" && (
            <div id="formClientes" className="container-lists">
              <h2 className="p-3 feedback-containers-heading">
                Cargar cliente
              </h2>
              <div className="scrollable-container-top">
                <ul>
                  <li className="d-flex grey-text">
                    <span>Nombre:</span>
                  </li>
                  <li className="d-flex justify-content-between py-2 grey-text">
                    <input
                      type="text"
                      name="nombre"
                      className="rounded text-center grey-text"
                      value={newClient.nombre}
                      onChange={handleInputChange}
                    />
                  </li>
                  <li className="pb-1">
                    {errors.nombre && (
                      <div className="text-danger">{errors.nombre}</div>
                    )}
                  </li>
                  <li className="d-flex grey-text">
                    <span>Dirección:</span>
                  </li>
                  <li className="d-flex justify-content-between py-2 grey-text">
                    <input
                      type="text"
                      name="direccion"
                      className="rounded text-center grey-text"
                      value={newClient.direccion}
                      onChange={handleInputChange}
                    />
                  </li>
                  <li className="pb-1">
                    {errors.direccion && (
                      <div className="text-danger">{errors.direccion}</div>
                    )}
                  </li>
                  <li className="d-flex grey-text">
                    <span>Telefono:</span>
                  </li>
                  <li className="d-flex justify-content-between py-2 grey-text">
                    <input
                      type="text"
                      name="telefono"
                      className="rounded text-center grey-text"
                      value={newClient.telefono}
                      onChange={handleInputChange}
                    />
                  </li>
                  <li className="pb-1">
                    {errors.telefono && (
                      <div className="text-danger">{errors.telefono}</div>
                    )}
                  </li>
                  <li className="d-flex grey-text">
                    <span>CUIL/CUIT:</span>
                  </li>
                  <li className="d-flex justify-content-between py-2 grey-text">
                    <input
                      type="text"
                      name="cuilCuit"
                      className="rounded text-center grey-text"
                      value={newClient.cuilCuit}
                      onChange={handleInputChange}
                    />
                  </li>
                  <li className="pb-1">
                    {errors.cuilCuit && (
                      <div className="text-danger">{errors.cuilCuit}</div>
                    )}
                  </li>
                </ul>
                <div className="d-flex justify-content-center mt-4">
                  <button
                    className="bg-info rounded-pill py-1 px-2 text-white"
                    onClick={handleAddClient}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      className="bi bi-check"
                      viewBox="0 0 13 13"
                    >
                      <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05L7.475 11.585a.75.75 0 0 1-1.08 0l-2.475-2.5a.75.75 0 1 1 1.08-1.04L7 10.22l3.97-5.25z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Detalle cliente, Buscar tecnico */}
          {view === "detalleClienteBuscarTecnico" && (
            <>
              <div id="detalleCliente" className="container-lists">
                <h2 className="px-3 pt-3 feedback-containers-heading">
                  Cliente
                </h2>
                <div className="scrollable-container-top">
                  <div className="feedback-tecnicos-container align-items-center">
                    <h4 className="feedback-tecnicos-heading">
                      {selectedClient.nombre}
                    </h4>
                    <span className="mx-2">{selectedClient.distancia}</span>
                  </div>
                  <div className="feedback-tecnicos-container align-items-center">
                    <h4 className="feedback-tecnicos-heading">
                      Teléfono: {selectedClient.telefono}
                    </h4>
                  </div>
                  <div className="feedback-tecnicos-container align-items-center">
                    <h4 className="feedback-tecnicos-heading">
                      Calle: {selectedClient.direccion}
                    </h4>
                  </div>
                  <div className="feedback-tecnicos-container align-items-center">
                    <h4 className="feedback-tecnicos-heading">
                      CUIL/CUIT: {selectedClient.cuilCuit}
                    </h4>
                  </div>
                </div>
              </div>
              <div id="buscarTecnico" className="container-lists list-tecnicos-container">
                <h2 className="px-3 pt-3 feedback-containers-heading">
                  Buscar técnico
                </h2>
                <div className="scrollable-container-top">
                  {(showAllTecnicos ? activeTecnicos : activeTecnicos.slice(0, 3)).map((t, i) => (
                    <div key={t.id}>
                      <div className="feedback-tecnicos-container align-items-center">
                        <button
                          className="feedback-tecnicos-heading-button"
                          onClick={() => handleSelectTecnico(t)}
                        >
                          {t.nombre}
                        </button>
                        <span className="mx-2">{t.distancia}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {!showAllTecnicos && activeTecnicos.length > 3 && (
                  <div className="d-flex justify-content-center mt-4">
                    <button className="bg-info rounded-pill py-1 px-4 text-white" onClick={handleShowAllTecnicos}>
                      Mostrar todos
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <div className="col-8">
          <Map position={position} zoom={8} activeTechnicians={activeTecnicos} selectedClient={selectedClient} selectedTechnician={selectedTecnico} setSelectedTechnician={setSelectedTecnico} />
          <div className="d-flex justify-content-end mt-4">
            <button
              className="bg-info rounded-pill py-1 px-2 text-white"
              onClick={() =>
                setView(
                  view === "clientesTecnicos"
                    ? "formClientes"
                    : "clientesTecnicos"
                )
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                fill="currentColor"
                className="bi bi-plus"
                viewBox="0 0 16 16"
              >
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ubicaciones;
