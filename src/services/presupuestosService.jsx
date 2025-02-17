const API_URL = "https://lv-back.online/";

export const presupuestos = async () => {
  try {
    const response = await fetch(`${API_URL}/presupuestos`);
    const presupuestos = await response.json();
    if (presupuestos[0] !== undefined) {
      return presupuestos;
    } else {
      console.log("Aún no se registra ningún presupuesto...");
      return false;
    }
  } catch (error) {
    console.error(
      "Error, no se encontraron presupuestos en la base de datos....",
      error
    );
  }
};

export const listadoOrdenes = async () => {
  try {
    const response = await fetch(`${API_URL}/presupuestos`);
    const presupuestos = await response.json();
    if (presupuestos[0] !== undefined) {
      console.log(
        `Se encontró un listado con ${presupuestos.length} presupuestos!!`
      );
      return presupuestos;
    } else {
      console.log("Aún no se registra ningún presupuesto...");
      return false;
    }
  } catch (error) {
    console.error(
      "Error, no se encontraron presupuestos en la base de datos....",
      error
    );
  }
};

export const obtenerOrden = async (id) => {
  try {
    const response = await fetch(`${API_URL}/presupuestos/${id}`);
    const presupuesto = await response.json();
    if (presupuesto) {
      console.log(`Se encontró un presupuesto asociado al id ${id}`);
      return presupuesto;
    } else {
      console.log(`No se encontró ningún presupuesto con el id ${id}`);
      return false;
    }
  } catch (error) {
    console.error("Error, presupuesto no encontrado.", error);
  }
};

export const guardarPresupuesto = async (presupuesto) => {
  try {
    console.log("presupuesto:", presupuesto);
    const response = await fetch(`${API_URL}/presupuestos/guardar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(presupuesto),
    });
    console.log("response: ", response);
    console.log("json presupuesto: ", JSON.stringify(presupuesto));
    const result = await response.json();
    if (result) {
      console.log("Presupuesto guardado con exito");
      return true;
    } else {
      console.log("Se produjo un error");
      return false;
    }
  } catch (error) {
    console.error("Error al guardar el presupuesto.", error);
  }
};

export const modificarPresupuesto = async (id, presupuesto) => {
  try {
    const response = await fetch(`${API_URL}/presupuestos/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(presupuesto),
    });
    const result = await response.json();
    if (result[0] === 1) {
      console.log("Datos del presupuesto modificados con éxito");
      return true;
    } else {
      console.log("Se produjo un error");
      return false;
    }
  } catch (error) {
    console.error("Error al modificar el presupuesto.", error);
  }
};
