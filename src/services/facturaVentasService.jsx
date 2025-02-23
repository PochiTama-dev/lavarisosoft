const API_URL = "https://lv-back.online/";

export const listaFacturasVentas = async () => {
  try {
    const response = await fetch(`${API_URL}facturasventa/lista`);
    const data = await response.json();
    if (data[0] !== undefined) {
      console.log(`Se encontró un listado con ${data.length} facturas!!`);
      console.log(data);
      return data;
    } else {
      console.log("Aún no hay registro de facturas de ventas...");
      return false;
    }
  } catch (error) {
    console.error(
      "Error, no se encontraron facturas de ventas en la base de datos....",
      error
    );
  }
};

export const obtenerFacturaVenta = async (id) => {
  try {
    const response = await fetch(`${API_URL}facturasventa/${id}`);
    const facturaventa = await response.json();
    if (facturaventa) {
      console.log(`Se encontró una factura de venta asociada al id ${id}`);
      console.log(facturaventa);
      return facturaventa;
    } else {
      console.log(`No se encontró ninguna factura de venta con el id ${id}`);
      return false;
    }
  } catch (error) {
    console.error("Error, factura de venta no encontrada.", error);
  }
};

export const guardarFacturaVenta = async (facturaventa) => {
  try {
    const response = await fetch(`${API_URL}facturasventa/guardar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(facturaventa),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result) {
      console.log("Factura de venta registrada con éxito!!!");
      return true;
    } else {
      console.log(
        "Se produjo un error, la factura de venta no pudo ser registrada..."
      );
      return false;
    }
  } catch (error) {
    console.error("Error al registrar la factura de venta.", error);
    return false;
  }
};

export const modificarFacturaVenta = async (id, facturaventa) => {
  try {
    const response = await fetch(`${API_URL}facturasventa/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(facturaventa),
    });
    const result = await response.json();
    if (result[0] === 1) {
      console.log("Factura de venta modificada con éxito!!!");
      return true;
    } else {
      console.log(
        "Se produjo un error, la factura de venta no pudo ser modificada..."
      );
      return false;
    }
  } catch (error) {
    console.error("Error al modificar la factura de venta.", error);
  }
};

export const eliminarFacturaVenta = async (id) => {
  try {
    const response = await fetch(`${API_URL}facturasventa/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();
    if (result === 1) {
      console.log(
        "La factura de venta se eliminó correctamente de la base de datos!!"
      );
      return true;
    } else {
      console.log(
        "Se produjo un error, la factura de venta no pudo ser eliminada..."
      );
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar la factura de venta.", error);
  }
};
