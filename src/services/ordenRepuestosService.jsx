const API_URL = "https://lv-back.online/";

export const ordenesRepuestos = async () => {
  try {
    const response = await fetch(`${API_URL}/orden/repuestos`);
    const ordenes = await response.json();
    if (ordenes[0] !== undefined) {
      return ordenes;
    } else {
      console.log("Aún no se registra ninguna orden con repuestos...");
      return false;
    }
  } catch (error) {
    console.error(
      "Error, no se encontraron repuestos en la base de datos....",
      error
    );
  }
};
