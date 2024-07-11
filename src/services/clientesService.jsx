const API_URL = "https://lv-back.online/";

export const listaClientes = async () => {
    try {
      const response = await fetch(`${API_URL}/clientes/lista`);
      const clientes = await response.json();
      if (clientes[0] !== undefined) {
        console.log(`Se encontró una lista con ${clientes.length} clientes!!`);
        console.log(clientes);
        return clientes;
      } else {
        console.log('Aún no se registra ningún cliente...');
        return false;
      }
    } catch (error) {
      console.error("Error, no se encontraron clientes en la base de datos....", error);
    }
  };
  
export const obtenerCliente = async (id) => {
    try {
      const response = await fetch(`${API_URL}/clientes/${id}`);
      const cliente = await response.json();
      if (cliente) {
        console.log(`Se encontró un cliente asociado al id ${id}`);
        console.log(cliente);
        return cliente;
      } else {
        console.log(`No se encontró ningún cliente con el id ${id}`);
        return false;
      }
    } catch (error) {
      console.error("Error, cliente no encontrado.", error);
    }
  };