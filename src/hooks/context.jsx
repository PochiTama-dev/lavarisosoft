/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Context = createContext();

export const Provider = ({ children }) => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const navigate = useNavigate();
  const [user, setUser] = useState(usuario);

  const handleNavigate = (text) => {
    navigate(`${text}`);
  };
  const handleEdit = (items) => {
    navigate(`editarStockRepuestos/editarProducto/:${items.id}`);
  };

  const checkRol = (usuario) => {
    let result = '';
    switch (usuario) {
      case 1: //"Atención al cliente"
        result = 'Atencion al cliente';
        return result;
      case 2: //"Contable administrativo"
        result = 'Contable administrativo';
        return result;
      case 3: //"Jefe de taller"
        result = 'Jefe de taller';
        return result;
      case 4: //"Super administrador"
        result = 'Super administrador';
        return result;
      case 5: //"Técnico"
        result = 'Tecnico';
        return result;
      default:
        handleNavigate('login');
        break;
    }
  };

  const uploadEmpleadosExcel = async (empleadosForm) => {
    empleadosForm.forEach(async (empleado) => {
      const { id_rol, nombre, apellido, cuil, legajo, telefono, email, direccion, ubicacion } = await empleado;
      const fetchEmpleado = await fetch('https://lv-back.online/empleados/guardar', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_rol, nombre, apellido, cuil, legajo, telefono, email, direccion, ubicacion }),
      });
      console.log('status empleado: ', fetchEmpleado.status);
    });
  };

  return <Context.Provider value={{ handleNavigate, handleEdit, user, setUser, checkRol, uploadEmpleadosExcel }}>{children}</Context.Provider>;
};

export function useCustomContext() {
  return useContext(Context);
}
