const API_URL = "https://lv-back.online/";

export const listaFacturasProveedores = async () => {
  try {
    const response = await fetch(`${API_URL}facturasproveedores/lista`);
    const data = await response.json();
    if (data[0] !== undefined) {
      console.log(`Se encontró un listado con ${data.length} facturas!!`);
      console.log(data);
      return data;
    } else {
      console.log("Aún no hay registro de facturas de proveedores...");
      return false;
    }
  } catch (error) {
    console.error(
      "Error, no se encontraron facturas de proveedores en la base de datos....",
      error
    );
  }
};

export const obtenerFacturaProveedores = async (id) => {
  try {
    const response = await fetch(`${API_URL}facturasproveedores/${id}`);
    const facturaProveedores = await response.json();
    if (facturaProveedores) {
      console.log(
        `Se encontró una factura de proveedores asociada al id ${id}`
      );
      console.log(facturaProveedores);
      return facturaProveedores;
    } else {
      console.log(
        `No se encontró ninguna factura de proveedores con el id ${id}`
      );
      return false;
    }
  } catch (error) {
    console.error("Error, factura de proveedores no encontrada.", error);
  }
};

export const guardarFacturaProveedores = async (facturaProveedores) => {
  try {
    const response = await fetch(`${API_URL}facturasproveedores/guardar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(facturaProveedores),
    });
    const result = await response.json();
    if (result) {
      console.log("Factura de proveedores registrada con éxito!!!");
      return true;
    } else {
      console.log(
        "Se produjo un error, la factura de proveedores no pudo ser registrada..."
      );
      return false;
    }
  } catch (error) {
    console.error("Error al registrar la factura de proveedores.", error);
  }
};

export const modificarFacturaProveedores = async (id, facturaProveedores) => {
  try {
    const response = await fetch(
      `${API_URL}facturasproveedores/modificar/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(facturaProveedores),
      }
    );
    const result = await response.json();
    if (result[0] === 1) {
      console.log("Factura de proveedores modificada con éxito!!!");
      return true;
    } else {
      console.log(
        "Se produjo un error, la factura de proveedores no pudo ser modificada..."
      );
      return false;
    }
  } catch (error) {
    console.error("Error al modificar la factura de proveedores.", error);
  }
};

export const eliminarFacturaProveedores = async (id) => {
  try {
    const response = await fetch(
      `${API_URL}facturasproveedores/eliminar/${id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );
    const result = await response.json();
    if (result === 1) {
      console.log(
        "La factura de proveedores se eliminó correctamente de la base de datos!!"
      );
      return true;
    } else {
      console.log(
        "Se produjo un error, la factura de proveedores no pudo ser eliminada..."
      );
      return false;
    }
  } catch (error) {
    console.error(
      "Error al tratar de eliminar la factura de proveedores.",
      error
    );
  }
};
