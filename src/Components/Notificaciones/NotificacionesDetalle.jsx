import { useState, useEffect } from 'react';
import './Notificaciones.css';
import { useCustomContext } from '../../hooks/context';
import ModalAprobar from './ModalAprobar';
import checked from '../../assets/cheked.webp';

const NotificacionesDetalle = () => {
  const { handleNotifications, getEmpleadosLista, user, ordenesGenerales, marcarNotificacionVista } = useCustomContext();
  const [notificaciones, setNotificaciones] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState();
  const [checkedNotifications, setCheckedNotifications] = useState([]);
  const [checkedOrders, setCheckedOrders] = useState([]);
  const [hoveredItem, setHoveredItem] = useState();
  const [aprobado, setAprobado] = useState(false);

  useEffect(() => {
    fetchData();

    // Manejar notificaciones dependiendo del rol del usuario
  }, [aprobado]);

  // Llamadas a la API
  const fetchData = async () => {
    await callNotifications();
    await callOrdenes();
  };

  const callNotifications = async () => {
    const notifications = await handleNotifications();
    const empleadosFetch = await getEmpleadosLista();
    const notificacionesEmpleados = notifications.map((notifi) => ({
      ...notifi,
      id_empleado: empleadosFetch.find((empleado) => empleado.id === notifi.id_empleado),
    }));
    setNotificaciones(notificacionesEmpleados.filter((revision) => revision.revisada === 0));
  };

  const callOrdenes = async () => {
    const ordenes = await ordenesGenerales();
    setOrdenes(ordenes.filter((orden) => orden.id_tipo_estado === 4)); // Ordenes pendientes de aprobación
  };

  // Manejo del modal
  const handleModal = (order) => {
    setSelectedOrder(order);
    setModal(true);
  };

  // Manejadores de hover y check
  const handleCheck = (type, index) => {
    setHoveredItem(index);
  };

  const handleChecked = (type, index) => {
    if (type === 'notificacion') {
      setCheckedNotifications((prev) => [...prev, index]);
      marcarNotificacionVista(index);
    } else if (type === 'orden') {
      setCheckedOrders((prev) => [...prev, index]);
      console.log(checkedOrders);
    }
  };

  // Renderizado de notificaciones y órdenes
  const renderNotificacion = (notificacion, i) => {
    const isChecked = checkedNotifications.includes(i);
    const isHovered = hoveredItem === i;

    return (
      <div key={i} className='d-flex justify-content-between'>
        <b>{notificacion.TiposNotificacione.tipo_notificacion}</b>
        <b>de {notificacion.id_empleado.nombre}</b>
        <img
          onClick={() => handleChecked('notificacion', i)}
          onMouseEnter={() => handleCheck('notificacion', i)}
          onMouseLeave={() => setHoveredItem(null)}
          className={`check ${isChecked ? 'checked' : ''} ${isHovered ? 'hover-class' : ''}`}
          src={checked}
          alt='visto'
        />
      </div>
    );
  };

  const handleAproveAndUncheck = (order) => {
    setCheckedOrders((prev) => prev.filter((orderIndex) => orderIndex !== order.id)); // Eliminar la orden de los chequeados
    setAprobado(!aprobado); // Cambia el estado para forzar el re-render
    setHoveredItem(null); // Restablecer el hover
  };

  const renderOrden = (orden, index) => {
    const isChecked = checkedOrders.includes(index);
    const isHovered = hoveredItem === index;
    return (
      <div className='d-flex justify-content-between mt-2' onClick={() => handleModal(orden)} key={index}>
        <b>Orden pendiente de aprobación #{orden.numero_orden}</b>
        <img
          onClick={() => handleChecked('orden', index)}
          onMouseEnter={() => handleCheck('orden', index)}
          onMouseLeave={() => setHoveredItem(null)}
          className={`check ${isChecked ? 'checked' : ''} ${isHovered ? 'hover-class' : ''}`}
          src={checked}
          alt='visto'
        />
      </div>
    );
  };

  // Combinación de notificaciones y órdenes
  const combinedList = [...notificaciones.map((notificacion) => ({ type: 'notificacion', ...notificacion })), ...ordenes.map((orden) => ({ type: 'orden', ...orden }))];
  return (
    <div className='container p-5 notificaciones-container'>
      <h2>Notificaciones</h2>
      {combinedList.map((item, i) => (
        <div key={i} className='d-flex justify-content-evenly'>
          <div className='row my-3 contentWidth'>
            <div className='col-1 d-flex justify-content-center'>
              <div className='notification-badge'></div>
            </div>
            <div className='col-10 p-0'>
              <div className='item-notification'>{item.type === 'notificacion' ? renderNotificacion(item, i) : renderOrden(item, i)}</div>
            </div>
          </div>
          <hr />
        </div>
      ))}
      {modal && user.tipoRol === 'Atención al cliente' && <ModalAprobar aprobar={() => setAprobado(!aprobado)} orden={selectedOrder} handleClose={() => setModal(false)} />}
    </div>
  );
};

export default NotificacionesDetalle;
