import React, { useState } from "react";

import "./Caja.css";
import "./Incumplimientos.css";

const Incumplimientos = () => {
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

  // Datos para la tabla de incumplimientos
  const incumplimientosData = [
    {
      estado: "Pago",
      numeroOrden: "#3366",
      fecha: "08/04/2024",
      motivo: 'Nadie en el domicilio',
    },
    {
      estado: "Pago",
      numeroOrden: "#3364",
      fecha: "20/01/2024",
      motivo: "Nadie en el domicilio",
    },
    {
      estado: "Devolución",
      numeroOrden: "#3365",
      fecha: "05/03/2024",
      motivo: 'Pendiente de pago',
    },
  ];

  // Ordenar datos según la columna seleccionada
  const sortedData = orderBy
    ? [...incumplimientosData].sort((a, b) => {
        const valA = a[orderBy];
        const valB = b[orderBy];
        if (orderAsc) {
          return valA < valB ? -1 : valA > valB ? 1 : 0;
        } else {
          return valA > valB ? -1 : valA < valB ? 1 : 0;
        }
      })
    : incumplimientosData;

  return (
    <div className="incumplimientos-container">
      <div className="pt-5 px-5">
        <h1 className="fw-bold">Reporte de incumplimientos</h1>
      </div>
      <div className="caja-excel">
        <div className="caja-excel-wrapper px-5">
          <table className="table">
            <thead>
              <tr>
                <th onClick={() => handleSort("estado")}>
                  Estado{" "}
                  {orderBy === "estado" ? orderAsc ? "▲" : "▼" : <span>▼</span>}
                </th>
                <th onClick={() => handleSort("numeroOrden")}>
                  Orden{" "}
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
                  Fecha{" "}
                  {orderBy === "fecha" ? orderAsc ? "▲" : "▼" : <span>▼</span>}
                </th>
                <th onClick={() => handleSort("motivo")}>
                  Motivo{" "}
                  {orderBy === "motivo" ? orderAsc ? "▲" : "▼" : <span>▼</span>}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, index) => {
                const color =
                  item.estado.charAt(0) === "P" ? "#40A63D" : "#E58769";

                return (
                  <tr key={index} className={index % 2 === 0 ? "" : "row-even"}>
                    <td className="fw-bold" style={{ color: color }}>{item.estado}</td>
                    <td>{item.numeroOrden}</td>
                    <td>{item.fecha}</td>
                    <td>{item.motivo}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Incumplimientos;
