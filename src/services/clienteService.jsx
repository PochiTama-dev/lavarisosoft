const API_URL = "https://lv-back.online/";

export const listaClientes = async () => {
  try {
    const response = await fetch(`${API_URL}/clientes/lista`);
    const clientes = await response.json();
    if (clientes[0] !== undefined) {
      console.log(`Se encontró una lista con ${clientes.length} clientes!!`);
      console.log(clientes);
      return clientes;
    } else {
      console.log("Aún no se registra ningún cliente...");
      return false;
    }
  } catch (error) {
    console.error(
      "Error, no se encontraron clientes en la base de datos....",
      error
    );
  }
};

export const obtenerCliente = async (id) => {
  try {
    const response = await fetch(`${API_URL}/clientes/${id}`);
    const cliente = await response.json();
    if (cliente) {
      console.log(`Se encontró un cliente asociado al id ${id}`);
      console.log(cliente);
      return cliente;
    } else {
      console.log(`No se encontró ningún cliente con el id ${id}`);
      return false;
    }
  } catch (error) {
    console.error("Error, cliente no encontrado.", error);
  }
};

export const guardarCliente = async (cliente) => {
  try {
    const response = await fetch(`${API_URL}/clientes/guardar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cliente),
    });
    const result = await response.json();
    if (result) {
      console.log("Cliente guardado con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el cliente no pudo ser guardado...");
      return false;
    }
  } catch (error) {
    console.error("Error al guardar el cliente.", error);
  }
};

export const modificarCliente = async (id, cliente) => {
  try {
    const response = await fetch(`${API_URL}/clientes/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cliente)
    });
    const result = await response.json();
    if (result[0] === 1) {
      console.log("Datos del cliente modificados con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el cliente no pudo ser modificado...");
      return false;
    }
  } catch (error) {
    console.error("Error al modificar el cliente.", error);
  }
};

export const eliminarCliente = async (id) => {
  try {
    const response = await fetch(`${API_URL}/clientes/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if (result === 1) {
      console.log("El cliente se eliminó correctamente de la base de datos!!");
      return true;
    } else {
      console.log("Se produjo un error, el cliente no pudo ser eliminado...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar el cliente.", error);
  }
};
