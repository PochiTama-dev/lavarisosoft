const API_URL = "https://lv-back.online/";

export const obtenerGastos = async () => {
  try {
    const response = await fetch(`${API_URL}gastos/listado`);
    return await response.json();
  } catch (error) {
    console.error("Error al obtener todos los gastos.", error);
  }
};

export const obtenerGastosPorId = async (id) => {
  try {
    const response = await fetch(`${API_URL}gastos/${id}`);
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener el gasto con id ${id}.`, error);
  }
};

export const guardarGasto = async (data) => {
  try {
    const response = await fetch(`${API_URL}gastos/guardar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error al guardar el gasto.", error);
  }
};

export const modificarGasto = async (id, data) => {
  try {
    const response = await fetch(`${API_URL}gastos/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error(`Error al modificar el gasto con id ${id}.`, error);
  }
};

export const eliminarGasto = async (id) => {
  try {
    const response = await fetch(`${API_URL}gastos/eliminar/${id}`, {
      method: "DELETE",
    });
    return await response.json();
  } catch (error) {
    console.error(`Error al eliminar el gasto con id ${id}.`, error);
  }
};
