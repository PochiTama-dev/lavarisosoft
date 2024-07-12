import { useState } from "react";

import Header from "../../Components/Header/Header.jsx";
import NuevosDatosCliente from "../../Components/Orders/NuevaOrden/NuevosDatosCliente.jsx";
import NuevosDatosIncidente from "../../Components/Orders/NuevaOrden/NuevosDatosIncidente.jsx";
import NuevosDatosTecnico from "../../Components/Orders/NuevaOrden/NuevosDatosTecnico.jsx";
import { guardarOrden } from "../../services/ordenesService";


const verificarNumeroCliente = async (numero_cliente) => {
  try {
    const response = await fetch("https://lv-back.online/clientes/lista", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    const clientes = await response.json();
    return clientes.some(cliente => cliente.numero_cliente === numero_cliente);
  } catch (error) {
    console.error("Error al verificar el número de cliente.", error);
    return false;
  }
};

const guardarCliente = async (cliente) => {
  try {
    const existeNumeroCliente = await verificarNumeroCliente(cliente.numero_cliente);
    if (existeNumeroCliente) {
      alert("El número de cliente ya existe. Por favor, ingrese un número de cliente diferente.");
      return false;
    }

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
  const [idTipoEstado, setIdTipoEstado] = useState(""); // New state for id_tipo_estado
  const [idEmpleado, setIdEmpleado] = useState(""); // New state for id_empleado

  const handleSubmit = async () => {

    const clienteId = await guardarCliente(cliente);
    if (clienteId) {
      const orden = {
        numero_orden: incidente.numero_orden, // Use the numero_orden from incidente
        id_cliente: clienteId,
        id_empleado: idEmpleado, // Use the id_empleado state
        id_tipo_estado: incidente.id_tipo_estado,
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
      <NuevosDatosCliente setCliente={setCliente} />
      <NuevosDatosIncidente setIncidente={setIncidente} />
      <div className='d-flex justify-content-center'>
        <button className='bg-primary rounded-pill text-white papelitoButton' onClick={handleSubmit}>Crear</button>
      </div>
    </div>
  );
};

export default NuevaOrden;
