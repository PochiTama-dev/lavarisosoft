 
import React, { useState, useEffect } from 'react';
import Header from '../../Components/Header/Header.jsx';
import NuevosDatosCliente from '../../Components/Orders/NuevaOrden/NuevosDatosCliente.jsx';
import NuevosDatosIncidente from '../../Components/Orders/NuevaOrden/NuevosDatosIncidente.jsx';
import NuevosDatosTecnico from '../../Components/Orders/NuevaOrden/NuevosDatosTecnico.jsx';
 

const verificarNumeroCliente = async () => {
  try {
    const response = await fetch("https://lv-back.online/clientes/lista", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    const clientes = await response.json();
    const maxNumeroCliente = Math.max(...clientes.map(cliente => parseInt(cliente.numero_cliente, 10)), 0);
    return maxNumeroCliente;
  } catch (error) {
    console.error("Error al verificar el número de cliente.", error);
    return 0;
  }
};
const guardarOrden = async (orden) => {
  try {
    const response = await fetch("https://lv-back.online/ordenes/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orden)
    });
    const result = await response.json();
    if (result) {
      console.log("Orden guardada con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, la orden no pudo ser guardada...");
      return false;
    }
  } catch (error) {
    console.error("Error al guardar la orden.", error);
  }
};
  
const guardarCliente = async (cliente) => {
  try {
    const existeNumeroCliente = await verificarNumeroCliente(cliente.numero_cliente);
    
    
    const response = await fetch("https://lv-back.online/clientes/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cliente)
    });

    const result = await response.json();
    if (result) {
      console.log("Cliente guardado con éxito!!!");
      return result.id; // Assuming the backend returns the saved client's ID
    } else {
      console.log("Se produjo un error, el cliente no pudo ser guardado...");
      return null;
    }
  } catch (error) {
    console.error("Error al guardar el cliente.", error);
  }
};

const NuevaOrden = () => {
  const [cliente, setCliente] = useState({});
  const [incidente, setIncidente] = useState({});
  const [idEmpleado, setIdEmpleado] = useState(""); // State for id_empleado

  useEffect(() => {
    const fetchMaxNumeroCliente = async () => {
      const maxNumeroCliente = await verificarNumeroCliente();
      setCliente(prevState => ({ ...prevState, numero_cliente: maxNumeroCliente + 1 }));
    };

    fetchMaxNumeroCliente();
  }, []);

  const handleSubmit = async () => {
 
    if (!incidente.numero_orden || !incidente.id_tipo_estado || !idEmpleado) {
      alert("Por favor, complete todos los campos requeridos.");
      return;
    }
 

    const clienteId = await guardarCliente(cliente);
    if (clienteId) {
      const orden = {
        numero_orden: incidente.numero_orden, // Use the numero_orden from incidente
        id_cliente: clienteId,
        id_empleado: idEmpleado, // Use the id_empleado state
        id_tipo_estado: incidente.id_tipo_estado, // Use the id_tipo_estado from incidente
        equipo: incidente.equipo,
        modelo: incidente.modelo,
        marca: incidente.marca,
        antiguedad: incidente.antiguedad,
        motivo: incidente.diagnostico,
        repuestos: incidente.repuestos
      };
      const ordenGuardada = await guardarOrden(orden);
      if (ordenGuardada) {
        // Handle success case
        console.log("Orden completa guardada con éxito!!!");
      } else {
        // Handle error case
        console.log("Error al guardar la orden completa...");
      }
    } else {
      // Handle error case for cliente
      console.log("Error al guardar el cliente...");
    }
  };

  return (
    <div className="nuevaOrder-ctn">
      <Header text="Nueva Orden" />
      <div className="mt-3 pt-3">
        <h1>Orden #{}</h1>
      </div>
      <NuevosDatosTecnico setIdEmpleado={setIdEmpleado} />
      <NuevosDatosCliente setCliente={setCliente} cliente={cliente} />
      <NuevosDatosIncidente setIncidente={setIncidente} />
      <div className='d-flex justify-content-center'>
        <button className='bg-primary rounded-pill text-white papelitoButton' onClick={handleSubmit}>Crear</button>
      </div>
    </div>
  );
};

export default NuevaOrden;
