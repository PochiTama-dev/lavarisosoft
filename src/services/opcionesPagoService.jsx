const API_URL = "https://lv-back.online/";

export const opcionesPago = async () => {
  try {
    const response = await fetch(`${API_URL}/opciones/pago`);
    const opciones = await response.json();
    if (opciones[0] !== undefined) {
      return opciones;
    } else {
      console.log("Aún no se registra ninguna opción de pago...");
      return false;
    }
  } catch (error) {
    console.error(
      "Error, no se encontraron opciones de pago en la base de datos....",
      error
    );
  }
};
