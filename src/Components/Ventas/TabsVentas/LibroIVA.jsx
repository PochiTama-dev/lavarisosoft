import { useState } from "react";
import "./LibroIVA.css";

const LibroIVA = () => {
  const [orderBy, setOrderBy] = useState(null);
  const [orderAsc, setOrderAsc] = useState(true);

  const handleSort = (columnName) => {
    if (orderBy === columnName) {
      setOrderAsc((prevOrderAsc) => !prevOrderAsc);
    } else {
      setOrderBy(columnName);
      setOrderAsc(true);
    }
  };

  // Datos para la tabla
  const libroIVA = [
    {
      numeroOrden: "#3366",
      fecha: "12/12/12",
      monto: "",
      denominacioComprador: "",
      netoGravado: "",
      IVA: "",
      total: "",
    },
    {
      numeroOrden: "#3365",
      fecha: "12/12/12",
      monto: "",
      denominacioComprador: "",
      netoGravado: "",
      IVA: "",
      total: "",
    },
    {
      numeroOrden: "#3364",
      fecha: "12/12/12",
      monto: "",
      denominacioComprador: "",
      netoGravado: "",
      IVA: "",
      total: "",
    },
    {
      numeroOrden: "#3363",
      fecha: "12/12/12",
      monto: "",
      denominacioComprador: "",
      netoGravado: "",
      IVA: "",
      total: "",
    },
  ];

  // Ordenar datos según la columna seleccionada
  const sortedData = orderBy
    ? [...libroIVA].sort((a, b) => {
        const valA = a[orderBy];
        const valB = b[orderBy];
        if (orderAsc) {
          return valA < valB ? -1 : valA > valB ? 1 : 0;
        } else {
          return valA > valB ? -1 : valA < valB ? 1 : 0;
        }
      })
    : libroIVA;

  return (
    <div className="libro-container">
      <div className="libro-header-container">
        <div className="libro-header-left">
          <div className="libro-heading">
            <h1>Libro IVA</h1>
          </div>
          <div className="libro-heading-button-container">
            <button className="libro-heading-button">
              Comprobante de ventas
            </button>
          </div>
        </div>
        <div className="libro-header-right">
          <div className="libro-input-container">
            <h3 className="libro-input-text">Filtrar por fecha</h3>
            <input
              className="libro-input"
              type="date"
              placeholder="dd/mm/aaaa"
            />
            <button className="libro-button-search">🔍︎</button>
          </div>
        </div>
      </div>
      <div className="libro-excel-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => handleSort("numeroOrden")}>
                No. de orden
                {orderBy === "numeroOrden" ? (
                  orderAsc ? (
                    "▲"
                  ) : (
                    "▼"
                  )
                ) : (
                  <span>▼</span>
                )}
              </th>
              <th onClick={() => handleSort("fecha")}>
                Fecha
                {orderBy === "fecha" ? orderAsc ? "▲" : "▼" : <span>▼</span>}
              </th>
              <th onClick={() => handleSort("monto")}>
                Monto
                {orderBy === "monto" ? orderAsc ? "▲" : "▼" : <span>▼</span>}
              </th>
              <th onClick={() => handleSort("denominacionComprador")}>
                Denominación comprador
                {orderBy === "denominacionComprador" ? (
                  orderAsc ? (
                    "▲"
                  ) : (
                    "▼"
                  )
                ) : (
                  <span>▼</span>
                )}
              </th>
              <th onClick={() => handleSort("netoGravado")}>
                Neto gravado
                {orderBy === "netoGravado" ? (
                  orderAsc ? (
                    "▲"
                  ) : (
                    "▼"
                  )
                ) : (
                  <span>▼</span>
                )}
              </th>{" "}
              <th onClick={() => handleSort("IVA")}>
                IVA {orderBy === "IVA" ? orderAsc ? "▲" : "▼" : <span>▼</span>}
              </th>
              <th onClick={() => handleSort("total")}>
                Total{" "}
                {orderBy === "total" ? orderAsc ? "▲" : "▼" : <span>▼</span>}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "row-even" : ""}>
                <td>{item.numeroOrden}</td>
                <td>{item.fecha}</td>
                <td>{item.monto}</td>
                <td>{item.denominacioComprador}</td>
                <td>{item.netoGravado}</td>
                <td>{item.IVA}</td>
                <td>{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="libro-export-button-container">
        <button className="libro-export-button" type="submit">
          <svg
            width="34"
            height="41"
            viewBox="0 0 34 41"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M32.7778 13.1055C31.8473 9.63242 29.7967 6.56348 26.9442 4.37463C24.0916 2.18578 20.5966 0.999348 17.001 0.999347C13.4054 0.999347 9.91036 2.18578 7.05783 4.37463C4.20529 6.56348 2.15473 9.63242 1.22417 13.1055"
              stroke="white"
              stroke-width="2"
            />
            <path
              d="M17.0022 17.3337L18.4605 15.5137L17.0022 14.347L15.5439 15.5137L17.0022 17.3337ZM14.6689 38.3337C14.6689 38.9525 14.9147 39.546 15.3523 39.9836C15.7899 40.4212 16.3834 40.667 17.0022 40.667C17.621 40.667 18.2145 40.4212 18.6521 39.9836C19.0897 39.546 19.3355 38.9525 19.3355 38.3337L14.6689 38.3337ZM30.1272 24.847L18.4605 15.5137L15.5439 19.1537L27.2105 28.487L30.1272 24.847ZM15.5439 15.5137L3.8772 24.847L6.79387 28.487L18.4605 19.1537L15.5439 15.5137ZM14.6689 17.3337L14.6689 38.3337L19.3355 38.3337L19.3355 17.3337L14.6689 17.3337Z"
              fill="white"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default LibroIVA;
