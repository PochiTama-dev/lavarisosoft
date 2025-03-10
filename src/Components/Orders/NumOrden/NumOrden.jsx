import React, { useState } from "react";
import PropTypes from "prop-types";
import "./NumOrden.css";

const NumOrden = ({ ordenes, onSelectOrden }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredOrdenes = ordenes.filter((orden) =>
    orden.id.toString().includes(searchTerm)
  );

  return (
    <div className="bg-secondary orderNum overflow-scroll">
      <h3>Por número de orden</h3>
      <input
        type="text"
        placeholder="Buscar por número de orden"
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />
      <ul className="numOrden">
        {filteredOrdenes.map((orden, index) => {
          const { id, Presupuesto, Entrega } = orden;
          const estadoClase =
            Entrega != null
              ? "text-entregado"
              : Presupuesto != null
              ? "text-presupuestado"
              : "text-aprobado";

          return (
            <li key={index}>
              <a
                href="#"
                onClick={(e) => onSelectOrden(e, orden.id)}
                className="text-orders"
              >
                #{id}
              </a>
              <span className={estadoClase}>
                {Entrega != null
                  ? "Entregado"
                  : Presupuesto != null
                  ? "Presupuestado"
                  : "Aprobado"}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

NumOrden.propTypes = {
  ordenes: PropTypes.array.isRequired,
  onSelectOrden: PropTypes.func.isRequired,
};

export default NumOrden;
