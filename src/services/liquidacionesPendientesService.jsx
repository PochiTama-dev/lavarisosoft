const API_URL = "https://lv-back.online/";

export const liquidacionesPendientes = async () => {
  try {
    const response = await fetch(`${API_URL}liquidacionesPendientes/`);
    return await response.json();
  } catch (error) {
    console.error("Error al obtener las liquidaciones pendientes.", error);
  }
};

export const liquidacionesPendientesPorTecnico = async (id_tecnico) => {
  try {
    const response = await fetch(
      `${API_URL}liquidacionesPendientes/tecnico/${id_tecnico}`
    );
    return await response.json();
  } catch (error) {
    console.error(
      `Error al obtener liquidaciones pendientes para el técnico con id ${id_tecnico}.`,
      error
    );
  }
};

export const actualizarLiquidacionPendiente = async (id, data) => {
  try {
    const response = await fetch(
      `${API_URL}liquidacionesPendientes/modificar/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    return await response.json();
  } catch (error) {
    console.error(
      `Error al actualizar el estado de la liquidación pendiente con id ${id}.`,
      error
    );
  }
};

export const obtenerLiquidacionPendientePorId = async (id) => {
  try {
    const response = await fetch(`${API_URL}liquidacionesPendientes/${id}`);
    if (response.ok) {
      return await response.json();
    } else {
      console.error(`Liquidación pendiente con id ${id} no encontrada.`);
      return null;
    }
  } catch (error) {
    console.error(
      `Error al obtener la liquidación pendiente con id ${id}.`,
      error
    );
  }
};

export const guardarLiquidacionPendiente = async (data) => {
  try {
    const response = await fetch(`${API_URL}liquidacionesPendientes/guardar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error al guardar la liquidación pendiente.", error);
  }
};

export const eliminarLiquidacionPendiente = async (id) => {
  try {
    const response = await fetch(
      `${API_URL}liquidacionesPendientes/eliminar/${id}`,
      {
        method: "DELETE",
      }
    );
    return await response.json();
  } catch (error) {
    console.error(
      `Error al eliminar la liquidación pendiente con id ${id}.`,
      error
    );
  }
};
