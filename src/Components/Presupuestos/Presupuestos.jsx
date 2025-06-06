/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Add useLocation
import Header from "../Header/Header";
import "./Presupuestos.css";
import { empleados } from "../../services/empleadoService";
import { listadoOrdenes } from "../../services/ordenesService";
import { listaCajas } from "../../services/cajasService";
import { ordenesRepuestos } from "../../services/ordenRepuestosService";
import DetalleOrdenPresupuesto from "./DetalleOrdenPresupuesto";

const Presupuestos = () => {
  const location = useLocation(); // Get navigation state
  const [showOrders, setShowOrders] = useState({});
  const [tecnicos, setTecnicos] = useState([]);
  const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState(null);
  const [ordenes, setOrdenes] = useState([]);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [cajas, setCajas] = useState([]);
  const [cajaSeleccionada, setCajaSeleccionada] = useState(null);
  const [comisiones, setComisiones] = useState({
    Repuestos: true,
    Viáticos: true,
    "Descuento referidos": false,
    "Comisión reparación": false,
    "Comisión entrega": false,
    "Gasto impositivo": false,
  });
  const [expandedTecnico, setExpandedTecnico] = useState(null);
  const [repuestosOrdenes, setRepuestosOrdenes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTecnicos = async () => {
      try {
        const response = await empleados();
        const tecnicosFiltrados = response.filter(
          (empleado) => empleado.id_rol === 5
        );

        console.log(
          "Técnicos cargados:",
          tecnicosFiltrados.map((t) => ({
            id: t.id,
            nombre: t.nombre,
            ordenes: t.Ordenes?.length || 0,
          }))
        );

        setTecnicos(tecnicosFiltrados);
      } catch (error) {
        console.error("Error al cargar técnicos:", error);
      }
    };
    const fetchOrdenes = async () => {
      const response = await listadoOrdenes();

      const ordenesFiltradas = response.filter((orden) => orden.Entrega?.id && orden.TiposEstado?.tipo_estado !== "Cerrada");
      setOrdenes(ordenesFiltradas);
    };
    const fetchCajas = async () => {
      const response = await listaCajas();
      setCajas(response);
    };
    const fetchRepuestos = async () => {
      const response = await ordenesRepuestos();
      if (response) {
        setRepuestosOrdenes(response);
      }
    };
    fetchTecnicos();
    fetchOrdenes();
    fetchCajas();
    fetchRepuestos();
  }, []);

  useEffect(() => {
    if (location.state?.ordenId && ordenes.length > 0 && repuestosOrdenes.length > 0) {
      console.log("Orden ID received from navigation state:", location.state.ordenId);
      const ordenCompleta = ordenes.find((o) => o.id === location.state.ordenId);
      if (ordenCompleta) {
        const repuestosOrden = repuestosOrdenes.filter(
          (r) => r.id_orden === location.state.ordenId
        );
        setOrdenSeleccionada({ ...ordenCompleta, repuestos: repuestosOrden });
      } else {
        console.log("Orden not found in ordenes:", location.state.ordenId);
      }
    }
  }, [location.state, ordenes, repuestosOrdenes]);

  const toggleComision = (comision) => {
    setComisiones((prevComisiones) => ({
      ...prevComisiones,
      [comision]: !prevComisiones[comision],
    }));
  };

  const handleTecnicoSelect = (tecnico) => {
    const tecnicoCompleto = tecnicos.find((t) => t.id === tecnico.id);

    console.log("Técnico clickeado:", {
      id: tecnicoCompleto.id,
      nombre: tecnicoCompleto.nombre,
      cantidadOrdenes: tecnicoCompleto.Ordenes.length,
      ordenes: tecnicoCompleto.Ordenes,
    });

    setExpandedTecnico(expandedTecnico === tecnico.id ? null : tecnico.id);
    setTecnicoSeleccionado(tecnicoCompleto);
    setOrdenSeleccionada(null);
  };

  const handleOrdenSelect = (orden) => {
    console.log("handleOrdenSelect called with:", orden);
    const ordenCompleta = ordenes.find((o) => o.id === orden.id);
    if (!ordenCompleta) {
      console.log("Orden not found in ordenes:", orden.id);
      return;
    }
    const repuestosOrden = repuestosOrdenes.filter(
      (r) => r.id_orden === orden.id
    );
    console.log("Orden completa:", ordenCompleta);
    console.log("Repuestos de la orden:", repuestosOrden);
    setOrdenSeleccionada({ ...ordenCompleta, repuestos: repuestosOrden });
    setCajaSeleccionada(null);
  };

  const handleCajaSelect = (caja) => {
    console.log("Caja seleccionada:", caja);
    setCajaSeleccionada((prevCaja) => (prevCaja?.id === caja.id ? null : caja));
  };

  const filteredOrdenes = ordenes.filter((orden) =>
    orden.id.toString().includes(searchTerm)
  );

  return (
    <div className="p-3 presupuestos">
      <Header text="GESTION DE PRESUPUESTOS" />
      <div className="row p-5 mt-5">
        <div className="col-4">
          <div className="presupuestos-left-container">
            {/* Lista por técnico */}
            <div className="container-lists top-container-lists mb-4">
              <h2 className="list-heading">Por técnico</h2>
              <div className="scrollable-container">
                {tecnicos?.map((tecnico) => (
                  <div key={tecnico.id} className="tecnico-container">
                    <div
                      className={`tecnico-item ${
                        expandedTecnico === tecnico.id ? "selected" : ""
                      }`}
                      onClick={() => handleTecnicoSelect(tecnico)}
                    >
                      <h5>
                        {tecnico.nombre.trim()} {tecnico.apellido}
                      </h5>
                      <span>{expandedTecnico === tecnico.id ? "▼" : "▶"}</span>
                    </div>

                    {expandedTecnico === tecnico.id && tecnico.Ordenes && (
                      <div className="ordenes-list">
                        {tecnico.Ordenes.filter((ordenTecnico) =>
                          ordenes.some(
                            (orden) =>
                              orden.id === ordenTecnico.id && orden.Entrega?.id
                          )
                        ).length > 0 ? (
                          tecnico.Ordenes.filter((ordenTecnico) =>
                            ordenes.some(
                              (orden) =>
                                orden.id === ordenTecnico.id &&
                                orden.Entrega?.id
                            )
                          ).map((ordenTecnico) => {
                            const ordenCompleta = ordenes.find(
                              (o) => o.id === ordenTecnico.id
                            );
                            return (
                              <div
                                key={ordenTecnico.id}
                                className={`orden-item ${
                                  ordenSeleccionada?.id === ordenTecnico.id
                                    ? "selected"
                                    : ""
                                }`}
                                onClick={() => handleOrdenSelect(ordenCompleta)}
                              >
                                <span className="orden-dot">●</span>
                                <span
                                  style={{
                                    color: "#283959",
                                    fontWeight: "500",
                                  }}
                                >
                                  Orden #{ordenTecnico.id}
                                </span>
                                <a className="ver-detalles">Ver detalles</a>
                              </div>
                            );
                          })
                        ) : (
                          <div className="orden-item empty">
                            No hay órdenes con entrega asignadas
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Lista por número de orden */}
            <div className="container-lists">
              <h2 className="list-heading">Por número de orden</h2>
              <input
                type="text"
                placeholder="Buscar por número de orden"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <div className="scrollable-container">
                {filteredOrdenes.map((orden) => (
                  <div
                    key={orden.id}
                    className={`orden-numero-item ${
                      ordenSeleccionada?.id === orden.id ? "selected" : ""
                    }`}
                    onClick={() => handleOrdenSelect(orden)}
                  >
                    <span>#{orden.id}</span>
                    <span
                      className={
                        orden.TiposEstado?.tipo_estado === "Aprobada"
                          ? "estado-aprobada"
                          : orden.TiposEstado?.tipo_estado === "Consolidada"
                          ? "estado-consolidada"
                          : ""
                      }
                    >
                      Entregada
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Form */}
        <div className="col-5">
          <div className="row align-items-center">
            <div className="col-7">
              <h2 className="p-1 grey-text fw-bold">
                {ordenSeleccionada
                  ? `Orden #${ordenSeleccionada.id}`
                  : "Seleccione una orden"}
              </h2>
            </div>
          </div>
          <div className="row">
            <DetalleOrdenPresupuesto
              orden={ordenSeleccionada}
              setOrden={setOrdenSeleccionada}
              cajaSeleccionada={cajaSeleccionada}
              onCajaSelect={handleCajaSelect}
              comisiones={comisiones}
            />
          </div>
        </div>
        {/* Desplegables */}
        <div className="col-3">
          <div className="presupuestos-right-container">
            <div className="presupuestos-right-container-top">
              <h3 className="list-heading">Comisiones</h3>
              {Object.keys(comisiones).map((comision) => (
                <div
                  key={comision}
                  className={`item ${comisiones[comision] ? "active" : ""}`}
                  onClick={() => toggleComision(comision)}
                >
                  <span>{comision}</span>
                  <button>{comisiones[comision] ? "-" : "+"}</button>
                </div>
              ))}
            </div>
            {/* <div className="presupuestos-right-container-bottom">
              <h3 className="list-heading">Cajas</h3>
              {cajas?.map((caja) => (
                <div
                  key={caja.id}
                  className={`item ${
                    cajaSeleccionada?.id === caja.id ? "active" : ""
                  }`}
                  onClick={() => handleCajaSelect(caja)}
                >
                  <span>{caja.denominacion}</span>
                  <button>
                    {cajaSeleccionada?.id === caja.id ? "-" : "+"}
                  </button>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Presupuestos;
