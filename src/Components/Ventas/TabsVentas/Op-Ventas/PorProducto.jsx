import React, { useState } from "react";

const PorProducto = () => {
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

  const data = [
    {
      descripcion: "Fuelle lineal",
      id: 55623,
      tecnico: "TC-16554",
      cliente: "C-1855",
      precio: "$70000",
      cantidad: 3,
      fecha: "2023-10-15",
    },
    {
      descripcion: "Otro producto",
      id: 12345,
      tecnico: "TC-98765",
      cliente: "C-5432",
      precio: "$50000",
      cantidad: 2,
      fecha: "2023-10-10",
    },
    {
      descripcion: "No se ",
      id: 12344,
      tecnico: "TC-98765",
      cliente: "C-5438",
      precio: "$40000",
      cantidad: 5,
      fecha: "2023-09-25",
    },
    {
      descripcion: "Coso ",
      id: 12341,
      tecnico: "TC-9875",
      cliente: "C-5439",
      precio: "$0.5",
      cantidad: 10,
      fecha: "2023-09-20",
    },
    {
      descripcion: "Fuelle lineal",
      id: 55623,
      tecnico: "TC-16554",
      cliente: "C-1855",
      precio: "$70000",
      cantidad: 3,
      fecha: "2023-10-15",
    },
    {
      descripcion: "Otro producto",
      id: 12345,
      tecnico: "TC-98765",
      cliente: "C-5432",
      precio: "$50000",
      cantidad: 2,
      fecha: "2023-10-10",
    },
    {
      descripcion: "No se ",
      id: 12344,
      tecnico: "TC-98765",
      cliente: "C-5438",
      precio: "$40000",
      cantidad: 5,
      fecha: "2023-09-25",
    },
    {
      descripcion: "Coso ",
      id: 12341,
      tecnico: "TC-9875",
      cliente: "C-5439",
      precio: "$0.5",
      cantidad: 10,
      fecha: "2023-09-20",
    },
    {
      descripcion: "Fuelle lineal",
      id: 55623,
      tecnico: "TC-16554",
      cliente: "C-1855",
      precio: "$70000",
      cantidad: 3,
      fecha: "2023-10-15",
    },
    {
      descripcion: "Otro producto",
      id: 12345,
      tecnico: "TC-98765",
      cliente: "C-5432",
      precio: "$50000",
      cantidad: 2,
      fecha: "2023-10-10",
    },
    {
      descripcion: "No se ",
      id: 12344,
      tecnico: "TC-98765",
      cliente: "C-5438",
      precio: "$40000",
      cantidad: 5,
      fecha: "2023-09-25",
    },
    {
      descripcion: "Coso ",
      id: 12341,
      tecnico: "TC-9875",
      cliente: "C-5439",
      precio: "$0.5",
      cantidad: 10,
      fecha: "2023-09-20",
    },
    {
      descripcion: "Fuelle lineal",
      id: 55623,
      tecnico: "TC-16554",
      cliente: "C-1855",
      precio: "$70000",
      cantidad: 3,
      fecha: "2023-10-15",
    },
    {
      descripcion: "Otro producto",
      id: 12345,
      tecnico: "TC-98765",
      cliente: "C-5432",
      precio: "$50000",
      cantidad: 2,
      fecha: "2023-10-10",
    },
    {
      descripcion: "No se ",
      id: 12344,
      tecnico: "TC-98765",
      cliente: "C-5438",
      precio: "$40000",
      cantidad: 5,
      fecha: "2023-09-25",
    },
    {
      descripcion: "Coso ",
      id: 12341,
      tecnico: "TC-9875",
      cliente: "C-5439",
      precio: "$0.5",
      cantidad: 10,
      fecha: "2023-09-20",
    },
    {
      descripcion: "Fuelle lineal",
      id: 55623,
      tecnico: "TC-16554",
      cliente: "C-1855",
      precio: "$70000",
      cantidad: 3,
      fecha: "2023-10-15",
    },
    {
      descripcion: "Otro producto",
      id: 12345,
      tecnico: "TC-98765",
      cliente: "C-5432",
      precio: "$50000",
      cantidad: 2,
      fecha: "2023-10-10",
    },
    {
      descripcion: "No se ",
      id: 12344,
      tecnico: "TC-98765",
      cliente: "C-5438",
      precio: "$40000",
      cantidad: 5,
      fecha: "2023-09-25",
    },
    {
      descripcion: "Coso ",
      id: 12341,
      tecnico: "TC-9875",
      cliente: "C-5439",
      precio: "$0.5",
      cantidad: 10,
      fecha: "2023-09-20",
    },
    {
      descripcion: "Fuelle lineal",
      id: 55623,
      tecnico: "TC-16554",
      cliente: "C-1855",
      precio: "$70000",
      cantidad: 3,
      fecha: "2023-10-15",
    },
    {
      descripcion: "Otro producto",
      id: 12345,
      tecnico: "TC-98765",
      cliente: "C-5432",
      precio: "$50000",
      cantidad: 2,
      fecha: "2023-10-10",
    },
    {
      descripcion: "No se ",
      id: 12344,
      tecnico: "TC-98765",
      cliente: "C-5438",
      precio: "$40000",
      cantidad: 5,
      fecha: "2023-09-25",
    },
    {
      descripcion: "Coso ",
      id: 12341,
      tecnico: "TC-9875",
      cliente: "C-5439",
      precio: "$0.5",
      cantidad: 10,
      fecha: "2023-09-20",
    },
    {
      descripcion: "Fuelle lineal",
      id: 55623,
      tecnico: "TC-16554",
      cliente: "C-1855",
      precio: "$70000",
      cantidad: 3,
      fecha: "2023-10-15",
    },
    {
      descripcion: "Otro producto",
      id: 12345,
      tecnico: "TC-98765",
      cliente: "C-5432",
      precio: "$50000",
      cantidad: 2,
      fecha: "2023-10-10",
    },
    {
      descripcion: "No se ",
      id: 12344,
      tecnico: "TC-98765",
      cliente: "C-5438",
      precio: "$40000",
      cantidad: 5,
      fecha: "2023-09-25",
    },
    {
      descripcion: "Coso ",
      id: 12341,
      tecnico: "TC-9875",
      cliente: "C-5439",
      precio: "$0.5",
      cantidad: 10,
      fecha: "2023-09-20",
    },
    {
      descripcion: "Fuelle lineal",
      id: 55623,
      tecnico: "TC-16554",
      cliente: "C-1855",
      precio: "$70000",
      cantidad: 3,
      fecha: "2023-10-15",
    },
    {
      descripcion: "Otro producto",
      id: 12345,
      tecnico: "TC-98765",
      cliente: "C-5432",
      precio: "$50000",
      cantidad: 2,
      fecha: "2023-10-10",
    },
    {
      descripcion: "No se ",
      id: 12344,
      tecnico: "TC-98765",
      cliente: "C-5438",
      precio: "$40000",
      cantidad: 5,
      fecha: "2023-09-25",
    },
    {
      descripcion: "Coso ",
      id: 12341,
      tecnico: "TC-9875",
      cliente: "C-5439",
      precio: "$0.5",
      cantidad: 10,
      fecha: "2023-09-20",
    },
    {
      descripcion: "Fuelle lineal",
      id: 55623,
      tecnico: "TC-16554",
      cliente: "C-1855",
      precio: "$70000",
      cantidad: 3,
      fecha: "2023-10-15",
    },
    {
      descripcion: "Otro producto",
      id: 12345,
      tecnico: "TC-98765",
      cliente: "C-5432",
      precio: "$50000",
      cantidad: 2,
      fecha: "2023-10-10",
    },
    {
      descripcion: "No se ",
      id: 12344,
      tecnico: "TC-98765",
      cliente: "C-5438",
      precio: "$40000",
      cantidad: 5,
      fecha: "2023-09-25",
    },
    {
      descripcion: "Coso ",
      id: 12341,
      tecnico: "TC-9875",
      cliente: "C-5439",
      precio: "$0.5",
      cantidad: 10,
      fecha: "2023-09-20",
    },
  ];

  const sortedData = orderBy
    ? [...data].sort((a, b) => {
        const valA = a[orderBy];
        const valB = b[orderBy];
        if (orderAsc) {
          return valA < valB ? -1 : valA > valB ? 1 : 0;
        } else {
          return valA > valB ? -1 : valA < valB ? 1 : 0;
        }
      })
    : data;

  return (
    <div className="opventas-tab-container">
      <div>
        <div className="opventas-excel">
          <div className="opventas-excel-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("fecha")}>
                    Fecha{" "}
                    {orderBy === "fecha" ? (
                      orderAsc ? (
                        "▲"
                      ) : (
                        "▼"
                      )
                    ) : (
                      <span>▼</span>
                    )}
                  </th>
                  <th onClick={() => handleSort("descripcion")}>
                    Descripción{" "}
                    {orderBy === "descripcion" ? (
                      orderAsc ? (
                        "▲"
                      ) : (
                        "▼"
                      )
                    ) : (
                      <span>▼</span>
                    )}
                  </th>
                  <th onClick={() => handleSort("id")}>
                    ID{" "}
                    {orderBy === "id" ? orderAsc ? "▲" : "▼" : <span>▼</span>}
                  </th>
                  <th onClick={() => handleSort("tecnico")}>
                    Técnico{" "}
                    {orderBy === "tecnico" ? (
                      orderAsc ? (
                        "▲"
                      ) : (
                        "▼"
                      )
                    ) : (
                      <span>▼</span>
                    )}
                  </th>
                  <th onClick={() => handleSort("cliente")}>
                    Cliente{" "}
                    {orderBy === "cliente" ? (
                      orderAsc ? (
                        "▲"
                      ) : (
                        "▼"
                      )
                    ) : (
                      <span>▼</span>
                    )}
                  </th>
                  <th onClick={() => handleSort("precio")}>
                    Precio{" "}
                    {orderBy === "precio" ? (
                      orderAsc ? (
                        "▲"
                      ) : (
                        "▼"
                      )
                    ) : (
                      <span>▼</span>
                    )}
                  </th>
                  <th onClick={() => handleSort("cantidad")}>
                    Cantidad{" "}
                    {orderBy === "cantidad" ? (
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
                    <td>{item.fecha}</td>
                    <td>{item.descripcion}</td>
                    <td>{item.id}</td>
                    <td>{item.tecnico}</td>
                    <td>{item.cliente}</td>
                    <td>{item.precio}</td>
                    <td>{item.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="opventas-export-button-container">
            <button className="opventas-export-button" type="submit">
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

export default PorProducto;
