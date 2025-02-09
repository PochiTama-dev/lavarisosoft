const API_URL = "https://lv-back.online/";

export const ordenes = async () => {
  try {
    const response = await fetch(`${API_URL}/ordenes`);
    const ordenes = await response.json();
    if (ordenes[0] !== undefined) {
      return ordenes;
    } else {
      console.log("Aún no se registra ninguna orden...");
      return false;
    }
  } catch (error) {
    console.error(
      "Error, no se encontraron ordenes en la base de datos....",
      error
    );
  }
};

export const listadoOrdenes = async () => {
  try {
    const response = await fetch(`${API_URL}/ordenes`);
    const ordenes = await response.json();
    if (ordenes[0] !== undefined) {
      console.log(`Se encontró un listado con ${ordenes.length} ordenes!!`);
      return ordenes;
    } else {
      console.log("Aún no se registra ninguna ordene...");
      return false;
    }
  } catch (error) {
    console.error(
      "Error, no se encontraron ordenes en la base de datos....",
      error
    );
  }
};

export const obtenerOrden = async (id) => {
  try {
    const response = await fetch(`${API_URL}/ordenes/${id}`);
    const orden = await response.json();
    if (orden) {
      console.log(`Se encontró una orden asociada al id ${id}`);
      return orden;
    } else {
      console.log(`No se encontró ninguna orden con el id ${id}`);
      return false;
    }
  } catch (error) {
    console.error("Error, orden no encontrado.", error);
  }
};

export const guardarOrden = async (orden) => {
  try {
    console.log("orden:", orden);
    const response = await fetch(`${API_URL}/ordenes/guardar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orden),
    });
    console.log("response: ", response);
    console.log("json orden: ", JSON.stringify(orden));
    const result = await response.json();
    if (result) {
      console.log("Orden guardada con exito");
      return true;
    } else {
      console.log("Se produjo un error");
      return false;
    }
  } catch (error) {
    console.error("Error al guardar la orden.", error);
  }
};

export const modificarOrden = async (id, orden) => {
  try {
    const response = await fetch(`${API_URL}/ordenes/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orden),
    });
    const result = await response.json();
    if (result[0] === 1) {
      console.log("Datos de la orden modificados con éxito");
      return true;
    } else {
      console.log("Se produjo un error");
      return false;
    }
  } catch (error) {
    console.error("Error al modificar la orden.", error);
  }
};
