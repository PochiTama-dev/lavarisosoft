import './Menu.css';
import { Link } from 'react-router-dom';
import Header from '../Header/Header.jsx';
import { useCustomContext } from '../../hooks/context.jsx';
import { useEffect } from 'react';
import socket from '../services/socketService.tsx';

const Menu = () => {
  const { user, handleNavigate } = useCustomContext();
  useEffect(() => {
    if (!user) handleNavigate('login');
    if (user.tipoRol === 'Super administrador') {
      socket.on('todasNotificaciones', handleNotificaciones);
    } else if (user.tipoRol === 'Jefe de taller') {
      socket.on('nuevaOrden', handleNotificaciones);
    } else if (user.tipoRol === 'Contable administrativo') {
      socket.on('ordenActualizada', handleNotificaciones);
    }
  }, [user]);
  const handleNotificaciones = (data) => {
    console.log('Mensaje recibido:', data);
  };
  return (
    <div className='container-full-width' style={{ overflow: 'hidden' }}>
      <Header text='Menú Principal' showBackButton={false} />
      <h3
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingRight: '8%',
          marginBottom: '2%',
          marginTop: '6%',
          fontWeight: '500',
          color: 'black',
        }}
      >
        Sesión de: {user?.email}
      </h3>
      {user?.tipoRol === 'Super administrador' ? (
        <div className='row menu-button-container'>
          <div className='col-md-4'>
            <div className='btn-group-vertical '>
              <Link to='/agenda' className='btn btn-lg btn-block menu-button'>
                Agenda
              </Link>
              <Link to='/feedback' className='btn btn-lg btn-block menu-button'>
                Feedback
              </Link>
            </div>
            <div className='btn-group-vertical '>
              <Link to='/notificaciones' className='btn btn-lg btn-block menu-button'>
                Notificaciones
              </Link>
            </div>
            <div className='btn-group-vertical '>
              <Link to='/presupuestos' className='btn btn-lg btn-block menu-button'>
                Presupuestos
              </Link>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='btn-group-vertical '>
              <Link to='/ventas' className='btn btn-lg btn-block menu-button'>
                Ventas
              </Link>
            </div>
            <div className='btn-group-vertical '>
              <Link to='/mantenimiento' className='btn btn-lg btn-block menu-button'>
                Mantenimiento
              </Link>
            </div>
            <div className='btn-group-vertical '>
              <Link to='/clientes' className='btn btn-lg btn-block menu-button'>
                Clientes y empleados
              </Link>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='btn-group-vertical '>
              <Link to='/chat' className='btn btn-lg btn-block menu-button'>
                Chat
              </Link>
            </div>
            <div className='btn-group-vertical '>
              <Link to='/location' className='btn btn-lg btn-block menu-button'>
                Ubicaciones tiempo real
              </Link>
            </div>
            <div className='btn-group-vertical'>
              <Link to='/ordenes' className='btn btn-lg btn-block menu-button'>
                Ordenes
              </Link>
            </div>
          </div>
        </div>
      ) : user?.tipoRol === 'Jefe de taller' ? (
        <div className='row menu-button-container'>
          <div className='col-md-4'>
            <div className='btn-group-vertical '>
              <Link to='/agenda' className='btn btn-lg btn-block menu-button'>
                Agenda
              </Link>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='btn-group-vertical '>
              <Link to='/notificaciones' className='btn btn-lg btn-block menu-button'>
                Notificaciones
              </Link>
            </div>
          </div>
        </div>
      ) : user?.tipoRol === 'Contable administrativo' ? (
        <div className='row menu-button-container'>
          <div className='col-md-4'>
            <div className='btn-group-vertical '>
              <Link to='/presupuestos' className='btn btn-lg btn-block menu-button'>
                Presupuestos
              </Link>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='btn-group-vertical '>
              <Link to='/ventas' className='btn btn-lg btn-block menu-button'>
                Ventas
              </Link>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='btn-group-vertical '>
              <Link to='/mantenimiento' className='btn btn-lg btn-block menu-button'>
                Mantenimiento
              </Link>
            </div>
          </div>
        </div>
      ) : user?.tipoRol === 'Atención al cliente' ? (
        <div className='row menu-button-container'>
          <div className='col-md-4'>
            <div className='btn-group-vertical '>
              <Link to='/clientes' className='btn btn-lg btn-block menu-button'>
                Clientes y empleados
              </Link>
              <Link to='/presupuestos' className='btn btn-lg btn-block menu-button'>
                Presupuestos
              </Link>
            </div>
          </div>
          <div className='col-md-4'>
            <Link to='/chat' className='btn btn-lg btn-block menu-button'>
              Chat
            </Link>
            <Link to='/notificaciones' className='btn btn-lg btn-block menu-button'>
              Notificaciones
            </Link>
            <div className='btn-group-vertical '></div>
          </div>
          <div className='col-md-4'>
            <Link to='/ventas' className='btn btn-lg btn-block menu-button'>
              Ventas
            </Link>
            <div className='btn-group-vertical '></div>
          </div>
        </div>
      ) : user?.tipoRol === 'Técnico' ? (
        <div className='row menu-button-container'>
          <div className='col-md-4'>
            <div className='btn-group-vertical '>
              <Link to='/presupuestos' className='btn btn-lg btn-block menu-button'>
                Presupuestos
              </Link>
              <Link to='/agenda' className='btn btn-lg btn-block menu-button'>
                Agenda
              </Link>
              <Link to='/notificaciones' className='btn btn-lg btn-block menu-button'>
                Notificaciones
              </Link>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='btn-group-vertical '>
              <Link to='/chat' className='btn btn-lg btn-block menu-button'>
                Chat
              </Link>
              <Link to='/location' className='btn btn-lg btn-block menu-button'>
                Ubicaciones tiempo real
              </Link>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='btn-group-vertical'>
              <Link to='/ordenes' className='btn btn-lg btn-block menu-button'>
                Ordenes
              </Link>
              <Link to='/mantenimiento' className='btn btn-lg btn-block menu-button'>
                Mantenimiento
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Menu;
