import { useState } from "react";
import "./Grilla.css";
import PropTypes from "prop-types";
const Grilla = ({ columnas, elementos }) => {
  const [itemInventario, setitemInventario] = useState(-1);

  const toggleItemInventario = (index) => {
    setitemInventario(index === itemInventario ? -1 : index); // Si el mismo ítem ya está seleccionado, lo deselecciona
  };

  return (
    <div>
      <ul className="row p-0">
        {columnas.map((columna, index) => (
          <li key={index} className="col columna-li">
            {columna} <span></span>
          </li>
        ))}
      </ul>
      <ul className="grilla">
        {elementos.map((item, index) => (
          <div key={index} className="itemContainer">
            <ul
              className={`ulFlecha row mb-1 p-0 ${
                index % 2 === 0 ? "bg-light" : ""
              }`}
            >
              {Object.entries(item).map(([key, valor], index) =>
                Array.isArray(valor) ? (
                  ""
                ) : (
                  <li
                    key={index}
                    className={`col valor-li text-center ${
                      key === "nOrden" ? "valorItem" : ""
                    }`}
                  >
                    {valor}
                  </li>
                )
              )}
              {item.lotes && (
                <li className="valorItem">
                  <span
                    onClick={() => toggleItemInventario(index)}
                    className="flechaAbajo"
                  ></span>
                </li>
              )}
            </ul>
            {itemInventario === index && item.lotes && (
              <div>
                <ul>
                  {item.lotes.map((lote, index) => (
                    <li key={index} className="bg-primary-subtle col mb-1">
                      Proveedor {lote.proveedor} |Lote {lote.lote} | Orden{" "}
                      {lote.orden} | {lote.unidadRestante} unidad restante
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
};
export default Grilla;

Grilla.propTypes = {
  columnas: PropTypes.array.isRequired,
  elementos: PropTypes.array.isRequired,
};
