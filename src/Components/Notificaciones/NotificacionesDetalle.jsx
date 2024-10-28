import { useState, useEffect } from 'react';
import './Notificaciones.css';
import { useCustomContext } from '../../hooks/context';
import checked from '../../assets/cheked.webp';
import { haversine } from '../Ubicaciones/calcularDistancia';

const NotificacionesDetalle = () => {
  const { notifications, setNotifications, getEmpleadosLista, listaClientes } = useCustomContext();
  const [hoveredItem, setHoveredItem] = useState();
  const [checkedOrders, setCheckedOrders] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [nearbyTechnicians, setNearbyTechnicians] = useState({});

  useEffect(() => {
    getEmpleadosClientes();
  }, [notifications]);

  useEffect(() => {
    const timers = {};
    const startTimes = {};

    tecnicos.forEach((tecnico) => {
      const clienteCercano = clientes.find((cliente) => {
        const distancia = haversine(tecnico.latitud, tecnico.longitud, cliente.latitud, cliente.longitud);
        return distancia <= 0.1; // 100 metros
      });

      if (clienteCercano) {
        if (!nearbyTechnicians[tecnico.id]) {
          const cercaMessage = `El técnico ${tecnico.nombre} está cerca del cliente ${clienteCercano.nombre}.`;
          setNotifications((prevNotifications) => [...prevNotifications, { message: cercaMessage, tecnicoId: tecnico.id, timestamp: Date.now() }]);
          startTimes[tecnico.id] = Date.now();
          setNearbyTechnicians((prevState) => ({
            ...prevState,
            [tecnico.id]: clienteCercano.nombre,
          }));
        }
      } else {
        // Limpiar temporizador si el técnico ya no está cerca
        if (nearbyTechnicians[tecnico.id]) {
          const endTime = Date.now();
          const elapsedTime = endTime - startTimes[tecnico.id];
          delete timers[tecnico.id];

          const timeSpent = formatElapsedTime(elapsedTime);
          const tiempoMessage = `El técnico ${tecnico.nombre} estuvo cerca del cliente ${nearbyTechnicians[tecnico.id]} por ${timeSpent}.`;
          setNotifications((prevNotifications) => [...prevNotifications, { message: tiempoMessage, tecnicoId: tecnico.id, timestamp: Date.now() }]);
          // Limpiar el estado de cercanía del técnico
          setNearbyTechnicians((prevState) => {
            const newState = { ...prevState };
            delete newState[tecnico.id];
            return newState;
          });
        }
      }
    });
  }, [nearbyTechnicians]);

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
  const handleCheck = (index) => {
    setHoveredItem(index);
  };

  const getEmpleadosClientes = async () => {
    const empleados = await getEmpleadosLista();
    const clientes = await listaClientes();

    setTecnicos(empleados);
    setClientes(clientes);
  };

  const handleCheckedNotification = (noti, index) => {
    setCheckedOrders((prevCheckedOrders) => {
      // Si la orden ya está marcada como "checked", la eliminamos; si no, la agregamos
      if (prevCheckedOrders.includes(index)) {
        return prevCheckedOrders.filter((checkedIndex) => checkedIndex !== index);
      } else {
        return [...prevCheckedOrders, index];
      }
    });
    setNotifications((notifi) => notifi.filter((_, i) => i !== index));
  };
  const renderOrdenNotificacion = (orden, index) => {
    const isChecked = checkedOrders.includes(index);
    const isHovered = hoveredItem === index;
    return (
      <div className='d-flex justify-content-between mt-2' key={index}>
        <b>{orden.message}</b>
        <img
          onClick={() => handleCheckedNotification(orden, index)}
          onMouseEnter={() => handleCheck(index)}
          onMouseLeave={() => setHoveredItem(null)}
          className={`check ${isChecked ? 'checked' : ''} ${isHovered ? 'hover-class' : ''} pointer`}
          src={checked}
          alt='visto'
        />
        {/* <div className='barraCarga'></div> */}
      </div>
    );
  };

  return (
    <div className='container p-5 notificaciones-container'>
      <h2>Notificaciones</h2>
      {notifications &&
        notifications.map((noti, i) => (
          <div key={i} className='d-flex justify-content-evenly'>
            <div className='row my-3 contentWidth'>
              <div className='col-1 d-flex justify-content-center'>
                <div className='notification-badge'></div>
              </div>
              <div className='col-10 p-0'>
                <div className='item-notification'>{renderOrdenNotificacion(noti, i)}</div>
              </div>
            </div>
            <hr />
          </div>
        ))}
    </div>
  );
};

export default NotificacionesDetalle;
