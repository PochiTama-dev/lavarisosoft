import { useState, useEffect } from "react";
import Header from "../Header/Header";
import Map from "./Map";

import "./Ubicaciones.css";

const Ubicaciones = () => {
  const [showTareas, setShowTareas] = useState({});
  const [position, setPosition] = useState({
    latitude: -33.9913,
    longitude: -64.3435,
  });
  const [userMarkers, setUserMarkers] = useState([]);

  const PROVINCIA_CORDOBA_BOUNDINGBOX = [
    "-33.9913", // Latitud mínima
    "-31.2908", // Latitud máxima
    "-64.3435", // Longitud mínima
    "-62.9378", // Longitud máxima
  ];

  useEffect(() => {
    async function initialize() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setPosition({ latitude, longitude });
            /* fetchUserLocations(); */
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

  /* const fetchUserLocations = async () => {
    try {
      const response = await fetch("http://localhost:5131/location");
      if (response.ok) {
        const data = await response.json();
        const markers = await Promise.all(
          data.map(async (user) => {
            console.log(user);
            return {
              id: user.id,
              latitude: parseFloat(user.latitud),
              longitude: parseFloat(user.longitud),
              isFollowing: false,
            };
          })
        );
        setUserMarkers(markers);
      } else {
        console.error("Error al obtener la lista de usuarios");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  }; */

  const handleShowTareas = (id) => {
    setShowTareas({
      ...showTareas,
      [id]: !showTareas[id],
    });
  };

  const clientes = [
    { nombre: "Francisco Padilla", distancia: "se encuentra a 8 km" },
    { nombre: "Alejandra Korn", distancia: "se encuentra a 2.4 km" },
    { nombre: "Susana Gimenez", distancia: "se encuentra a 3.9 km" },
  ];

  const tecnicos = [
    { id: "1", nombre: "Alan Almendra", estado: "activo", distancia: "se encuentra a 2.4 km" },
    { id: "2", nombre: "Mariela Paz", estado: "activo", distancia: "se encuentra a 3.9 km" },
    { id: "3", nombre: "Leandro Sueyro", estado: "pendiente", distancia: "se encuentra a 8 km" },
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

  return (
    <div className="ventas-container">
      <Header text="Ubicaciones"></Header>
      <div className="row w-100 p-5 mt-5">
        {/* Listas */}
        <div className="col-4">
          {/* Clientes */}
          <div id="clientes" className="container-lists">
            <h2 className="px-3 pt-3 feedback-containers-heading">Clientes</h2>
            <div className="px-4 mx-3">
              <input className="caja-input" type="text" placeholder="Buscar" />
              <button className="caja-button-search">🔍︎</button>
            </div>
            <div className="scrollable-container-top">
              {clientes?.map((t, i) => (
                <div key={i}>
                  <div className="feedback-tecnicos-container align-items-center">
                    <h3 className="feedback-tecnicos-heading">{t.nombre}</h3>
                    <span className="mx-2">{t.distancia}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="d-flex justify-content-center mt-4">
              <button className="bg-primary rounded-pill py-1 px-4 text-white">
                Mostrar todos
              </button>
            </div>
          </div>
          {/* End Clientes */}
          <hr></hr>
          {/* Tecnicos */}
          <div id="tecnicos" className="container-lists">
            <h2 className="p-3 feedback-containers-heading">Tecnicos</h2>
            <div className="scrollable-container-top">
              {tecnicos?.map((t, i) => (
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
                                tarea.estado === "activo" ? "active" : "ending"
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
          {/* End Tecnicos */}
          <hr></hr>
          {/* Form Clientes */}
          <div id="formClientes" className="container-lists">
            <h2 className="p-3 feedback-containers-heading">Cargar cliente</h2>
            <div className="scrollable-container-top">
              <ul>
                <li className="d-flex grey-text">
                  <span>Nombre:</span>
                </li>
                <li className="d-flex justify-content-between py-2 grey-text">
                  <input
                    type="text"
                    className="rounded text-center grey-text"
                  />
                </li>
                <li className="d-flex grey-text">
                  <span>Dirección:</span>
                </li>
                <li className="d-flex justify-content-between py-2 grey-text">
                  <input
                    type="text"
                    className="rounded text-center grey-text"
                  />
                </li>
                <li className="d-flex grey-text">
                  <span>Telefono:</span>
                </li>
                <li className="d-flex justify-content-between py-2 grey-text">
                  <input
                    type="text"
                    className="rounded text-center grey-text"
                  />
                </li>
                <li className="d-flex grey-text">
                  <span>CUIL/CUIT:</span>
                </li>
                <li className="d-flex justify-content-between py-2 grey-text">
                  <input
                    type="text"
                    className="rounded text-center grey-text"
                  />
                </li>
              </ul>
              <div className="d-flex justify-content-center mt-4">
                <button className="bg-primary rounded-pill py-1 px-2 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-check-lg"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {/* End Form Clientes */}
          <hr></hr>
          {/* Detalle cliente */}
          <div id="detalleCliente" className="container-lists">
            <h2 className="px-3 pt-3 feedback-containers-heading">Cliente</h2>
            <div className="scrollable-container-top">
              <div className="feedback-tecnicos-container align-items-center">
                <h4 className="feedback-tecnicos-heading">Martín Inchiausti</h4>
                <span className="mx-2">2.4 km</span>
              </div>
              <div className="feedback-tecnicos-container align-items-center">
                <h4 className="feedback-tecnicos-heading">
                  Teléfono: 11 2345678{" "}
                </h4>
              </div>
              <div className="feedback-tecnicos-container align-items-center">
                <h4 className="feedback-tecnicos-heading">
                  Calle: Corrientes{" "}
                </h4>
              </div>
              <div className="feedback-tecnicos-container align-items-center">
                <h4 className="feedback-tecnicos-heading">Altura: 654 </h4>
              </div>
              <div className="feedback-tecnicos-container align-items-center">
                <h4 className="feedback-tecnicos-heading">Localidad: CABA</h4>
              </div>
            </div>
          </div>
          {/* End Detalle cliente */}
          <hr></hr>
          {/* Buscar tecnico */}
          <div id="buscarTecnico" className="container-lists">
            <h2 className="px-3 pt-3 feedback-containers-heading">Buscar técnico</h2>
            <div className="scrollable-container-top">
              {tecnicos?.map((t, i) => (
                <div key={i}>
                  <div className="feedback-tecnicos-container align-items-center">
                    <h4 className="feedback-tecnicos-heading">{t.nombre}</h4>
                    <span className="mx-2">{t.distancia}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="d-flex justify-content-center mt-4">
              <button className="bg-primary rounded-pill py-1 px-4 text-white">
                Mostrar todos
              </button>
            </div>
          </div>
          {/* End Buscar tecnico */}
        </div>
        {/* End Listas */}
        {/* Mapa */}
        <div className="col-8">
          <Map position={position} zoom={8} />
          <div className="d-flex justify-content-end mt-4">
            <button className="bg-primary rounded-pill py-1 px-2 text-white">
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
        {/* End Mapa */}
      </div>
    </div>
  );
};

export default Ubicaciones;
