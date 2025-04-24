/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import './Notificaciones.css';
import { useNotificationContext } from '../../hooks/NotificationContext';
import checked from '../../assets/cheked.webp';
import { haversine } from '../Ubicaciones/calcularDistancia';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const NotificacionesDetalle = () => {
  const { notifications, setNotifications } = useNotificationContext();
  const [hoveredItem, setHoveredItem] = useState();
  const [checkedOrders, setCheckedOrders] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [nearbyTechnicians, setNearbyTechnicians] = useState({});
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
/*     getEmpleadosClientes(); */
  }, [notifications]);

  const handleCheck = (index) => {
    setHoveredItem(index);
  };
/* 
  const getEmpleadosClientes = async () => {
    const empleados = await getEmpleadosLista();
    const clientes = await listaClientes();

    setTecnicos(empleados);
    setClientes(clientes);
  }; */

  const handleCheckedNotification = (noti) => {
    setCheckedOrders((prevCheckedOrders) => {
      if (prevCheckedOrders.includes(noti.timestamp)) {
        return prevCheckedOrders.filter((checkedTimestamp) => checkedTimestamp !== noti.timestamp);
      } else {
        return [...prevCheckedOrders, noti.timestamp];
      }
    });

    setNotifications((notifi) => {
      const updatedNotifications = notifi.filter((notification) => notification.timestamp !== noti.timestamp);
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications)); // Update localStorage
      return updatedNotifications;
    });
  };

  const handleCheckAllNotifications = () => {
    const allTimestamps = notifications.map((noti) => noti.timestamp); // Obtener todos los timestamps
    setCheckedOrders(allTimestamps); // Marcar todas como "checkeadas"

    setNotifications(() => {
      localStorage.setItem('notifications', JSON.stringify([])); // Limpiar localStorage
      return []; // Vaciar las notificaciones
    });
  };

  const renderOrdenNotificacion = (orden, index) => {
    const isChecked = checkedOrders.includes(orden.timestamp); 
    const isHovered = hoveredItem === index;

    const notificationTime = orden.timestamp
      ? new Date(orden.timestamp).toLocaleTimeString()
      : 'Sin tiempo'; // Manejar notificaciones sin timestamp

    const isNearbyTechnician = nearbyTechnicians[orden.tecnicoId]; 

    const handleNotificationClick = (orden) => {
      if (orden.message.includes('entrega')) {
  
 
        navigate('/presupuestos', { state: { ordenId: orden.id } });  
      }
    };

    return (
      <div
        className='d-flex justify-content-between align-items-center mt-2'
        key={orden.timestamp}
        onClick={() => handleNotificationClick(orden)} // Pass the order to the click handler
        style={{ cursor: orden.message.includes('entrega') ? 'pointer' : 'default' }} // Change cursor for clickable notifications
      >
        <div className='d-flex align-items-center'>
          <div className={`circle-indicator ${isNearbyTechnician ? 'orange-circle' : ''}`}></div>  
          <div className='ms-2 text-start'>
            <b>{orden.message}</b> <span className='text-muted small ms-2'>{notificationTime}</span>
          </div>
        </div>
        <img
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the parent onClick
            handleCheckedNotification(orden);
          }}
          onMouseEnter={() => handleCheck(index)}
          onMouseLeave={() => setHoveredItem(null)}
          className={`check ${isChecked ? 'checked' : ''} ${isHovered ? 'hover-class' : ''} pointer`}
          src={checked}
          alt='visto'
        />
      </div>
    );
  };

  return (
    <div className='container p-5 notificaciones-container'>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <h2>Notificaciones</h2>
      <button
        className='btn btn-primary mb-3'
        onClick={handleCheckAllNotifications}
        style={{background: '#69688C', border: 'none'}}
      >
        Eliminar todas
      </button>

      </div>
      {notifications &&
        [...notifications]
          .sort((a, b) => b.timestamp - a.timestamp) // Ordenar de más nuevas a más viejas
          .map((noti, i) => (
            <div key={i} className='justify-content-evenly'>
              <div className='my-3 contentWidth align-items-center justify-content-between'>
                <div className='item-notification'>{renderOrdenNotificacion(noti, i)}</div>
              </div>
              <hr />
            </div>
          ))}
    </div>
  );
};

export default NotificacionesDetalle;
