import NotificacionesDetalle from './NotificacionesDetalle';
import Alertas from './Alertas';
import Header from '../Header/Header';
import socket from '../services/socketService.tsx';
import { useEffect } from 'react';

const Notificaciones = () => {
  useEffect(() => {
    // Registrando el evento para escuchar las notificaciones
    socket.on('todasNotificaciones', (data) => {
      console.log('Notificación recibida:', data);
    });

    // Limpieza del evento cuando se desmonta el componente
    return () => {
      socket.off('todasNotificaciones');
    };
  }, []);

  const handleSocket = () => {
    // Emite un evento de notificación de ejemplo
    socket.emit('todasNotificaciones', { mensaje: 'Nueva notificación desde Notificaciones!' });
  };
  return (
    <div className='vw-100 p-3 '>
      <Header text='Notificaciones' />
      <div className='row p-5 mt-5'>
        <div className='col-6'>
          <NotificacionesDetalle />
        </div>
        <div className='col-6'>
          <Alertas />
        </div>
      </div>
      <button onClick={handleSocket}>socket</button>
    </div>
  );
};

export default Notificaciones;
