import { useState } from "react";
import "./Grilla.css";
import PropTypes from "prop-types";

const Grilla = ({ columnas, elementos }) => {
  const [itemInventario, setitemInventario] = useState(-1);
  const [orderBy, setOrderBy] = useState(null);
  const [orderAsc, setOrderAsc] = useState(true);

  const toggleItemInventario = (index) => {
    setitemInventario(index === itemInventario ? -1 : index);
  };

  const handleSort = (columnName) => {
    if (orderBy === columnName) {
      setOrderAsc((prevOrderAsc) => !prevOrderAsc);
    } else {
      setOrderBy(columnName);
      setOrderAsc(true);
    }
  };

  const sortedItems = [...elementos].sort((a, b) => {
    if (!orderBy) return 0;
    if (orderAsc) {
      return a[orderBy] > b[orderBy] ? 1 : -1;
    } else {
      return a[orderBy] < b[orderBy] ? 1 : -1;
    }
  });

  const renderLotes = (lotes) => {
    return (
      <div>
        <ul>
          {lotes.map((lote, index) => (
            <li key={index} className="bg-primary-subtle col mb-1">
              {Object.values(lote).map((value, index) => (
                <span key={index}> {value} </span>
              ))}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <ul className="row p-0 text-center">
        {columnas.map((columna, index) => (
          <li
            key={index}
            className="col columna-li"
            onClick={() => handleSort(columna.toLowerCase())}
            style={{ cursor: "pointer" }}
          >
            {columna}{" "}
            {orderBy === columna.toLowerCase() && (orderAsc ? "▲" : "▼")}
          </li>
        ))}
      </ul>
      <ul className="grilla">
        {sortedItems.map((item, index) => (
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
            {itemInventario === index && item.lotes && renderLotes(item.lotes)}
          </div>
        ))}
      </ul>
    </div>
  );
};

Grilla.propTypes = {
  columnas: PropTypes.array.isRequired,
  elementos: PropTypes.array.isRequired,
};

export default Grilla;
