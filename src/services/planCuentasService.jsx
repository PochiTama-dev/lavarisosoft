const API_URL = "https://lv-back.online/";

export const listaPlanCuentas = async () => {
  try {
    const response = await fetch(`${API_URL}plancuentas/lista`);
    const planCuentas = await response.json();
    if (planCuentas[0] !== undefined) {
      console.log(
        `Se encontró un listado con ${planCuentas.length} plan de cuentas!!`
      );
      console.log(planCuentas);
      return planCuentas;
    } else {
      console.log("Aún no hay registro de plan de cuentas...");
      return false;
    }
  } catch (error) {
    console.error(
      "Error, no se encontró plan de cuentas en la base de datos....",
      error
    );
  }
};

export const obtenerPlanCuentas = async (id) => {
  try {
    const response = await fetch(`${API_URL}plancuentas/${id}`);
    const planCuentas = await response.json();
    if (planCuentas) {
      console.log(`Se encontró un plan de cuentas asociado al id ${id}`);
      console.log(planCuentas);
      return planCuentas;
    } else {
      console.log(`No se encontró ningún plan de cuentas con el id ${id}`);
      return false;
    }
  } catch (error) {
    console.error("Error, plan de cuentas no encontrado.", error);
  }
};

export const guardarPlanCuentas = async (planCuentas) => {
  try {
    const response = await fetch(`${API_URL}plancuentas/guardar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(planCuentas),
    });
    const result = await response.json();
    if (result) {
      console.log("Plan de cuentas registrado con éxito!!!");
      return true;
    } else {
      console.log(
        "Se produjo un error, el plan de cuentas no pudo ser registrada..."
      );
      return false;
    }
  } catch (error) {
    console.error("Error al registrar el plan de cuentas.", error);
  }
};

export const modificarPlanCuentas = async (id, planCuentas) => {
  try {
    const response = await fetch(`${API_URL}plancuentas/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(planCuentas),
    });
    const result = await response.json();
    if (result[0] === 1) {
      console.log("Plan de cuentas modificado con éxito!!!");
      return true;
    } else {
      console.log(
        "Se produjo un error, el plan de cuentas no pudo ser modificado..."
      );
      return false;
    }
  } catch (error) {
    console.error("Error al modificar el plan de cuentas.", error);
  }
};

export const eliminarPlanCuentas = async (id) => {
  try {
    const response = await fetch(`${API_URL}plancuentas/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();
    if (result === 1) {
      console.log("Plan de cuentas eliminado con éxito!!!");
      return true;
    } else {
      console.log(
        "Se produjo un error, el plan de cuentas no pudo ser eliminado..."
      );
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar el plan de cuentas.", error);
  }
};
