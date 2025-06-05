import { useState, useEffect } from 'react';
import Header from '../../Components/Header/Header.jsx';
import NuevosDatosCliente from '../../Components/Orders/NuevaOrden/NuevosDatosCliente.jsx';
import NuevosDatosIncidente from '../../Components/Orders/NuevaOrden/NuevosDatosIncidente.jsx';
import NuevosDatosTecnico from '../../Components/Orders/NuevaOrden/NuevosDatosTecnico.jsx';
import { object } from 'prop-types';
const verificarNumeroCliente = async () => {
  try {
    const response = await fetch('https://lv-back.online/clientes/lista', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const clientes = await response.json();
    const maxNumeroCliente = Math.max(...clientes.map((cliente) => parseInt(cliente.numero_cliente, 10)), 0);
    return maxNumeroCliente;
  } catch (error) {
    console.error('Error al verificar el número de cliente.', error);
    return 0;
  }
};

const guardarOrden = async (orden) => {
  try {
    const response = await fetch('https://lv-back.online/ordenes/guardar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orden),
    });
    const result = await response.json();
    if (result) {
      console.log('Orden guardada con éxito!!!');
      return result; 
    } else {
      console.log('Se produjo un error, la orden no pudo ser guardada...');
      return null;
    }
  } catch (error) {
    console.error('Error al guardar la orden.', error);
  }
};

const verificarExistenciaCliente = async (cliente) => {
  try {
    const response = await fetch(`https://lv-back.online/clientes/${cliente.id}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error al verificar la existencia del cliente.', error);
    return false;
  }
};

const guardarCliente = async (cliente) => {
  console.log('CLIENTE NUEVO: ', cliente);
  try {
    const clienteExistente = await verificarExistenciaCliente(cliente);

    if (clienteExistente) {
      console.log('El cliente ya existe en la base de datos.');
      return cliente.id; // Return the existing client's ID
    } else {
      const response = await fetch('https://lv-back.online/clientes/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente),
      });

      const result = await response.json();
      if (result) {
        console.log('Cliente guardado con éxito!!!');
        return result.id;
      } else {
        console.log('Se produjo un error, el cliente no pudo ser guardado...');
        return null;
      }
    }
  } catch (error) {
    console.error('Error al guardar el cliente.', error);
    return null;
  }
};

const guardarEvento = async (evento) => {
  try {
    const response = await fetch('https://lv-back.online/agenda/guardar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evento),
    });
    const result = await response.json();
    if (result) {
      console.log('Evento agendado con éxito!!!');
      console.log(result);
      return true;
    } else {
      console.log('Se produjo un error, el evento no pudo ser agendado...');
      return false;
    }
  } catch (error) {
    console.error('Error al agendar el evento.', error);
  }
};

const NuevaOrden = ({ clienteData }) => {
  const [cliente, setCliente] = useState(clienteData || {});
  const [incidente, setIncidente] = useState({});
  const [idEmpleado, setIdEmpleado] = useState(null);
  useEffect(() => {
    if (!clienteData) {
      const fetchMaxNumeroCliente = async () => {
        const maxNumeroCliente = await verificarNumeroCliente();
        setCliente((prevState) => ({
          ...prevState,
          numero_cliente: maxNumeroCliente + 1,
        }));
      };

      fetchMaxNumeroCliente();
    }
  }, [clienteData]);

  const handleSubmit = async () => {
    console.log(cliente);
    const verify = await verificarExistenciaCliente(cliente);
    console.log('INCIDENTE', incidente);
    if (!verify) {
      const clienteId = await guardarCliente(cliente);
      if (clienteId) {
        const orden = {
          numero_orden: incidente.numero_orden, 
          id_cliente: clienteId,
          id_empleado: idEmpleado || null,
          id_tipo_estado: incidente.id_tipo_estado, 
          equipo: incidente.equipo,
          modelo: incidente.modelo,
          marca: incidente.marca,
          antiguedad: incidente.antiguedad,
          motivo: incidente.diagnostico,
          repuestos: incidente.repuestos,
        };

        const ordenGuardada = await guardarOrden(orden);
        if (ordenGuardada) {
          const evento = {
            id_cliente: clienteId, // Incluye id_cliente aquí
            id_evento_agenda: 1, // Valor predeterminado para id_evento_agenda
            fecha: incidente.fecha_visita,
            hora: `${incidente.hora_inicio_visita} - ${incidente.hora_fin_visita}`,
          };

          const eventoGuardado = await guardarEvento(evento);
          if (eventoGuardado) {
            alert('Orden y evento guardados con éxito');
            console.log('Orden y evento guardados con éxito!!!');
          } else {
            alert('Error al guardar el evento');
            console.log('Error al guardar el evento...');
          }
        } else {
          alert('Error al guardar orden');
          console.log('Error al guardar la orden completa...');
        }
      } else {
        console.log('Error al guardar el cliente...');
        alert('Error al guardar el cliente...');
      }
    } else {
      if (!incidente.equipo || incidente.equipo.trim() === '') {
        alert('Por favor, agregue un equipo.');
        return;
      }
      const orden = {
        numero_orden: incidente.numero_orden,  
        id_cliente: verify.id,
        id_empleado: idEmpleado || null,
        id_tipo_estado: incidente.id_tipo_estado,  
        equipo: incidente.equipo || '',
        modelo: incidente.modelo,
        marca: incidente.marca,
        antiguedad: incidente.antiguedad,
        motivo: incidente.diagnostico,
        repuestos: incidente.repuestos,
      };

      const ordenGuardada = await guardarOrden(orden);
      if (ordenGuardada) {
        const evento = {
          id_cliente: verify.id,  
          id_evento_agenda: 1,  
          fecha: incidente.fecha_visita,
          hora: `${incidente.hora_inicio_visita} - ${incidente.hora_fin_visita}`,
        };

        const eventoGuardado = await guardarEvento(evento);
        if (eventoGuardado) {
          alert('Orden y evento guardados con éxito');
          console.log('Orden y evento guardados con éxito!!!');
        } else {
          alert('Error al guardar el evento');
          console.log('Error al guardar el evento...');
        }
      } else {
        alert('Error al guardar orden');
        console.log('Error al guardar la orden completa...');
      }
    }
  };
  return (
    <div className='nuevaOrder-ctn'>
      <Header text='Nueva Orden' />
      <NuevosDatosCliente setCliente={setCliente} cliente={cliente} />
      <div className='row'>
        <NuevosDatosIncidente setIncidente={setIncidente} />
        <NuevosDatosTecnico setIdEmpleado={setIdEmpleado} cliente={cliente} />
      </div>
      <div className='d-flex justify-content-center'>
        <button className='bg-primary rounded-pill text-white papelitoButton m-4' onClick={handleSubmit}>
          Crear
        </button>
      </div>
    </div>
  );
};
NuevaOrden.propTypes = {
  clienteData: object,
};
export default NuevaOrden;
