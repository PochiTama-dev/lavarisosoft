import "./Feedback.css";
import Header from "../Header/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown } from "react-bootstrap";
import { useState } from "react";

const Feedback = () => {
  const [showOrders, setShowOrders] = useState({});

  const handleShowOrder = (nombre) => {
    setShowOrders({
      ...showOrders,
      [nombre]: !showOrders[nombre],
    });
  };

  const tecnicos = [
    { nombre: "Alan Almendra" },
    { nombre: "Mariela Paz" },
    { nombre: "Leandro Suero" },
  ];

  const orders = [
    { number: 1, status: "Aprobada" },
    { number: 2, status: "Aprobada" },
    { number: 3, status: "Pendiente" },
    { number: 4, status: "Pendiente" },
    { number: 5, status: "Aprobada" },
    { number: 6, status: "Pendiente" },
    { number: 7, status: "Pendiente" },
    { number: 8, status: "Aprobada" },
    { number: 9, status: "Aprobada" },
  ];
  return (
    <div className="container-full-width">
      {/* <Header
        text="Feedback"
      /> */}
      <h1 className="text-left feedback-heading text-uppercase">Feedback</h1>
      <div className="content-container">
        <div className="left-containers">
          <div className="left-container">
            {/* Contenedor izquierdo superior */}
            <h2 className="p-3 feedback-containers-heading">Por técnico</h2>
            {/* Lista de elementos por número técnico */}
            <div className="scrollable-container-top">
              {tecnicos?.map((t, i) => (
                <>
                  <div className="feedback-tecnicos-container" key={i}>
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
                </>
              ))}
            </div>
          </div>
          <div className="left-container">
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
                      order.status === "Aprobada" ? "green-text" : "orange-text"
                    }
                  >
                    {order.status}
                  </h5>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="right-container">
          {/* Contenedor derecho */}
          <h2
            className="p-3
           feedback-containers-heading"
          >
            Orden #2552525
          </h2>
          <div className="feedback-form">
            <h6 className="p-3 feedback-form-charge">Cargar feedback</h6>
            <textarea className="feedback-textarea"></textarea>
          </div>
          <div className="feedback-form-edit">
            <button className="feedback-form-button">Editar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
