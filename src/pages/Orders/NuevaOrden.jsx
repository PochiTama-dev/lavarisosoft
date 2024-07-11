import { useState } from "react";

import Header from "../../Components/Header/Header.jsx";
import NuevosDatosCliente from "../../Components/Orders/NuevaOrden/NuevosDatosCliente.jsx";
import NuevosDatosIncidente from "../../Components/Orders/NuevaOrden/NuevosDatosIncidente.jsx";
import NuevosDatosTecnico from "../../Components/Orders/NuevaOrden/NuevosDatosTecnico.jsx";
import { guardarOrden } from "../../services/ordenesService";

const NuevaOrden = () => {
  const [orden, setOrden] = useState('');

  const handleSave = async () => {
    const isSuccess = await guardarOrden(orden);
    if (isSuccess) {
      console.log("Orden guardada");
    } else {
      console.log("Error al guardar la orden");
    }
  };

  return (
    <div className="nuevaOrder-ctn">
      <Header text="Nueva Orden" />
      <div className="mt-3 pt-3">
        <h1>Orden #{}</h1>
      </div>
      <NuevosDatosTecnico setOrden={setOrden} />
      <NuevosDatosCliente />
      <NuevosDatosIncidente />
      <div className="d-flex justify-content-center">
        <button
          className="bg-info rounded-pill text-white papelitoButton"
          onClick={handleSave}
        >
          Crear
        </button>
      </div>
    </div>
  );
};
export default NuevaOrden;
