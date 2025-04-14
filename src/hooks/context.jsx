/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modificarOrden } from '../services/ordenesService';
const Context = createContext();

export const Provider = ({ children }) => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const navigate = useNavigate();
  const [user, setUser] = useState(usuario);
  const [notifications, setNotifications] = useState([]);

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

  const getEmpleadosListaCompleta = async () => {
    try {
      const data = await fetch('https://lv-back.online/empleados');
      const response = data.json();
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const editPorcentajeEmpleado = async (id, empleado) => {
    try {
      const data = await fetch(`https://lv-back.online/empleados/modificar/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ porcentaje_arreglo: empleado.porcentaje_arreglo }),
      });
      const result = await data.json();
      if (result) {
        console.log('Porcentaje de arreglo agregado con exito!!!');
        return true;
      } else {
        console.log('Se produjo un error, el Porcentaje no pudo ser registrado');
        return false;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const editEmpleado = async (id, empleado) => {
    try {
      const data = await fetch(`https://lv-back.online/empleados/modificar/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empleado),
      });
      const result = await data.json();
      if (result) {
        console.log('Empleado editado con exito!!!');
        return true;
      } else {
        console.log('Se produjo un error, el empleado no pudo ser editado...');
        return false;
      }
    } catch (error) {
      console.error('Error al editar el empleado.', error);
    }
  };

  //CLIENTES
  const listaClientes = async () => {
    try {
      const response = await fetch('https://lv-back.online/clientes/lista');
      const clientes = await response.json();
      if (clientes[0] !== undefined) {
        //console.log(`Se encontró una lista con ${clientes.length} clientes!!`);
        //console.log(clientes);
        return clientes;
      } else {
        console.log('Aún no se registra ningún cliente...');
        return false;
      }
    } catch (error) {
      console.error('Error, no se encontraron clientes en la base de datos....', error);
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
  const postCliente = async (cliente) => {
    try {
      const data = await fetch('https://lv-back.online/clientes/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente),
      });
      const result = await data.json();
      if (result) {
        console.log('Cliente agregado con exito!!!');
        return true;
      } else {
        console.log('Se produjo un error, el cliente no pudo ser agregado...');
        return false;
      }
    } catch (error) {
      console.error('Error al guardar el cliente.', error);
    }
  };
  //ORDENES!!
  const ordenesGenerales = async () => {
    try {
      const ordenesResponse = await fetch('https://lv-back.online/ordenes');
      if (!ordenesResponse.ok) {
        throw new Error('Error al obtener datos de las APIs');
      }
      return await ordenesResponse.json();
    } catch (error) {
      console.error('Error al obtener datos:', error);
      throw error;
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
  const handleAprobar = async (orden) => {
    try {
      const ordenActualizada = { ...orden, id_tipo_estado: 1 };
      const resultado = await modificarOrden(orden.id, ordenActualizada);
      if (resultado) {
        console.log('Orden aprobada con éxito.');
      } else {
        console.log('Error al aprobar la orden.');
      }
    } catch (error) {
      console.error('Error al aprobar la orden:', error);
    }
  };

  const guardarRepuestoOrden = async ({ id_orden, id_repuesto }) => {
    const repuesto = { id_orden, id_repuesto };
    try {
      const response = await fetch('https://lv-back.online/ordenes/repuestos/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(repuesto),
      });
      const result = await response.json();
      if (result) {
        console.log('Repuesto agregado con exito!!!');
        return true;
      } else {
        console.log('Se produjo un error, el repuesto no pudo ser agregado...');
        return false;
      }
    } catch (error) {
      console.error('Error al guardar el repuesto.', error);
    }
  };
  //FEEDBACK
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

  const getFeedbacks = async () => {
    try {
      const data = await fetch('https://lv-back.online/feedbacks/listado');
      const response = await data.json();
      return response;
    } catch (error) {
      console.error('Error al traer los feedbacks: ', error);
    }
  };

  //NOTIFICACIONES
  const handleNotifications = async () => {
    try {
      const data = await fetch('https://lv-back.online/notificaciones/');
      const response = await data.json();
      return response;
    } catch (error) {
      console.error('Error en tryCactch: ', error);
    }
  };

  const marcarNotificacionVista = async (idEmpleado) => {
    try {
      const response = await fetch(`https://lv-back.online/notificaciones/modificar/${idEmpleado}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      if (result[0] > 0) {
        console.log('Notificaciones revisadas!!!');
        return true;
      } else {
        console.log('Se produjo un error, la notificacion no fue revisada...');
        return false;
      }
    } catch (error) {
      console.error('Error al modificar la notificacion.', error);
    }
  };
  const listaRepuestos = async () => {
    try {
      const response = await fetch('https://lv-back.online/repuestos/lista');
      const repuestos = await response.json();
      if (repuestos[0] !== undefined) {
        console.log(`Se encontró un listado con ${repuestos.length} repuestos!!`);
        return repuestos;
      } else {
        console.log('Aún no se registra ningún repuesto...');
        return false;
      }
    } catch (error) {
      console.error('Error, no se encontraron repuestos en la base de datos....', error);
    }
  };
  const repuestosOrdenes = async () => {
    try {
      const response = await fetch('https://lv-back.online/orden/repuestos');
      const repuestos = await response.json();
      if (repuestos[0] !== undefined) {
        //console.log(`Se encontró un listado con ${repuestos.length} repuestos!!`);
        return repuestos;
      } else {
        console.log('Aún no se registra ningún repuesto...');
        return false;
      }
    } catch (error) {
      console.error('Error, no se encontraron repuestos en la base de datos....', error);
    }
  };
  const stockReserva = async () => {
    try {
      const response = await fetch('https://lv-back.online/stock/reserva/lista');
      const repuestos = await response.json();
      if (repuestos[0] !== undefined) {
        //console.log(`Se encontró un listado con ${repuestos.length} repuestos!!`);
        return repuestos;
      } else {
        console.log('Aún no se registra ningún repuesto...');
        return false;
      }
    } catch (error) {
      console.error('Error, no se encontraron repuestos en la base de datos....', error);
    }
  };
  const stockCamioneta = async () => {
    try {
      const response = await fetch('https://lv-back.online/stock/camioneta/lista');
      const repuestos = await response.json();
      if (repuestos[0] !== undefined) {
        //console.log(`Se encontró un listado con ${repuestos.length} repuestos!!`);
        return repuestos;
      } else {
        console.log('Aún no se registra ningún repuesto...');
        return false;
      }
    } catch (error) {
      console.error('Error, no se encontraron repuestos en la base de datos....', error);
    }
  };

  // Liquidacion empleados
  const getPresupuestos = async () => {
    try {
      const response = await fetch('https://lv-back.online/presupuestos');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Problemas al obtener las liquidaciones: ', error);
    }
  };

  const getLiquidacionesPendientes = async () => {
    try {
      const response = await fetch('https://lv-back.online/liquidacionesPendientes');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Problemas al obtener las liquidaciones pendientes: ', error);
    }
  };

  const listaFacturasCompra = async () => {
    try {
      const response = await fetch('https://lv-back.online/facturascompra/lista');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('error en el servidor revisar ruta', error);
    }
  };
  const listaFacturasVenta = async () => {
    try {
      const response = await fetch('https://lv-back.online/facturasventa/lista');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('error en el servidor, revisar rutas', error);
    }
  };

  const PostSaldosPendientes = async (dataBody) => {
    const { caja, presupuesto, facturaCompra, tecnico, monto, tipo } = await dataBody;
    try {
      const response = await fetch('https://lv-back.online/saldosPendientes/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_caja: caja,
          id_presupuesto: presupuesto,
          id_factura_compra: facturaCompra,
          id_tecnico: tecnico,
          monto: monto,
          tipo: tipo,
        }),
      });
      const data = await response.json();
      return {
        message: 'Saldos Pendientes guardados con exito',
        data,
      };
    } catch (error) {
      console.error('error en el servidor, revisar rutas', error);
    }
  };

  const getSaldosPendientes = async () => {
    try {
      const response = await fetch('https://lv-back.online/saldosPendientes/lista');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('error en el servidor, revisar rutas', error);
    }
  };

  const getLiquidacionesHechas = async () => {
    try {
      const response = await fetch('https://lv-back.online/liquidaciones');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Problemas al obtener las liquidaciones: ', error);
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
        getEmpleadosListaCompleta,
        editPorcentajeEmpleado,
        editEmpleado,
        //clientes
        getClienteById,
        listaClientes,
        postCliente,
        //Ordenes
        ordenes,
        ordenesGenerales,
        handleAprobar,
        guardarRepuestoOrden,
        //Repuesto
        listaRepuestos,
        repuestosOrdenes,
        stockReserva,
        stockCamioneta,
        //feedback
        sendFeedback,
        getFeedbacks,
        //Notificaciones
        handleNotifications,
        marcarNotificacionVista,
        notifications,
        setNotifications,
        //Facturas
        listaFacturasCompra,
        listaFacturasVenta,
        //Liquidaciones
        getPresupuestos,
        getLiquidacionesPendientes,
        getLiquidacionesHechas,
        //Saldos Pendientes
        PostSaldosPendientes,
        getSaldosPendientes,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export function useCustomContext() {
  return useContext(Context);
}

 