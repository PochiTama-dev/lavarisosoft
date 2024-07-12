const API_URL = "https://lv-back.online/";

export const empleados = async () => {
  try {
    const response = await fetch(`${API_URL}/empleados`);
    const empleados = await response.json();
    if (empleados[0] !== undefined) {
      console.log(
        `Se encontró un listado completo con ${empleados.length} empleados!!`
      );
      return empleados;
    } else {
      console.log("Aún no se registra ningún empleado...");
      return false;
    }
  } catch (error) {
    console.error(
      "Error, no se encontraron empleados en la base de datos....",
      error
    );
  }
};

export const listadoEmpleados = async () => {
  try {
    const response = await fetch(`${API_URL}/empleados/listado`);
    const empleados = await response.json();
    if (empleados[0] !== undefined) {
      console.log(`Se encontró un listado con ${empleados.length} empleados!!`);
      return empleados;
    } else {
      console.log("Aún no se registra ningún empleado...");
      return false;
    }
  } catch (error) {
    console.error(
      "Error, no se encontraron empleados en la base de datos....",
      error
    );
  }
};

export const obtenerEmpleado = async (id) => {
  try {
    const response = await fetch(`${API_URL}/empleados/${id}`);
    const empleado = await response.json();
    if (empleado) {
      console.log(`Se encontró un empleado asociado al id ${id}`);
      return empleado;
    } else {
      console.log(`No se encontró ningún empleado con el id ${id}`);
      return false;
    }
  } catch (error) {
    console.error("Error, empleado no encontrado.", error);
  }
};

export const guardarEmpleado = async (empleado) => {
  try {
    const response = await fetch(`${API_URL}/empleados/guardar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(empleado),
    });
    const result = await response.json();
    if (result) {
      console.log("Empleado guardado con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el empleado no pudo ser guardado...");
      return false;
    }
  } catch (error) {
    console.error("Error al guardar el empleado.", error);
  }
};

export const modificarEmpleado = async (id, empleado) => {
  try {
    const response = await fetch(
      `${API_URL}/empleados/modificar/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(empleado),
      }
    );
    const result = await response.json();
    if (result[0] === 1) {
      console.log("Datos del empleado modificados con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el empleado no pudo ser modificado...");
      return false;
    }
  } catch (error) {
    console.error("Error al modificar el empleado.", error);
  }
};

export const eliminarEmpleado = async (id) => {
  try {
    const response = await fetch(
      `${API_URL}/empleados/eliminar/${id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );
    const result = await response.json();
    if (result === 1) {
      console.log("El empleado se liminó correctamente de la base de datos!!");
      return true;
    } else {
      console.log("Se produjo un error, el empleado no pudo ser eliminado...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar el empleado.", error);
  }
};
