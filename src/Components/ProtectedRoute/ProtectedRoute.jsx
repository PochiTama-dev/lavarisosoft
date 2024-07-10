import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import { useCustomContext } from '../../hooks/context';
import { useEffect } from 'react';

const PrivateRoute = ({ roles }) => {
  const { handleNavigate } = useCustomContext();
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  useEffect(() => {
    if (!usuario) {
      console.log('No hay usuario');
      return handleNavigate('/');
    }
    if (roles && !roles.includes(usuario.tipoRol)) {
      console.log(`El ${usuario.tipoRol} no puede acceder a esta ruta: ${roles}`);
      handleNavigate('/menu');
    }
  }, [usuario.tipoRol]);

  return <Outlet />;
};

export default PrivateRoute;

PrivateRoute.propTypes = {
  roles: PropTypes.array,
};
