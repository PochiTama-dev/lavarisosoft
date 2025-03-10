const API_URL = "https://lv-back.online/";

export const listaSaldosPendientes = async () => {
  try {
    const response = await fetch(`${API_URL}saldospendientes/lista`);
    const saldos = await response.json();
    if (saldos[0] !== undefined) {
      console.log(`Se encontró una lista con ${saldos.length} saldos!!`);
      console.log(saldos);
      return saldos;
    } else {
      console.log("Aún no se registra ningún saldo pendiente...");
      return false;
    }
  } catch (error) {
    console.error(
      "Error, no se encontraron saldos pendientes en la base de datos....",
      error
    );
  }
};

export const obtenerSaldoPendiente = async (id) => {
  try {
    const response = await fetch(`${API_URL}saldospendientes/${id}`);
    const saldo = await response.json();
    if (saldo) {
      console.log(`Se encontró un saldo pendiente con el id ${id}`);
      console.log(saldo);
      return saldo;
    } else {
      console.log(`No se encontró ningún saldo pendiente con el id ${id}`);
      return false;
    }
  } catch (error) {
    console.error("Error, saldo pendiente no encontrado.", error);
  }
};

export const guardarSaldoPendiente = async (saldo) => {
  try {
    const response = await fetch(`${API_URL}saldospendientes/guardar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(saldo),
    });
    const result = await response.json();
    if (result) {
      console.log("Saldo pendiente registrado con éxito!!!");
      return true;
    } else {
      console.log(
        "Se produjo un error, el saldo pendiente no pudo ser registrado..."
      );
      return false;
    }
  } catch (error) {
    console.error("Error al registrar el saldo pendiente.", error);
  }
};

export const modificarSaldoPendiente = async (id, saldo) => {
  try {
    const response = await fetch(`${API_URL}saldospendientes/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(saldo),
    });
    const result = await response.json();
    if (result[0] === 1) {
      console.log("Saldo pendiente modificado con éxito!!!");
      return true;
    } else {
      console.log(
        "Se produjo un error, el saldo pendiente no pudo ser modificado..."
      );
      return false;
    }
  } catch (error) {
    console.error("Error al modificar el saldo pendiente.", error);
  }
};

export const eliminarSaldoPendiente = async (id) => {
  try {
    const response = await fetch(`${API_URL}saldospendientes/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();
    if (result === 1) {
      console.log(
        "Saldo pendiente eliminado correctamente de la base de datos!!"
      );
      return true;
    } else {
      console.log(
        "Se produjo un error, el saldo pendiente no pudo ser eliminado..."
      );
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar el saldo pendiente.", error);
  }
};
