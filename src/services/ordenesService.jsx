const API_URL = "https://lv-back.online/";

export const modificarOrden = async (id, orden) => {
  try {
    const response = await fetch(`${API_URL}/ordenes/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orden),
    });
    const result = await response.json();
    if (result[0] === 1) {
      console.log("Datos de la orden modificados con éxito!!!");
      return true;
    } else {
      console.log("Se produjo un error, la orden no pudo ser modificada...");
      return false;
    }
  } catch (error) {
    console.error("Error al modificar la orden.", error);
  }
};