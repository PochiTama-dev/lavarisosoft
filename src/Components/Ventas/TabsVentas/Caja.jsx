import React, { useState } from "react";
import "./Caja.css"; // Asegúrate de importar el archivo CSS correctamente

const Caja = () => {
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

  // Datos para la tabla de movimientos
  const movimientosData = [
    {
      tipo: "Ingreso",
      importe: "$5000",
      numeroOrden: "#3366",
      hora: "15:06:32",
      comentarios: '"Recibo arreglo..."',
    },
    {
      tipo: "Ingreso",
      importe: "$25000",
      numeroOrden: "#3365",
      hora: "14:24:00",
      comentarios: '"Presupuesto..."',
    },
    {
      tipo: "Egreso",
      importe: "$480000",
      numeroOrden: "#3364",
      hora: "12:27:00",
      comentarios: "Viático",
    },
    {
      tipo: "Ingreso",
      importe: "$5000",
      numeroOrden: "#3366",
      hora: "15:06:32",
      comentarios: '"Recibo arreglo..."',
    },
    {
      tipo: "Ingreso",
      importe: "$25000",
      numeroOrden: "#3365",
      hora: "14:24:00",
      comentarios: '"Presupuesto..."',
    },
    {
      tipo: "Egreso",
      importe: "$480000",
      numeroOrden: "#3364",
      hora: "12:27:00",
      comentarios: "Viático",
    },
    {
      tipo: "Ingreso",
      importe: "$5000",
      numeroOrden: "#3366",
      hora: "15:06:32",
      comentarios: '"Recibo arreglo..."',
    },
    {
      tipo: "Ingreso",
      importe: "$25000",
      numeroOrden: "#3365",
      hora: "14:24:00",
      comentarios: '"Presupuesto..."',
    },
    {
      tipo: "Egreso",
      importe: "$480000",
      numeroOrden: "#3364",
      hora: "12:27:00",
      comentarios: "Viático",
    },
    {
      tipo: "Ingreso",
      importe: "$5000",
      numeroOrden: "#3366",
      hora: "15:06:32",
      comentarios: '"Recibo arreglo..."',
    },
    {
      tipo: "Ingreso",
      importe: "$25000",
      numeroOrden: "#3365",
      hora: "14:24:00",
      comentarios: '"Presupuesto..."',
    },
    {
      tipo: "Egreso",
      importe: "$480000",
      numeroOrden: "#3364",
      hora: "12:27:00",
      comentarios: "Viático",
    },
    {
      tipo: "Ingreso",
      importe: "$5000",
      numeroOrden: "#3366",
      hora: "15:06:32",
      comentarios: '"Recibo arreglo..."',
    },
    {
      tipo: "Ingreso",
      importe: "$25000",
      numeroOrden: "#3365",
      hora: "14:24:00",
      comentarios: '"Presupuesto..."',
    },
    {
      tipo: "Egreso",
      importe: "$480000",
      numeroOrden: "#3364",
      hora: "12:27:00",
      comentarios: "Viático",
    },
    {
      tipo: "Ingreso",
      importe: "$5000",
      numeroOrden: "#3366",
      hora: "15:06:32",
      comentarios: '"Recibo arreglo..."',
    },
    {
      tipo: "Ingreso",
      importe: "$25000",
      numeroOrden: "#3365",
      hora: "14:24:00",
      comentarios: '"Presupuesto..."',
    },
    {
      tipo: "Egreso",
      importe: "$480000",
      numeroOrden: "#3364",
      hora: "12:27:00",
      comentarios: "Viático",
    },
    {
      tipo: "Ingreso",
      importe: "$5000",
      numeroOrden: "#3366",
      hora: "15:06:32",
      comentarios: '"Recibo arreglo..."',
    },
    {
      tipo: "Ingreso",
      importe: "$25000",
      numeroOrden: "#3365",
      hora: "14:24:00",
      comentarios: '"Presupuesto..."',
    },
    {
      tipo: "Egreso",
      importe: "$480000",
      numeroOrden: "#3364",
      hora: "12:27:00",
      comentarios: "Viático",
    },
    {
      tipo: "Ingreso",
      importe: "$5000",
      numeroOrden: "#3366",
      hora: "15:06:32",
      comentarios: '"Recibo arreglo..."',
    },
    {
      tipo: "Ingreso",
      importe: "$25000",
      numeroOrden: "#3365",
      hora: "14:24:00",
      comentarios: '"Presupuesto..."',
    },
    {
      tipo: "Egreso",
      importe: "$480000",
      numeroOrden: "#3364",
      hora: "12:27:00",
      comentarios: "Viático",
    },
  ];

  // Ordenar datos según la columna seleccionada
  const sortedData = orderBy
    ? [...movimientosData].sort((a, b) => {
        const valA = a[orderBy];
        const valB = b[orderBy];
        if (orderAsc) {
          return valA < valB ? -1 : valA > valB ? 1 : 0;
        } else {
          return valA > valB ? -1 : valA < valB ? 1 : 0;
        }
      })
    : movimientosData;

  return (
    <div className="caja-container">
      <div>
        <div className="caja-heading mb-4">
          <h1>Movimientos de caja</h1>
        </div>
        <div className="caja-input-top">
          <div>
            <h4 className="caja-input-text">Buscar por número de orden</h4>
            <input className="caja-input" type="text" placeholder="Buscar" />
            <button className="caja-button-search">🔍︎</button>
          </div>
        </div>
        <div className="caja-input-bottom">
          <div>
            <h4 className="caja-input-text">Filtrar por fecha</h4>
            <input
              className="caja-input"
              type="text"
              placeholder="dd/mm/aaaa"
            />
            <button className="caja-button-search">🔍︎</button>
          </div>
          <div>
            <h4 className="caja-input-text">Filtrar por técnico</h4>
            <input className="caja-input" type="text" placeholder="Buscar" />
            <button className="caja-button-search">🔍︎</button>
          </div>
          <div>
            <h4 className="caja-input-text">Filtrar por cliente</h4>
            <input className="caja-input" type="text" placeholder="Buscar" />
            <button className="caja-button-search">🔍︎</button>
          </div>
        </div>
        <div className="caja-excel">
          <h2 className="caja-excel-heading">
            Movimientos del 27 de enero, 2024
          </h2>
          <div className="caja-excel-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("tipo")}>
                    Movimiento{" "}
                    {orderBy === "tipo" ? orderAsc ? "▲" : "▼" : <span>▼</span>}
                  </th>
                  <th onClick={() => handleSort("importe")}>
                    Importe{" "}
                    {orderBy === "importe" ? (
                      orderAsc ? (
                        "▲"
                      ) : (
                        "▼"
                      )
                    ) : (
                      <span>▼</span>
                    )}
                  </th>
                  <th onClick={() => handleSort("numeroOrden")}>
                    No. de orden{" "}
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
                  <th onClick={() => handleSort("hora")}>
                    Hora{" "}
                    {orderBy === "hora" ? orderAsc ? "▲" : "▼" : <span>▼</span>}
                  </th>
                  <th onClick={() => handleSort("comentarios")}>
                    Comentarios{" "}
                    {orderBy === "comentarios" ? (
                      orderAsc ? (
                        "▲"
                      ) : (
                        "▼"
                      )
                    ) : (
                      <span>▼</span>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "" : "row-even"}>
                    <td>{item.tipo}</td>
                    <td>{item.importe}</td>
                    <td>{item.numeroOrden}</td>
                    <td>{item.hora}</td>
                    <td>{item.comentarios}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="caja-export-button-container">
            <button className="caja-export-button" type="submit">
              <svg
                width="34"
                height="41"
                viewBox="0 0 34 41"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.22266 27.8945C2.15322 31.3676 4.20378 34.4365 7.05632 36.6254C9.90885 38.8142 13.4039 40.0007 16.9995 40.0007C20.595 40.0007 24.0901 38.8142 26.9427 36.6254C29.7952 34.4365 31.8458 31.3676 32.7763 27.8945"
                  stroke="white"
                  stroke-width="2"
                />
                <path
                  d="M16.9983 23.6663L15.54 25.4863L16.9983 26.653L18.4566 25.4863L16.9983 23.6663ZM19.3316 2.66634C19.3316 2.04751 19.0858 1.45401 18.6482 1.01643C18.2106 0.578843 17.6171 0.33301 16.9983 0.33301C16.3795 0.33301 15.786 0.578842 15.3484 1.01643C14.9108 1.45401 14.665 2.0475 14.665 2.66634L19.3316 2.66634ZM3.87329 16.153L15.54 25.4863L18.4566 21.8463L6.78996 12.513L3.87329 16.153ZM18.4566 25.4863L30.1233 16.153L27.2066 12.513L15.54 21.8463L18.4566 25.4863ZM19.3316 23.6663L19.3316 2.66634L14.665 2.66634L14.665 23.6663L19.3316 23.6663Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Caja;
