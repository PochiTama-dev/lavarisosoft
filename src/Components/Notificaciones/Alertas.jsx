import { useState, useEffect } from "react";
import "./Notificaciones.css";
import alertasData from "./alertas.json";

const Alertas = () => {
  const [openIndex, setOpenIndex] = useState(-1);
  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    setAlertas(alertasData);
  }, []);

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="container p-5 notificaciones-container">
      <h2>Alertas</h2>
      {alertas.map((alerta, index) => (
        <div key={index}>
          <div className="row my-3">
            <div className="col-1 d-flex justify-content-center">
              <div className="circle-indicator">
        {/*         {alerta.descripciones.length} */}
              </div>
            </div>
            <div className="col-10 p-0">
              <div className="dropdown dropdown-alert-name">
                <button
                  className="btn btn-employe dropdown-toggle"
                  type="button"
                  onClick={() => toggleDropdown(index)}
                  aria-expanded={openIndex === index ? "true" : "false"}
                >
                  <b>{alerta.nombre}</b>
                </button>
                <ul
                  className={`notification-alert ${
                    openIndex === index ? "show" : ""
                  }`}
                >
                  {alerta.descripciones.map((descripcion, idx) => (
                    <li key={idx}>
                      <a className="item" href="">
                        <b>{alerta.nombre}</b> {descripcion}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default Alertas;
