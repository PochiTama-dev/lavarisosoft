import { Suspense, useState, useEffect } from "react";
import "./OpVentas.css";
import PropTypes from "prop-types";
import { listaFacturasVentas } from "../../../../services/facturaVentasService";

const Ventas = () => {
  const [data, setData] = useState([]);
  const [orderBy, setOrderBy] = useState(null);
  const [orderAsc, setOrderAsc] = useState(true);

  useEffect(() => {
    const fetchFacturas = async () => {
      const facturas = await listaFacturasVentas();
      if (facturas) {
        setData(facturas);
      }
    };
    fetchFacturas();
  }, []);

  const mediosPagos = (num) => {
    if (num === 1) return "Echeq";
    else if (num === 2) return "Efectivo en dólares";
    else if (num === 3) return "Efectivo en pesos";
    else if (num === 4) return "Transferencia en dólares";
    else if (num === 5) return "Transferencia en pesos";
  };

  const handleSort = (columnName) => {
    if (orderBy === columnName) {
      setOrderAsc((prevOrderAsc) => !prevOrderAsc);
    } else {
      setOrderBy(columnName);
      setOrderAsc(true);
    }
  };

  const sortedData = orderBy
    ? [...data].sort((a, b) => {
        const valA = a[orderBy];
        const valB = b[orderBy];
        if (valA === undefined || valB === undefined) return 0;
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
                  <th onClick={() => handleSort("created_at")}>
                    Fecha{" "}
                    {orderBy === "created_at" ? (
                      orderAsc ? (
                        "▲"
                      ) : (
                        "▼"
                      )
                    ) : (
                      <span>▼</span>
                    )}
                  </th>
                  <th onClick={() => handleSort("nro_comprobante")}>
                    N° de orden{" "}
                    {orderBy === "nro_comprobante" ? (
                      orderAsc ? (
                        "▲"
                      ) : (
                        "▼"
                      )
                    ) : (
                      <span>▼</span>
                    )}
                  </th>
                  <th onClick={() => handleSort("Cliente.cuil")}>
                    CUIL-Cliente{" "}
                    {orderBy === "Cliente.cuil" ? (
                      orderAsc ? (
                        "▲"
                      ) : (
                        "▼"
                      )
                    ) : (
                      <span>▼</span>
                    )}
                  </th>
                  <th onClick={() => handleSort("efectivo")}>
                    Efectivo{" "}
                    {orderBy === "efectivo" ? (
                      orderAsc ? (
                        "▲"
                      ) : (
                        "▼"
                      )
                    ) : (
                      <span>▼</span>
                    )}
                  </th>{" "}
                  <th onClick={() => handleSort("dolares")}>
                    Dólares{" "}
                    {orderBy === "dolares" ? (
                      orderAsc ? (
                        "▲"
                      ) : (
                        "▼"
                      )
                    ) : (
                      <span>▼</span>
                    )}
                  </th>
                  <th onClick={() => handleSort("transferencia")}>
                    Transferencia{" "}
                    {orderBy === "transferencia" ? (
                      orderAsc ? (
                        "▲"
                      ) : (
                        "▼"
                      )
                    ) : (
                      <span>▼</span>
                    )}
                  </th>
                  <th onClick={() => handleSort("total")}>
                    Monto{" "}
                    {orderBy === "total" ? (
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
                <Suspense fallback={<h1>Cargando...</h1>}>
                  {sortedData &&
                    sortedData.map((item, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "" : "row-even"}
                      >
                        <td>
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>
                        <td>{item.nro_comprobante}</td>
                        <td>{item.cuit_cliente}</td>
                        <td>{item.efectivo}</td>
                        <td>{item.dolares}</td>
                        <td>{item.transferencia}</td>
                        <td>$ {item.total}</td>
                      </tr>
                    ))}
                </Suspense>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

Ventas.propTypes = {
  data: PropTypes.array,
};

export default Ventas;
