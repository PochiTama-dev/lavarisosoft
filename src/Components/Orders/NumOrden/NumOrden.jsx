import { useState } from "react";
import PropTypes from "prop-types";
import "./NumOrden.css";

const NumOrden = ({ ordenes, onSelectOrden }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset page on search
  };

  const filteredOrdenes = ordenes
    .filter((orden) => orden.id.toString().includes(searchTerm))
    .sort((a, b) => b.id - a.id);

  const totalPages = Math.ceil(filteredOrdenes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedOrdenes = filteredOrdenes.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

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
        {displayedOrdenes.map((orden   ) => {
          const { id, Presupuesto, Entrega, id_empleado } = orden;
          let estadoClase, estadoTexto;
          if (!id_empleado) {
            estadoClase = "text-sin-asignar";
            estadoTexto = "Sin Asignar";
          } else {
            estadoClase =
              Entrega != null
                ? "text-entregado"
                : Presupuesto != null
                ? "text-presupuestado"
                : "text-aprobado";
            estadoTexto =
              Entrega != null
                ? "Entregado"
                : Presupuesto != null
                ? "Presupuestado"
                : "Aprobado";
          }

          return (
            <li key={id}   >
              <a
                href="#"
                onClick={(e) => onSelectOrden(e, id)}
                className="text-orders"
                style={{display:'flex', width:'100%', justifyContent:'space-between'}}
              >
                #{id}
              <span className={estadoClase}>
                {estadoTexto}
              </span>
              </a>
            </li>
          );
        })}
      </ul>
      <div className="pagination" style={{ display:'flex', width:'100%', justifyContent:'center', alignItems:'center', gap:'10px' }}>
        <button onClick={handlePrevPage} disabled={currentPage === 1} className="arrow-button">
          ◄
        </button>
        <span>{currentPage} de {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages} className="arrow-button">
          ►
        </button>
      </div>
    </div>
  );
};

NumOrden.propTypes = {
  ordenes: PropTypes.array.isRequired,
  onSelectOrden: PropTypes.func.isRequired,
};

export default NumOrden;
