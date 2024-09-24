const API_URL = "https://lv-back.online/";
export const listaStockCamioneta = async () => {
  try {
    const response = await fetch(`${API_URL}/stock/camioneta/lista`);
    const repuestos = await response.json();
    if (repuestos[0] !== undefined) {
      console.log(
        `Se encontró una lista con ${repuestos.length} ingresos de repuestos`
      );
      return repuestos;
    } else {
      console.log("No se encontró ningún repuesto en el stock de camioneta");
      return false;
    }
  } catch (error) {
    console.error("Error, al consultar el stock de repuestos.", error);
  }
};

export const empleadoStockCamioneta = async (idEmpleado) => {
  try {
    const response = await fetch(
      `${API_URL}/stock/camioneta/empleados/${idEmpleado}`
    );
    const repuestos = await response.json();
    if (repuestos[0] !== undefined) {
      console.log(
        `Se encontró una lista de repuestos asociada al empleado id ${idEmpleado}`
      );
      return repuestos;
    } else {
      console.log(
        `No se encontró ningún repuesto asociado al empleado id ${idEmpleado}`
      );
      return false;
    }
  } catch (error) {
    console.error("Error, al consultar el stock de repuestos.", error);
  }
};

export const obtenerRepuestosCamioneta = async (idRepuesto) => {
  try {
    const response = await fetch(
      `${API_URL}/stock/camioneta/repuestos/${idRepuesto}`
    );
    const repuestos = await response.json();
    if (repuestos[0] !== undefined) {
      console.log(`Se encontró una lista de repuestos con el id ${idRepuesto}`);
      return repuestos;
    } else {
      console.log(
        `No se encontró ningún repuesto asociado al id ${idRepuesto}`
      );
      return false;
    }
  } catch (error) {
    console.error("Error, al consultar el stock de repuestos.", error);
  }
};

export const guardarStockCamioneta = async (repuesto) => {
  try {
    const response = await fetch(`${API_URL}/stock/camioneta/guardar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(repuesto),
    });
    const result = await response.json();
    if (result) {
      console.log("Repuesto agregado al stock la camioneta con exito!!!");
      return true;
    } else {
      console.log(
        "Se produjo un error, el repuesto no pudo ser agregado al stock de la camioneta..."
      );
      return false;
    }
  } catch (error) {
    console.error(
      "Error al tratar de agregar el repuesto al stock de la camioneta.",
      error
    );
  }
};

export const modificarStockCamioneta = async (id, repuesto) => {
  if (!id || !repuesto.cantidad) {
    console.error("ID de repuesto o cantidad no válidos.");
    return false;
  }
  try {
    const response = await fetch(`${API_URL}/stock/camioneta/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cantidad: repuesto.cantidad,
      }),
    });
    const result = await response.json();
    console.log(result);
    if (result[0] === 1) {
      console.log("Stock de la camioneta modificado con éxito!!!");
      return true;
    } else {
      console.error("Error al modificar el stock de la camioneta:", result);
      return false;
    }
  } catch (error) {
    console.error("Error al modificar el stock de la camioneta.", error);
    return false; // Retorna false para manejar el error en el componente
  }
};
export const eliminarStockCamioneta = async (id) => {
  try {
    const response = await fetch(`${API_URL}/stock/camioneta/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();
    if (result === 1) {
      console.log(
        "El repuesto se eliminó correctamente del stock de la camioneta!!"
      );
      return true;
    } else {
      console.log(
        "Se produjo un error, el repuesto no pudo ser eliminado del stock..."
      );
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar el repuesto del stock.", error);
  }
};
