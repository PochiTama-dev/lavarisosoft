const API_URL = "https://lv-back.online/";
export const obtenerOrdenRepuestos = async (idOrden) => {
    try {
      const response = await fetch(`${API_URL}/ordenes/repuestos/${idOrden}`);
      const repuesto = await response.json();
      if (repuesto) {
        console.log(`Se encontró un repuesto asociado al id ${idOrden}`);
        console.log(repuesto);
        return repuesto;
      } else {
        console.log(`No se encontró ningún repuesto con el id ${idOrden}`);
        return false;
      }
    } catch (error) {
        console.error("Error, repuesto no encontrado.", error);
    }
  };
  
export const guardarOrdenRepuesto = async (repuesto) => {
    try {
      const response = await fetch(`${API_URL}/ordenes/repuestos/guardar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(repuesto)
      });
      console.log('repuesto: ', repuesto);
      const result = await response.json();
      console.log('result: ', result);
      if (result) {
        console.log("Repuesto agregado con exito!!!");
        return true;
      } else {
        console.log("Se produjo un error, el repuesto no pudo ser agregado...");
        return false;
      }
    } catch (error) {
      console.log('error');
      console.error("Error al guardar el repuesto.", error);
    }
  };
  
export const modificarOrdenRepuesto = async (id, repuesto) => {
    try {
      const response = await fetch(`${API_URL}/ordenes/repue stos/modificar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(repuesto)
      });
      const result = await response.json();
      console.log(result)
      if (result[0] === 1) {
        console.log("Repuesto cambiado con éxito!!!");
        return true;
      } else {
        console.log("Se produjo un error, el repuesto no pudo ser cambiado...");
        return false;
      }
    } catch (error) {
      console.error("Error al cambiar el repuesto.", error);
    }
  };
  
export const eliminarOrdenRepuesto = async (id) => {
    try {
      const response = await fetch(`${API_URL}/ordenes/repuestos/eliminar/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });
      const result = await response.json();
      if (result === 1) {
        console.log("El repuesto se eliminó de la orden correctamente!!");
        return true;
      } else {
        console.log("Se produjo un error, el repuesto no pudo ser eliminado...");
        return false;
      }
    } catch (error) {
      console.error("Error al tratar de eliminar el repuesto de la orden.", error);
    }
  };