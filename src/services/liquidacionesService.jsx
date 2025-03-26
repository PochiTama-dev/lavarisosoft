const API_URL = "https://lv-back.online/";

export const obtenerLiquidaciones = async () => {
  try {
    const response = await fetch(`${API_URL}liquidaciones/`);
    return await response.json();
  } catch (error) {
    console.error("Error al obtener todas las liquidaciones.", error);
  }
};

export const obtenerLiquidacionPorId = async (id) => {
  try {
    const response = await fetch(`${API_URL}liquidaciones/${id}`);
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener la liquidación con id ${id}.`, error);
  }
};

export const obtenerLiquidacionesPorTecnico = async (id_tecnico) => {
  try {
    const response = await fetch(`${API_URL}liquidaciones/tecnico/${id_tecnico}`);
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener liquidaciones para el técnico con id ${id_tecnico}.`, error);
  }
};

export const guardarLiquidacion = async (data) => {
  try {
    const response = await fetch(`${API_URL}liquidaciones/guardar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error al guardar la liquidación.", error);
  }
};

export const modificarLiquidacion = async (id, data) => {
  try {
    const response = await fetch(`${API_URL}liquidaciones/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error(`Error al modificar la liquidación con id ${id}.`, error);
  }
};

export const eliminarLiquidacion = async (id) => {
  try {
    const response = await fetch(`${API_URL}liquidaciones/eliminar/${id}`, {
      method: "DELETE",
    });
    return await response.json();
  } catch (error) {
    console.error(`Error al eliminar la liquidación con id ${id}.`, error);
  }
};