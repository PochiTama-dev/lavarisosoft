import PropTypes from "prop-types";
import "./NumOrden.css";

const NumOrden = ({ ordenes, onSelectOrden }) => {
  const resultadoOrden = ["text-aprobado", "text-pendiente", "text-secondary"];
  
  const estadoMap = {
    "Aprobada": 0,
    "Pendiente": 1,
    "Cancelada": 2
  };

  return (
    <div className="bg-secondary orderNum overflow-scroll">
      <h3>Por número de orden</h3>
      <ul className="numOrden">
        {ordenes.map((orden, index) => {
          const { numero_orden, TiposEstado } = orden;
          const estadoClase = resultadoOrden[estadoMap[TiposEstado.tipo_estado]];

          return (
            <li key={index} className="d-flex justify-content-around">
              <a href="#" onClick={(e) => onSelectOrden(e, orden.id)} className="text-orders">#{numero_orden}</a>
              <span className={estadoClase}>
                {TiposEstado.tipo_estado}
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
  onSelectOrden: PropTypes.func.isRequired
};

export default NumOrden;