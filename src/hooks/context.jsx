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
    navigate(`editarStockRepuestos/editarProducto/${items.id}`);
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
        body: JSON.stringify({
          id_rol,
          nombre,
          apellido,
          cuil,
          legajo,
          telefono,
          email,
          direccion,
          ubicacion,
        }),
      });
      console.log('status empleado: ', fetchEmpleado.status);
    });
  };

  const getEmpleadosLista = async () => {
    try {
      const data = await fetch('https://lv-back.online/empleados/listado');
      const response = data.json();
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const getClienteById = async (id) => {
    try {
      const data = await fetch(`https://lv-back.online/clientes/${id}`);
      const cliente = data.json();
      return cliente;
    } catch (error) {
      console.error(error);
    }
  };
  const ordenes = async () => {
    try {
      const empleadoId = localStorage.getItem('empleadoId');

      const ordenesResponse = await fetch('https://lv-back.online/ordenes');
      const clientesResponse = await fetch('https://lv-back.online/clientes/lista');

      if (!ordenesResponse.ok || !clientesResponse.ok) {
        throw new Error('Error al obtener datos de las APIs');
      }

      const ordenes = await ordenesResponse.json();
      const clientes = await clientesResponse.json();

      if (ordenes.length > 0 && clientes.length > 0) {
        const clientesMap = new Map(clientes.map((cliente) => [cliente.id, cliente]));

        const ordenesConClientes = ordenes.map((orden) => ({
          ...orden,
          cliente: clientesMap.get(orden.cliente_id),
        }));
        ordenes.filter((orden) => orden.Empleado.id == empleadoId);
        return ordenesConClientes;
      } else {
        console.log('No se encontraron órdenes o clientes en la base de datos.');
        return [];
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);
      throw error;
    }
  };

  const sendFeedback = async (feedback) => {
    try {
      const data = await fetch(`https://lv-back.online/feedbacks/guardar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback),
      });
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Context.Provider
      value={{
        handleNavigate,
        handleEdit,
        user,
        setUser,
        checkRol,
        uploadEmpleadosExcel,
        //empleados
        getEmpleadosLista,
        //clientes
        getClienteById,
        //Ordenes
        ordenes,
        //feedback
        sendFeedback,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export function useCustomContext() {
  return useContext(Context);
}
