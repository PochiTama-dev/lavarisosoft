import PropTypes from "prop-types";
import { useState } from "react";
import "./OrdenesTecnico.css";
const OrdenesTecnico = ({ nombre, ordenes, onSelectOrden }) => {
  const [show, setShow] = useState(false);
  const estadosClassname = [
    "",
    "badge-aprobada",
    "badge-cancelada",
    "badge-cerrada",
    "badge-pendiente",
  ];

  const handleShowOrder = () => {
    setShow(!show);
  };

  return (
    <div className="bg-secondary ordenes-tecnico">
      <div className="d-flex" onClick={handleShowOrder} style={{ cursor: "pointer" }}>
        <h5 className="subtitle">{nombre}</h5>
        <ul   className="ordenTecnico">
          <li></li>
        </ul>
      </div>
      {show && (
        <div className="pb-3">
          {ordenes.map((orden, index) => (
            <div
              key={index}
              className="feedback-tecnicos-container align-items-center"
              onClick={(e) => onSelectOrden(e, orden.id)}
              style={{ cursor: "pointer" }}
            >
              <div

      
                className={`notification-badge-tarea ${
                  estadosClassname[orden.id_tipo_estado]
                }`}
              ></div>
              <li className="li-tarea">
                Orden #{orden.id}{" "}
                <a href="#"  style={{marginLeft:'70px', color:'#69688c'}}>
                  ver detalles
                </a>
              </li>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default OrdenesTecnico;
OrdenesTecnico.propTypes = {
  nombre: PropTypes.string.isRequired,
  ordenes: PropTypes.array.isRequired,
  onSelectOrden: PropTypes.func.isRequired,
};
