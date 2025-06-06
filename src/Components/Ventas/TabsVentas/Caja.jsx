import { useContext, useState, useEffect } from "react";
import { DataContext } from "../../../hooks/DataContext";
import { listaFacturasVentas } from "../../../services/facturaVentasService";
import { listaFacturasCompras } from "../../../services/facturaComprasService";
import { obtenerGastos } from "../../../services/gastoDeclaradoService";
import { obtenerLiquidaciones } from "../../../services/liquidacionesService";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx"; // Import the xlsx library
import "./Caja.css";
import Header from "../../Header/Header";

const convertirFecha = (fecha) => {
  if (!fecha) return null;
  const [dia, mes, anio] = fecha.split("/");
  return `${anio}-${mes}-${dia}`;
};

const Caja = () => {
  const { listaCajas } = useContext(DataContext);
  const [orderBy, setOrderBy] = useState("created_at");
  const [orderAsc, setOrderAsc] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cajaFilter, setCajaFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [filterName, setFilterName] = useState("");
  const [movimientos, setMovimientos] = useState([]);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [facturasVentas, facturasCompras, gastos, liquidaciones] = await Promise.all([
          listaFacturasVentas(),
          listaFacturasCompras(),
          obtenerGastos(),
          obtenerLiquidaciones(),
        ]);
        console.log(liquidaciones)
        const combinedData = [
          ...facturasVentas.map((item) => ({
            ...item,
            tipoMovimiento: "Ingreso",
            motivo: item.descripcion || "-",
            fecha: item.created_at,
          })),
          ...facturasCompras.map((item) => ({
            ...item,
            tipoMovimiento: "Egreso",
            motivo: item.descripcion || "-",
            fecha: item.created_at,
          })),
          ...gastos.map((item) => ({
            ...item,
            tipoMovimiento: "Egreso",
            motivo: item.motivo || "-",
            fecha: convertirFecha(item.fecha_ingreso),
          })),
          ...liquidaciones.map((item) => ({
            ...item,
            tipoMovimiento: "Liquidación",
            total: item.monto,
            motivo: `Liq: ${item.Empleado?.nombre}`,
            fecha: item.created_at,
          })),
        ];

        setMovimientos(combinedData);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  const getCajaName = (id_caja) => {
    const caja = listaCajas.find((caja) => caja.id === id_caja);
    return caja ? caja.denominacion : "Caja Desconocida";
  };

  const filteredData = movimientos.filter((item) => {
    const matchesSearchTerm = searchTerm
      ? item.nro_comprobante?.toString().includes(searchTerm)
      : true;

    const matchesCaja = cajaFilter
      ? item.id_caja === parseInt(cajaFilter)
      : true;

    const matchesDateRange =
      (!startDate || new Date(item.fecha) >= new Date(startDate)) &&
      (!endDate || new Date(item.fecha) <= new Date(endDate));

    return matchesSearchTerm && matchesCaja && matchesDateRange;
  });

  const sortedData = orderBy
    ? [...filteredData].sort((a, b) => {
        const valA = a[orderBy];
        const valB = b[orderBy];
        if (orderAsc) return valA < valB ? -1 : valA > valB ? 1 : 0;
        else return valA > valB ? -1 : valA < valB ? 1 : 0;
      })
    : filteredData;

  useEffect(() => {
    if (searchTerm) setFilterName(`Búsqueda: ${searchTerm}`);
    else if (cajaFilter) setFilterName(`Caja: ${getCajaName(cajaFilter)}`);
    else if (startDate || endDate) setFilterName(`Rango de Fechas`);
    else setFilterName("");
  }, [searchTerm, cajaFilter, startDate, endDate]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("es-ES");
  };

  const getCurrentDate = () => {
    const today = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    return today.toLocaleDateString("es-ES", options);
  };

  const handleSort = (column) => {
    if (orderBy === column) {
      setOrderAsc(!orderAsc);
    } else {
      setOrderBy(column);
      setOrderAsc(true);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableData = sortedData.map((item) => [
      item.tipoMovimiento,
      item.total,
      item.id_orden || "-",
      formatDate(item.created_at),
      item.motivo || "-",
      getCajaName(item.id_caja),
    ]);

    doc.text("Movimientos de Caja", 14, 10);
    doc.text(`Fecha de generación: ${getCurrentDate()}`, 14, 20);

    doc.autoTable({
      startY: 30,
      head: [
        [
          "Movimiento",
          "Fecha",
          "Efectivo",
          "Transferencia",
          "Dolares",
          // "No. de orden",
          "Comentarios",
          "Caja",
        ],
      ],
      body: tableData,
      margin: { top: 30, left: 10, right: 10 },
      styles: { fontSize: 10 },
    });

    doc.save("movimientos_caja.pdf");
  };

  const exportToExcel = () => {
    const worksheetData = sortedData.map((item) => ({
      Tipo: item.tipoMovimiento,
      Fecha: formatDate(item.fecha),
      Descripción: item.motivo || "-",
      Efectivo: item.efectivo == 0 ? "-" : `$${item.efectivo}`,
      Transferencia: item.transferencia == 0 ? "-" : `$${item.transferencia}`,
      Dólares: item.dolares == 0 ? "-" : `US$${item.dolares}`,
      Pagado: item.monto_pagado ? `$${item.monto_pagado}` : "-",
      Total: `$${item.total}`,
      Caja: getCajaName(item.id_caja),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Movimientos de Caja");
    XLSX.writeFile(workbook, "movimientos_caja.xlsx");
  };

  return (
    <div className="caja-container">
      <Header text="Movimientos de caja" />
      <div>
        <div className="caja-input-top ">
          <div style={{ marginRight: "20px" }}>
            <h4 className="caja-input-text">Número de orden</h4>
            <input
              className="caja-input"
              type="text"
              placeholder="Buscar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtro por caja */}
          <div style={{ marginRight: "20px" }}>
            <h4 className="caja-input-text">Filtrar por Caja</h4>
            <select
              className="caja-input"
              value={cajaFilter}
              onChange={(e) => setCajaFilter(e.target.value)}
            >
              <option value="">Todas</option>
              {listaCajas.map((caja) => (
                <option key={caja.id} value={caja.id}>
                  {caja.denominacion}
                </option>
              ))}
            </select>
          </div>
          <div>
            <h4 className="caja-input-text">Filtrar por rango de fechas</h4>
            <div className="date-range-container">
              <input
                className="caja-input"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                className="caja-input"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="caja-excel">
          <h2 className="caja-excel-heading">
            Movimientos al {getCurrentDate()}
          </h2>

          <div className="caja-excel-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("tipoMovimiento")}>
                    Tipo
                    {orderBy === "tipoMovimiento" ? (
                      orderAsc ? (
                        "▲"
                      ) : (
                        "▼"
                      )
                    ) : (
                      <span>▼</span>
                    )}
                  </th>

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
                  <th onClick={() => handleSort("motivo")}>
                    Descripción
                    {orderBy === "motivo" ? (
                      orderAsc ? (
                        "▲"
                      ) : (
                        "▼"
                      )
                    ) : (
                      <span>▼</span>
                    )}
                  </th>
            
                  <th>
                    Efectivo
                  </th>
                  <th>
                    Transferencia
                  </th>
                  <th>
                    Dólares
                  </th>
                  <th onClick={() => handleSort("total")}>
                    Pagado
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
                         <th onClick={() => handleSort("total")}>
                    Total
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
            
                  <th onClick={() => handleSort("id_caja")}>
                    Caja{" "}
                    {orderBy === "id_caja" ? (
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
                    <td>{item.tipoMovimiento}</td>
                    <td>{formatDate(item.fecha)}</td>
                    <td className="comentarios-columna">
                      {item.motivo || "-"}
                    </td>
                    <td>{item.efectivo == 0 ? "-" : `$${item.efectivo}`}</td>
                    <td>{item.transferencia == 0 ? "-" : `$${item.transferencia}`}</td>
                    <td>{item.dolares == 0 ? "-" : `US$${item.dolares}`}</td>
                    <td style={{ color: item.monto_pagado ? "red" : "black" }}>
                      {item.monto_pagado ? `$${item.monto_pagado}` : "-"}
                    </td>                   
                    <td style={{color:'green'}}> ${item.total}</td>
                    <td>{getCajaName(item.id_caja)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="caja-export-button-container">
            <button className="caja-export-button" onClick={exportToPDF}>
              Exportar a PDF
            </button>
            <button className="caja-export-button" onClick={exportToExcel}>
              Exportar a Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Caja;
