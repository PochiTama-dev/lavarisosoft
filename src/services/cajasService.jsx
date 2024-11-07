const API_URL = "https://lv-back.online/";

export const listaCajas = async () => {
  try {
    const response = await fetch(`${API_URL}cajas/lista`);
    const cajas = await response.json();
    if (cajas[0] !== undefined) {
      console.log(`Se encontró un listado con ${cajas.length} cajas!!`);
      console.log(cajas);
      return cajas;
    } else {
      console.log("Aún no hay registro de cajas...");
      return false;
    }
  } catch (error) {
    console.error("Error, no se encontraron cajas en la base de datos....", error);
  }
};

export const obtenerCaja = async (id) => {
  try {
    const response = await fetch(`${API_URL}cajas/${id}`);
    const caja = await response.json();
    if (caja) {
      console.log(`Se encontró una caja asociada al id ${id}`);
      console.log(caja);
      return caja;
    } else {
      console.log(`No se encontró ninguna caja con el id ${id}`);
      return false;
    }
  } catch (error) {
    console.error("Error, caja no encontrada.", error);
  }
};

export const denominacionCaja = async (denominacion) => {
  try {
    const response = await fetch(`${API_URL}cajas/denominacion/${denominacion}`);
    const cajas = await response.json();
    if (cajas[0] !== undefined) {
      console.log(`Se encontró ${cajas.length} caja(s) asociada a la denominación "${denominacion}"`);
      console.log(cajas);
      return cajas;
    } else {
      console.log(`No se encontró ninguna caja con la denominación ${denominacion}`);
      return false;
    }
  } catch (error) {
    console.error("Error, caja no encontrada.", error);
  }
};

export const guardarCaja = async (caja) => {
  try {
    const response = await fetch(`${API_URL}cajas/guardar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(caja),
    });
    const result = await response.json();
    if (result) {
      console.log("Caja registrada con éxito!!!");
      return true;
    } else {
      console.log("Se produjo un error, la caja no pudo ser registrada...");
      return false;
    }
  } catch (error) {
    console.error("Error al registrar la caja.", error);
  }
};

export const modificarCaja = async (id, caja) => {
  try {
    const response = await fetch(`${API_URL}cajas/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(caja),
    });
    const result = await response.json();
    if (result[0] === 1) {
      console.log("Caja modificada con éxito!!!");
      return true;
    } else {
      console.log("Se produjo un error, la caja no pudo ser modificada...");
      return false;
    }
  } catch (error) {
    console.error("Error al modificar la caja.", error);
  }
};

export const eliminarCaja = async (id) => {
  try {
    const response = await fetch(`${API_URL}cajas/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();
    if (result === 1) {
      console.log("La caja se eliminó correctamente de la base de datos!!");
      return true;
    } else {
      console.log("Se produjo un error, la caja no pudo ser eliminada...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar la caja.", error);
  }
};
