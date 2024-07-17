import { useState, useEffect } from "react";
import Header from "../../Components/Header/Header";
import NumOrden from "../../Components/Orders/NumOrden/NumOrden";
import OrdenDetalle from "../../Components/Orders/OrdenDetalle/OrdenDetalle";
import Tecnicos from "../../Components/Orders/OrdenTecnico/Tecnicos";
import "./Orders.css";
import caja from "../../images/caja.webp";
import nuevaOrden from "../../images/nuevaOrdenTrabajo.webp";
import dolar from "../../images/signoDolar.webp";
import { Link } from "react-router-dom";
const Orders = () => {
  const [tecnicos, setTecnicos] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [error, setError] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [show, setShow] = useState(false);

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
    setUpdateTrigger((prev) => prev + 1);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!ordenes) {
    return <div>Cargando...</div>;
  }

  return (
    <div style={{ height: "100vh", overflowY: "hidden" }}>
      <Header text={"Ordenes"} />
      <div
        className="d-flex mt-5 pt-5 text-orders"
        style={{ paddingLeft: "3%" }}
      >
        <aside>
          <div>
            <Tecnicos tecnicos={tecnicos} onSelectOrden={handleSelectOrden} />
          </div>
          <div className="mt-3">
            <NumOrden ordenes={ordenes} onSelectOrden={handleSelectOrden} />
          </div>
        </aside>
        <aside className="bg-secondary asideDetail" style={{ width: "65%" }}>
          <div className="mx-3">
            {selectedOrden ? (
              <OrdenDetalle
                orden={selectedOrden}
                onUpdateOrden={handleUpdateOrden}
              />
            ) : (
              <div>Selecciona una orden para ver los detalles</div>
            )}
          </div>
        </aside>
        <aside className="d-flex flex-column justify-content-end m-3">
          {show && (
            <div>
              {selectedOrden == null ? (
                ""
              ) : (
                <>
                  <Link
                    to="/ordenes/cobrarCaja"
                    className="text-decoration-none"
                  >
                    <center className="imageContainer bg-info rounded-circle position-relative">
                      <img className="iconsOptions" src={caja} alt="" />
                      <span className="black-text" style={{ fontSize: "14px" }}>
                        Cobrar en caja
                      </span>
                    </center>
                  </Link>
                </>
              )}
              <Link to="/ordenes/ordenGlobal" className="text-decoration-none">
                <center className="imageContainer bg-info rounded-circle position-relative">
                  <img
                    className="iconsOptions position-absolute iconDolar"
                    src={dolar}
                    alt=""
                  />
                  <span className="black-text" style={{ fontSize: "14px" }}>
                    Aumento Global
                  </span>
                </center>
              </Link>
              <Link to="/ordenes/nuevaOrden" className="text-decoration-none">
                <center className="imageContainer bg-info rounded-circle position-relative">
                  <img className="iconsOptions" src={nuevaOrden} alt="" />
                  <span className="black-text" style={{ fontSize: "14px" }}>
                    Nueva orden de trabajo
                  </span>
                </center>
              </Link>
            </div>
          )}
          <h2
            className="bg-info text-white text-center rounded-pill agregarRepuesto"
            onClick={() => setShow(!show)}
          >
            +
          </h2>
        </aside>
      </div>
    </div>
  );
};
export default Orders;
