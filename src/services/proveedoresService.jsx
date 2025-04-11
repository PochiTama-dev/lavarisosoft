const API_URL = "https://lv-back.online/";

export const listadoProveedores = async () => {
  try {
    const response = await fetch(`${API_URL}/proveedores`);
    const proveedores = await response.json();
    if (proveedores[0] !== undefined) {
    
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

export const listaFacturas = async () => {
  try {
    const response = await fetch(`${API_URL}/facturas/lista`);
    const facturas = await response.json();
    if (facturas[0] !== undefined) {
      console.log(`Se encontró un listado con ${facturas.length} facturas!!`);
      console.log(facturas);
      return facturas;
    } else {
      console.log('Aún no se registra ninguna factura...');
      return false;
    }
  } catch (error) {
    console.error("Error, no se encontraron faacturas en la base de datos....", error);
  }
};
  