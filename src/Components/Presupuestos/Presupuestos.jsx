import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "../Header/Header";
import DetalleOrden from "./DetalleOrden";

import "./Presupuestos.css";

const Presupuestos = () => {
  const [showOrders, setShowOrders] = useState({});
  const [comisiones, setComisiones] = useState({
    Servicio: true,
    Repuestos: true,
    Viáticos: true,
    "Descuento referidos": false,
    "Comisión visita": false,
    "Comisión reparación": false,
    "Comisión entrega": false,
    "Comisión rep. domicilio": false,
    "Gasto impositivo": false,
  });
  const [cajas, setCajas] = useState({
    "Caja 1": true,
    "Caja 2": false,
    "Caja 3": false,
  });

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

  const toggleComision = (comision) => {
    setComisiones({
      ...comisiones,
      [comision]: !comisiones[comision],
    });
  };

  const toggleCaja = (caja) => {
    setCajas({
      ...cajas,
      [caja]: !cajas[caja],
    });
  };

  const navigate = useNavigate();
  const handleClickLiquidacion = () => {
    navigate('/liquidacionPresupuestos');
  };

  return (
    <div className="p-3 presupuestos">
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
            <DetalleOrden comisiones={comisiones} cajas={cajas} />
          </div>
          <div className="d-flex justify-content-between div-botones">
            <button className="bg-info rounded-pill py-1 px-4 text-white">
              Consolidar
            </button>
            <button onClick={handleClickLiquidacion} className="bg-info rounded-pill py-1 px-4 text-white">
              Liq.Inmediata
            </button>
            <button className="bg-info rounded-pill py-1 px-4 text-white">
              Imprimir factura
            </button>
          </div>
        </div>
        {/* End Form */}
        {/* Desplegables */}
        <div className="col-3">
          <div className="ventas-container">
            <h3>Comisiones</h3>
            {Object.keys(comisiones).map((comision) => (
              <div
                key={comision}
                className={`item ${comisiones[comision] ? "active" : ""}`}
              >
                <span>{comision}</span>
                <button onClick={() => toggleComision(comision)}>
                  {comisiones[comision] ? "-" : "+"}
                </button>
              </div>
            ))}
            <h3>Cajas</h3>
            {Object.keys(cajas).map((caja) => (
              <div key={caja} className={`item ${cajas[caja] ? "active" : ""}`}>
                <span>{caja}</span>
                <button onClick={() => toggleCaja(caja)}>
                  {cajas[caja] ? "-" : "+"}
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* End Desplegables */}
      </div>
    </div>
  );
};

export default Presupuestos;
