const API_URL = "https://lv-back.online/";

export const listadoProveedores = async () => {
  try {
    const response = await fetch(`${API_URL}/proveedores`);
    const proveedores = await response.json();
    if (proveedores[0] !== undefined) {
      console.log(
        `Se encontró un listado completo con ${proveedores.length} proveedores!!`
      );
      return proveedores;
    } else {
      console.log("Aún no se registra ningún proveedor...");
      return false;
    }
  } catch (error) {
    console.error(
      "Error, no se encontraron proveedores en la base de datos....",
      error
    );
  }
};
