import NotificacionesDetalle from './NotificacionesDetalle';
import Alertas from './Alertas';
import Header from '../Header/Header';
import socket from '../services/socketService.tsx';
import { useEffect, useState } from 'react';
import { useCustomContext } from '../../hooks/context.jsx';

const Notificaciones = () => {
  const { notifications, setNotifications } = useCustomContext();
  const [cssNotify, setCssNotify] = useState(false);

  useEffect(() => {
    // Definimos la función para manejar las notificaciones
    const handleNotificacion = (data) => {
      console.log('Notificación recibida:', data);
      setNotifications((prevNotifi) => {
        // Verificar si el mensaje ya existe en el array de notificaciones
        const mensajeExistente = prevNotifi.some((notificacion) => notificacion.message === data.message);

        if (!mensajeExistente) {
          console.log('Nuevo mensaje, agregando al estado.');
          return [...prevNotifi, data];
        } else {
          console.log('El mensaje ya existe en el array de notificaciones.');
          return prevNotifi; // Retorna el estado anterior sin cambios
        }
      });
      setTimeout(setCssNotify(!cssNotify), 1000);
    };

    // Registrando el evento para escuchar las notificaciones
    socket.on('todasNotificaciones', handleNotificacion);

    // Limpieza del evento cuando se desmonta el componente
    return () => {
      socket.off('todasNotificaciones', handleNotificacion);
    };
  }, []); // Dependencia vacía ya que usamos la versión previa del estado en setNotifi

  /* const handleTransition = () => { 
    setCssNotify(!cssNotify);
    console.log(cssNotify);
  }; */
  return (
    <div className='vw-100 p-3 '>
      <Header text='Notificaciones' />
      <div className='row p-5 mt-5'>
        {/* <button onClick={handleTransition}>transition</button> */}
        <div className='col-6'>
          <NotificacionesDetalle />
        </div>
        <div className='toast' role='alert' aria-live='assertive' aria-atomic='true'>
          <div className='toast-header'>
            <img src='...' className='rounded me-2' alt='...' />
            <strong className='me-auto'>Bootstrap</strong>
            <small>11 mins ago</small>
            <button type='button' className='btn-close' data-bs-dismiss='toast' aria-label='Close'></button>
          </div>
          <div className='toast-body'>Hello, world! This is a toast message.</div>
        </div>
        <div className='col-6'>
          <Alertas />
        </div>
        {/* <ul className='overflow-hidden position-absolute'>
          {notifications &&
            notifications.map((notificacion, i) => (
              <div key={i} className={`position-relative ${!cssNotify ? 'start-100' : 'notificacionAnim'}`}>
                <h4 className='notiX'>x</h4>
                <li className={`overflow-hidden position-absoulte`}>{notificacion.message}</li>
              </div>
            ))}
        </ul> */}
      </div>
    </div>
  );
};

export default Notificaciones;
