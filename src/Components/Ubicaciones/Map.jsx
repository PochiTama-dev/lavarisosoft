/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'leaflet';
import markerIcon from '../../assets/marker.png';
import clientIcon from '../../assets/man.webp';
import 'leaflet/dist/leaflet.css';
import MarkerClusterGroup from 'react-leaflet-cluster';
import Modal from './Modal';
import NuevaOrden from '../../pages/Orders/NuevaOrden';
import socket from '../services/socketService';

const CORDOBA_BOUNDS = {
  north: -29.0,
  south: -34.0,
  west: -65.0,
  east: -62.0,
};

const myIcon = new Icon({
  iconUrl: markerIcon,
  iconSize: [30, 30],
  iconAnchor: [12, 41],
  popupAnchor: [1, -35],
});

const clienteIcono = new Icon({
  iconUrl: clientIcon,
  iconSize: [30, 30],
  iconAnchor: [12, 41],
  popupAnchor: [1, -35],
});

const Map = ({ position, zoom, selectedClient, selectedTechnician, setSelectedTechnician, clientes }) => {
  const navigate = useNavigate();
  const refClient = useRef({});
  const [filter, setFilter] = useState('both');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClientData, setSelectedClientData] = useState(null);
  const [technicians, setTechnicians] = useState({});

  const { latitude = 0, longitude = 0 } = position || {};

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
    if (selectedClient && refClient.current[`${selectedClient.latitud}-${selectedClient.longitud}`]) {
      refClient.current[`${selectedClient.latitud}-${selectedClient.longitud}`].openPopup();
    }
  }, [selectedClient]);

  useEffect(() => {
    const handleBroadcastLocation = (data) => {
      console.log('LOCATION', data);
      if (data && typeof data === 'object') {
        setTechnicians(() => {
          const updatedTechnicians = {};
          Object.keys(data).forEach((key) => {
            if (data[key].status !== 'desconectado') {
              updatedTechnicians[key] = data[key];
            }
          });
          return updatedTechnicians;
        });
      }
    };

    const handleUserStatus = (data) => {
      console.log('STATUS UPDATE', data);
      if (data && typeof data === 'object') {
        setTechnicians(() => {
          const updatedTechnicians = {};
          Object.keys(data).forEach((key) => {
            if (data[key].status !== 'desconectado') {
              updatedTechnicians[key] = data[key];
            }
          });
          return updatedTechnicians;
        });
      }
    };

    socket.on('broadcastLocation', handleBroadcastLocation);
    socket.on('userStatus', handleUserStatus);

    return () => {
      socket.off('broadcastLocation', handleBroadcastLocation);
      socket.off('userStatus', handleUserStatus);
    };
  }, []);

  //console.log(technicians);
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

        <MarkerClusterGroup>
          {(filter === 'technicians' || filter === 'both') &&
            Object.keys(technicians).map((key) => {
              const technician = technicians[key];
              return (
                technician.status !== 'desconectado' &&
                technician.latitude &&
                technician.longitude && (
                  <Marker key={key} position={[technician.latitude, technician.longitude]} icon={myIcon}>
                    <Popup>
                      <div className='popup-tecnico'>
                        <img src={`https://via.placeholder.com/50`} alt='Technician' />
                        <div className='popup-content'>
                          <h4>{technician.nombre}</h4>

                          <p>{technician.telefono}</p>
                        </div>
                      </div>
                      <div className='popup-tecnico-button'>
                        <button onClick={() => handleTechnicianSelect(technician)}>
                          <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' fill='currentColor' className='bi bi-arrow-right' viewBox='0 0 15 15'>
                            <path fillRule='evenodd' d='M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8' />
                          </svg>
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                )
              );
            })}

          {selectedTechnician && (
            <Marker position={[selectedTechnician.latitud, selectedTechnician.longitud]} icon={myIcon}>
              <Popup>
                <div className='popup-tecnico'>
                  <img src={`https://via.placeholder.com/50`} alt='Technician' />
                  <div className='popup-content'>
                    <h4>{selectedTechnician.nombre}</h4>
                    <p>{selectedTechnician.telefono}</p>
                  </div>
                </div>
                <div className='popup-tecnico-button'>
                  <button onClick={() => handleTechnicianSelect(selectedTechnician)}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' fill='currentColor' className='bi bi-arrow-right' viewBox='0 0 15 15'>
                      <path fillRule='evenodd' d='M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8' />
                    </svg>
                  </button>
                </div>
              </Popup>
            </Marker>
          )}
        </MarkerClusterGroup>
        <MarkerClusterGroup>
          {(filter === 'clients' || filter === 'both') &&
            clientes.map((cliente, index) => (
              <Marker
                key={index}
                position={[cliente.latitud, cliente.longitud]}
                icon={clienteIcono}
                ref={(ref) => {
                  refClient.current[`${cliente.latitud}-${cliente.longitud}`] = ref;
                }}
              >
                <Popup>
                  <div className='popup-tecnico'>
                    <img src={`https://via.placeholder.com/50`} alt='Client' />
                    <div className='popup-content'>
                      <h4>{cliente.nombre}</h4>
                      <p>{cliente.telefono}</p>
                    </div>
                  </div>
                  <div className='popup-tecnico-button'>
                    <button onClick={() => handleOpenModalWithClientData(cliente)}>
                      <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' fill='currentColor' className='bi bi-arrow-right' viewBox='0 0 15 15'>
                        <path fillRule='evenodd' d='M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8' />
                      </svg>
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MarkerClusterGroup>
      </MapContainer>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleModalClose}>
          <NuevaOrden selectedClientData={selectedClientData} />
        </Modal>
      )}
    </>
  );
};

export default Map;
