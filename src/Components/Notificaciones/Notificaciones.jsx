/* eslint-disable no-unused-vars */
import NotificacionesDetalle from './NotificacionesDetalle';
import Alertas from './Alertas';
import Header from '../Header/Header';
import { useNotificationContext } from '../../hooks/NotificationContext';

const Notificaciones = () => {
 

  return (
    <div className='vw-100 p-3 '>
      <Header text='Notificaciones' />
      <div className='row p-5 mt-5'>
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
    {/*       <Alertas /> */}
        </div>
      </div>
    </div>
  );
};

export default Notificaciones;
