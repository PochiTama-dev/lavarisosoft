const API_URL = "https://lv-back.online/";

export const guardarOrden = async (orden) => {
  try {
    const response = await fetch(`${API_URL}/ordenes/guardar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orden)
    });
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