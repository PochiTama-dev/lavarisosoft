/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import NotificationPopup from './NotificationPopUp.jsx';  
import socket from '../Components/services/socketService.tsx';
import { useCustomContext } from './context';  
import { haversine } from '../Components/Ubicaciones/calcularDistancia';  

const NotificationContext = createContext();

// eslint-disable-next-line react/prop-types
export const NotificationProvider = ({ children }) => {
  const navigate = useNavigate(); // Inicializar navigate
  const { listaClientes } = useCustomContext();  
  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem('notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  });
  const [popupNotification, setPopupNotification] = useState(null);
  const [nearbyTechnicians, setNearbyTechnicians] = useState({});
  const [clientes, setClientes] = useState([]);
  const [technicianData, setTechnicianData] = useState({});  

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const clientesData = await listaClientes();
        setClientes(clientesData);
        console.log('Lista de clientes con latitud y longitud:', clientesData);
      } catch (error) {
        console.error('Error al obtener la lista de clientes:', error);
      }
    };

    fetchClientes();
  }, [listaClientes]);

  useEffect(() => {
    const handleNotificacion = (data) => {
      setNotifications((prevNotifi) => {
        const exists = prevNotifi.some((noti) => noti.message === data.message);
        if (!exists) {
          const updatedNotifications = [...prevNotifi, data];
          localStorage.setItem('notifications', JSON.stringify(updatedNotifications)); // Sync localStorage
          return updatedNotifications;
        }
        return prevNotifi;
      });
    };

    const handleEntregaCreated = (entrega) => {
      const newNotification = {
        message: `Nueva entrega creada: Orden #${entrega.id_orden} lista para liquidar`,
        id: entrega.id_orden,
        timestamp: Date.now(),
      };
      setNotifications((prevNotifi) => {
        const updatedNotifications = [...prevNotifi, newNotification];
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications)); // Sync localStorage
        return updatedNotifications;
      });
    };

    // Register socket listeners globally
    socket.on('todasNotificaciones', handleNotificacion);
    socket.on('entregaCreated', handleEntregaCreated);

    return () => {
      // Ensure listeners are removed when the component unmounts
      socket.off('todasNotificaciones', handleNotificacion);
      socket.off('entregaCreated', handleEntregaCreated);
    };
  }, []); // Ensure this runs globally, not tied to specific components

  useEffect(() => {
    const handleBroadcastLocation = (tecnicoData) => {
      // Extract the first key-value pair from the object
      const [tecnicoId, tecnicoInfo] = Object.entries(tecnicoData)[0];
      const { nombre: tecnicoNombre, latitude, longitude } = tecnicoInfo;

      console.log(`Ubicación recibida: Técnico ${tecnicoNombre}, Latitud: ${latitude}, Longitud: ${longitude}`);

      setTechnicianData((prevData) => ({ ...prevData, [tecnicoId]: tecnicoInfo }));  

      const clienteCercano = clientes.find((cliente) => {
        const distancia = haversine(latitude, longitude, cliente?.latitud, cliente?.longitud);
        return distancia <= 0.1; // 100 meters
      });

      if (clienteCercano) {
        if (!nearbyTechnicians[tecnicoId]) {
          console.log(`Técnico ${tecnicoNombre} cerca del cliente ${clienteCercano.nombre}`);
          setNearbyTechnicians((prevState) => ({
            ...prevState,
            [tecnicoId]: clienteCercano.nombre,
          }));
        }
      } else {
        if (nearbyTechnicians[tecnicoId]) {
          console.log(`Técnico ${tecnicoNombre} ya no está cerca del cliente ${nearbyTechnicians[tecnicoId]}`);
          setNearbyTechnicians((prevState) => {
            
            const newState = { ...prevState };
            delete newState[tecnicoId];
            return newState;
          });
        }
      }

      // Check if the notification exists in localStorage
      const savedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
      const cercaMessage = `El técnico ${tecnicoNombre} está cerca del cliente ${clienteCercano?.nombre}.`;
      const exists = savedNotifications.some((noti) => noti.message === cercaMessage);

      if (!exists && clienteCercano) {
        const newNotification = { message: cercaMessage, tecnicoId, timestamp: Date.now() };
        const updatedNotifications = [...savedNotifications, newNotification];
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications)); // Update localStorage
        setNotifications(updatedNotifications); // Sync state with localStorage
      }
    };

    socket.on('broadcastLocation', handleBroadcastLocation);

    return () => {
      socket.off('broadcastLocation', handleBroadcastLocation);
    };
  }, [clientes, nearbyTechnicians]); // Ensure this runs globally

  useEffect(() => {
    Object.keys(nearbyTechnicians).forEach((tecnicoId) => {
      const clienteNombre = nearbyTechnicians[tecnicoId];
      const tecnicoNombre = technicianData[tecnicoId]?.nombre; // Use technicianData to get the name

      console.log(`Ubicación recibida: Técnico ${tecnicoNombre}, Cliente: ${clienteNombre}`);
      const cercaMessage = `El técnico ${tecnicoNombre} está cerca del cliente ${clienteNombre}.`;

      setNotifications((prevNotifications) => {
        const exists = prevNotifications.some((noti) => noti.message === cercaMessage);
        if (!exists) {
          const newNotification = { message: cercaMessage, tecnicoId, timestamp: Date.now() };
          const updatedNotifications = [...prevNotifications, newNotification];
          localStorage.setItem('notifications', JSON.stringify(updatedNotifications)); // Sync localStorage
          console.log(`Agregando notificación: ${cercaMessage}`);
          return updatedNotifications;
        }
        return prevNotifications;
      });
    });
  }, [nearbyTechnicians, technicianData]);

  useEffect(() => {
    console.log('Notificaciones actualizadas:', notifications);
  }, [notifications]);

  // Este useEffect mostrará un popup con la última notificación de entrega recibida
  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[notifications.length - 1];
      if (latest.message.includes('entrega')) { // Mostrar solo notificaciones de entrega
        console.log('Mostrando popup para la notificación de entrega:', latest); // Depuración
        setPopupNotification(latest);
        const timer = setTimeout(() => {
          setPopupNotification(null);
        }, 5000); // Popup se oculta a los 5 segundos
        return () => clearTimeout(timer);
      }
    }
  }, [notifications]);

  return (
    <>
      <NotificationPopup
        message={popupNotification?.message}
        onClick={() => navigate('/notificaciones')} // Redirigir al hacer clic
      />
      <NotificationContext.Provider value={{ notifications, setNotifications, nearbyTechnicians, setNearbyTechnicians }}>
        {children}
      </NotificationContext.Provider>
    </>
  );
};

export const useNotificationContext = () => useContext(NotificationContext);
