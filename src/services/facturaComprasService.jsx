const API_URL = "https://lv-back.online/";

export const listaFacturasCompras = async () => {
  try {
    const response = await fetch(`${API_URL}facturascompra/lista`);
    const data = await response.json();
    if (data[0] !== undefined) {
      console.log(`Se encontró un listado con ${data.length} facturas!!`);
      console.log(data);
      return data;
    } else {
      console.log("Aún no hay registro de facturas de compras...");
      return false;
    }
  } catch (error) {
    console.error(
      "Error, no se encontraron facturas de compras en la base de datos....",
      error
    );
  }
};

export const obtenerFacturaCompra = async (id) => {
  try {
    const response = await fetch(`${API_URL}facturascompra/${id}`);
    const facturaCompra = await response.json();
    if (facturaCompra) {
      console.log(`Se encontró una factura de compra asociada al id ${id}`);
      console.log(facturaCompra);
      return facturaCompra;
    } else {
      console.log(`No se encontró ninguna factura de compra con el id ${id}`);
      return false;
    }
  } catch (error) {
    console.error("Error, factura de compra no encontrada.", error);
  }
};

export const guardarFacturaCompra = async (facturaCompra) => {
  try {
    const response = await fetch(`${API_URL}facturascompra/guardar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(facturaCompra),
    });
    const result = await response.json();
    if (result) {
      console.log("Factura de compra registrada con éxito!!!");
      return true;
    } else {
      console.log(
        "Se produjo un error, la factura de compra no pudo ser registrada..."
      );
      return false;
    }
  } catch (error) {
    console.error("Error al registrar la factura de compra.", error);
  }
};

export const modificarFacturaCompra = async (id, facturaCompra) => {
  try {
    const response = await fetch(`${API_URL}facturascompra/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(facturaCompra),
    });
    const result = await response.json();
    if (result[0] === 1) {
      console.log("Factura de compra modificada con éxito!!!");
      return true;
    } else {
      console.log(
        "Se produjo un error, la factura de compra no pudo ser modificada..."
      );
      return false;
    }
  } catch (error) {
    console.error("Error al modificar la factura de compra.", error);
  }
};

export const eliminarFacturaCompra = async (id) => {
  try {
    const response = await fetch(`${API_URL}facturascompra/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();
    if (result === 1) {
      console.log(
        "La factura de compra se eliminó correctamente de la base de datos!!"
      );
      return true;
    } else {
      console.log(
        "Se produjo un error, la factura de compra no pudo ser eliminada..."
      );
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar la factura de compra.", error);
  }
};
