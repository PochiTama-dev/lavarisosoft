import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Circle, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import MarkerClusterGroup from 'react-leaflet-cluster';
import Modal from './Modal';
import NuevaOrden from '../../pages/Orders/NuevaOrden';
import socket from '../services/socketService';
import PropTypes from 'prop-types';
import { ClientMarker, TechnicianMarker } from './Markers';
import { haversine } from './calcularDistancia';
import { useCustomContext } from '../../hooks/context';

const CORDOBA_BOUNDS = {
  north: -29.0,
  south: -34.0,
  west: -65.0,
  east: -62.0,
};

const MapZoomOnSelect = ({ coordinates, zoomLevel }) => {
  const map = useMap();

  useEffect(() => {
    if (coordinates) {
      map.setView(coordinates, zoomLevel, {
        animate: true,
      });
    }
  }, [coordinates, zoomLevel, map]);

  return null;
};

const Map = ({ position, zoom, selectedClient, selectedTechnician, setSelectedTechnician, clientes, tecnicos, tecniCoordinates }) => {
  const navigate = useNavigate();
  const refClient = useRef({});
  const refTechnicians = useRef({});

  const [filter, setFilter] = useState('both');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClientData, setSelectedClientData] = useState(null);
  const [clientCoordinates, setClientCoordinates] = useState([0, 0]);

  const { latitude = 0, longitude = 0 } = position || {};
  const { user } = useCustomContext();

  console.log(user);
  const handleTechnicianSelect = (tecnico) => {
    if (selectedClient) {
      setSelectedTechnician(tecnico);
      navigate('/locationOrder', {
        state: { selectedTechnician: tecnico, selectedClient: selectedClient },
      });
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedClientData(null);
  };

  const handleOpenModalWithClientData = (clientData) => {
    setSelectedClientData(clientData);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (selectedClient) {
      selectedClient.latitud !== undefined && handleCoordinates(selectedClient);
      const clientKey = `${selectedClient.latitud}-${selectedClient.longitud}`;
      const clientMarker = refClient.current[clientKey];

      if (clientMarker) {
        clientMarker.openPopup();
      }
    }
  }, [selectedClient]);

  useEffect(() => {
    const timers = {};
    const startTime = {}; // Para almacenar el tiempo inicial
    tecnicos.forEach((tecnico) => {
      const checkProximity = () => {
        // Verifica si está a menos de 50 metros de algún cliente
        const isNearby = clientes.some((cliente) => {
          const distancia = haversine(tecnico.latitud, tecnico.longitud, cliente.latitud, cliente.longitud);
          return distancia <= 0.05; // 50 metros
        });

        if (isNearby) {
          // Iniciar contador o realizar alguna acción
          if (!timers[tecnico.id]) {
            startTime[tecnico.id] = Date.now();
            timers[tecnico.id] = setInterval(() => {
              console.log(`El técnico ${tecnico.nombre} está cerca de un cliente.`);
              // Aquí puedes implementar una acción adicional (p.ej., notificar, contar tiempo, etc.)
            }, 60000); // Intervalo de tiempo
          }
        } else {
          // Limpiar temporizador si el técnico ya no está cerca
          if (timers[tecnico.id]) {
            const endTime = Date.now();
            const elapsedTime = endTime - startTime[tecnico.id];
            clearInterval(timers[tecnico.id]);
            delete timers[tecnico.id];

            const timeSpent = formatElapsedTime(elapsedTime);
            console.log(`El técnico ${tecnico.nombre} estuvo cerca por ${timeSpent}.`);
          }
        }
      };

      // Comenzar la verificación periódica
      const interval = setInterval(checkProximity, 600000); // Revisar cada 10 minutos

      return () => {
        clearInterval(interval); // Limpiar intervalos al desmontar el componente
        Object.values(timers).forEach(clearInterval); // Limpiar todos los temporizadores
      };
    });
  }, []);

  const formatElapsedTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let formattedTime = '';
    if (hours > 0) {
      formattedTime += `${hours} hora${hours > 1 ? 's' : ''}, `;
    }
    if (minutes > 0) {
      formattedTime += `${minutes} minuto${minutes > 1 ? 's' : ''}, `;
    }
    formattedTime += `${seconds} segundo${seconds > 1 ? 's' : ''}`;

    return formattedTime;
  };

  const handleCoordinates = (cliente) => {
    setClientCoordinates([cliente.latitud, cliente.longitud]);
  };
  useEffect(() => {
    if (tecniCoordinates && tecniCoordinates[0] !== 0) {
      const technicianKey = `${tecniCoordinates[0]}-${tecniCoordinates[1]}`;
      const technicianMarker = refTechnicians.current[technicianKey];

      if (technicianMarker) {
        technicianMarker.openPopup();
      }
    }
  }, [tecniCoordinates]);

  return (
    <>
      <div>
        <select name='filter' id='filter' value={filter} onChange={handleFilterChange}>
          <option value='clients'>Clientes</option>
          <option value='technicians'>Técnicos</option>
          <option value='both'>Ambos</option>
        </select>
      </div>
      <MapContainer
        className='searchMap'
        bounds={CORDOBA_BOUNDS}
        center={selectedClient && selectedClient.nombre ? [selectedClient.latitud, selectedClient.longitud] : [latitude || 0, longitude || 0]}
        zoom={zoom}
      >
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />

        {/* Filtro TECNICOS */}

        <MarkerClusterGroup>
          {(filter === 'technicians' || filter === 'both') &&
            tecnicos.map((tecnico) => {
              return (
                tecnico.status !== 'desconectado' &&
                tecnico.latitud &&
                tecnico.longitud && <TechnicianMarker key={tecnico.id} tecnico={tecnico} onTechnicianSelect={() => handleTechnicianSelect(tecnico)} />
              );
            })}
          {tecniCoordinates && tecniCoordinates[0] !== 0 && <MapZoomOnSelect coordinates={tecniCoordinates} zoomLevel={10} />}
        </MarkerClusterGroup>

        {/* Filtro CLIENTES */}
        <MarkerClusterGroup>
          {(filter === 'clients' || filter === 'both') &&
            clientes.map((cliente) => (
              <>
                <ClientMarker key={cliente.id} cliente={cliente} handleCoordinates={() => handleCoordinates(cliente)} handleOpenModalWithClientData={() => handleOpenModalWithClientData(cliente)} />
              </>
            ))}
        </MarkerClusterGroup>
        {clientCoordinates[0] != 0 && <Circle center={[clientCoordinates[0], clientCoordinates[1]]} pathOptions={{ fillColor: 'blue' }} radius={100} />}
        {clientCoordinates[0] !== 0 && <MapZoomOnSelect coordinates={clientCoordinates} zoomLevel={18} />}
      </MapContainer>

      {/* Modal para mostrar detalles del cliente */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleModalClose}>
          <NuevaOrden cliente={selectedClientData} />
        </Modal>
      )}
    </>
  );
};

Map.propTypes = {
  position: PropTypes.object,
  zoom: PropTypes.number,
  selectedClient: PropTypes.any,
  selectedTechnician: PropTypes.object,
  setSelectedTechnician: PropTypes.func,
  clientes: PropTypes.array,
  tecnicos: PropTypes.array,
};

export default Map;
