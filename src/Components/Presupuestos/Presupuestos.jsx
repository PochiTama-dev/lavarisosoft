import { useState } from "react";
import Tab from "../../Components/Tabs/Tab";
import Tabs from "../../Components/Tabs/Tabs";
import Servicios from "./TabsPresupuestos/Servicios";
import Header from "../Header/Header";
import DetalleOrden from "./DetalleOrden";

import "./Presupuestos.css";

const Presupuestos = () => {
  const [showOrders, setShowOrders] = useState({});
  const [active, setActive] = useState(0);
  const handleChange = (newActive) => setActive(newActive);

  const handleShowOrder = (nombre) => {
    setShowOrders({
      ...showOrders,
      [nombre]: !showOrders[nombre],
    });
  };

  const tecnicos = [
    { nombre: "Alan Almendra" },
    { nombre: "Mariela Paz" },
    { nombre: "Leandro Sueyro" },
  ];

  const orders = [
    { number: 25645, status: "Consolidada" },
    { number: 25646, status: "Aprobada" },
    { number: 25423, status: "Aprobada" },
  ];

  return (
    
    <div className="vw-100 p-3 presupuestos">
      <Header text="Gestion de presupuestos" />
      <div className="row p-5 mt-5">
        {/* Listas */}
        <div className="col-4">
          <div className="container-lists">
            {/* Contenedor izquierdo superior */}
            <h2 className="p-3 feedback-containers-heading">Por técnico</h2>
            {/* Lista de elementos por número técnico */}
            <div className="scrollable-container-top">
              {tecnicos?.map((t, i) => (
                <div key={i}>
                  <div className="feedback-tecnicos-container">
                    <h3 className="feedback-tecnicos-heading">{t.nombre}</h3>
                    <ul
                      onClick={() => handleShowOrder(t.nombre)}
                      className="feedback-tecnico"
                    >
                      <li></li>
                    </ul>
                  </div>
                  {showOrders[t.nombre] && (
                    <ul className="feedback-ordenes">
                      <li>
                        Orden #25645 <a href="#">ver detalles</a>
                      </li>
                      <li>
                        Orden #25646 <a href="#">ver detalles</a>
                      </li>
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="container-lists">
            {/* Contenedor izquierdo inferior */}
            <h2 className="p-3 feedback-containers-heading">
              Por número de orden
            </h2>
            {/* Lista de elementos por número de orden */}
            <ul className="scrollable-container-bottom">
              {orders.map((order) => (
                <li
                  key={order.number}
                  className="scrollable-container-bottom-item"
                >
                  <h5>#{order.number}</h5>
                  <h5
                    className={
                      order.status === "Consolidada" ? "green-text" : ""
                    }
                  >
                    {order.status}
                  </h5>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* End Listas */}
        {/* Form */}
        <div className="col-5">
          <div className="row align-items-center">
            <div className="col-7">
              <h2 className="p-1 grey-text fw-bold">Orden #25645</h2>
            </div>
            <div className="col-5 p-0">
              <a className="view-order">Visualizar orden</a>
            </div>
          </div>
          <div className="row">
            <DetalleOrden />
          </div>
          <div className="d-flex justify-content-between">
            <button className="bg-primary rounded-pill py-1 px-4 text-white">
              Consolidar
            </button>
            <button className="bg-primary rounded-pill py-1 px-4 text-white">
              Liq.Inmediata
            </button>
            <button className="bg-primary rounded-pill py-1 px-4 text-white">
              Imprimir factura
            </button>
          </div>
        </div>
        {/* End Form */}
        {/* Tabs */}
        <div className="col-3">
          <div className="ventas-container">
            <Tabs active={active} onChange={handleChange}>
              <Tab title="Servicio">
              </Tab>
              <Tab title="Repuestos">
              </Tab>
              <Tab title="Viáticos">
              </Tab>
              <Tab title="Descuento referidos">
              </Tab>
              <Tab title="Comisión visita">
              </Tab>
              <Tab title="Comisión reparación">
              </Tab>
              <Tab title="Comisión entrega">
              </Tab>
              <Tab title="Comisión rep. domicilio">
              </Tab>
              <Tab title="Gasto impositivo">
              </Tab>
            </Tabs>
          </div>
        </div>
        {/* End Tabs */}
      </div>
    </div>
  );
};

export default Presupuestos;
