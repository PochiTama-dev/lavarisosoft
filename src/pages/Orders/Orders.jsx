import { useState, useEffect } from "react";
import Header from "../../Components/Header/Header";
import NumOrden from "../../Components/Orders/NumOrden/NumOrden";
import OrdenDetalle from "../../Components/Orders/OrdenDetalle/OrdenDetalle";
import Tecnicos from "../../Components/Orders/OrdenTecnico/Tecnicos";
import "./Orders.css";
const Orders = () => {
  const [tecnicos, setTecnicos] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [error, setError] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const fetchOrdenes = async () => {
    try {
      const response = await fetch("https://lv-back.online/ordenes");
      if (!response.ok) {
        throw new Error("Error al obtener las ordenes");
      }
      const data = await response.json();
      setOrdenes(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchTecnicos = async () => {
    try {
      const response = await fetch("https://lv-back.online/empleados");
      if (!response.ok) {
        throw new Error("Error al obtener los tecnicos");
      }
      const data = await response.json();
      const tecnicosConOrdenes = data.filter(
        (tecnico) => tecnico.Ordenes && tecnico.Ordenes.length > 0
      );
      setTecnicos(tecnicosConOrdenes);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchOrdenes();
    fetchTecnicos();
  }, [updateTrigger]);

  const handleSelectOrden = (id) => {
    const ordenSeleccionada = ordenes.find((orden) => orden.id === id);
    setSelectedOrden(ordenSeleccionada);
  };

  const handleUpdateOrden = async () => {
    await fetchOrdenes();
    setSelectedOrden(null);
    setUpdateTrigger(prev => prev + 1);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!ordenes) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <Header text={"Ordenes"} />
      <div className="d-flex m-5 p-5 text-orders">
        <aside>
          <div>
            <Tecnicos tecnicos={tecnicos} onSelectOrden={handleSelectOrden} />
          </div>
          <div className="mt-3">
            <NumOrden ordenes={ordenes} onSelectOrden={handleSelectOrden} />
          </div>
        </aside>
        <aside className="w-100 bg-secondary asideDetail">
          <div className="mx-3">
            {selectedOrden ? (
              <OrdenDetalle orden={selectedOrden} onUpdateOrden={handleUpdateOrden} />
            ) : (
              <div>Selecciona una orden para ver los detalles</div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
export default Orders;
