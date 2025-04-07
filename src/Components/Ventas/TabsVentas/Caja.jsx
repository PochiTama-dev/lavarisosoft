import   { useContext, useState, useEffect } from "react";
import { DataContext } from "../../../hooks/DataContext";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./Caja.css";
import Header from "../../Header/Header";
const Caja = () => {
  const { cobros, cajas, listaCajas } = useContext(DataContext);
  const [orderBy, setOrderBy] = useState(null);
  const [orderAsc, setOrderAsc] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cajaFilter, setCajaFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterName, setFilterName] = useState("");

  const uniqueCajas = [...new Set(cobros.map(item => item.id_caja))];

  const getCajaName = (id_caja) => {
    const caja = listaCajas.find((caja) => caja.id === id_caja);
    return caja ? caja.denominacion : "Caja Desconocida";
  };

  const filteredData = cobros.filter((item) => {
    const matchesSearchTerm =
      (searchTerm &&
        (item.id_orden.toString().includes(searchTerm) ||
          item.id_repuesto.toString().includes(searchTerm))) ||
      !searchTerm;

    const matchesCaja = cajaFilter ? item.id_caja === parseInt(cajaFilter) : true;

    const matchesDateRange =
      (!startDate || new Date(item.created_at) >= new Date(startDate)) &&
      (!endDate || new Date(item.created_at) <= new Date(endDate));

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
      item.id_orden ? "Ingreso" : "Egreso",
      item.total,
      item.id_orden || "-",
      formatDate(item.created_at),
      item.motivo || "-",
      getCajaName(item.id_caja),
    ]);

    // Añadir título y fecha
    doc.text("Movimientos de Caja", 14, 10);
    doc.text(`Fecha de generación: ${getCurrentDate()}`, 14, 20);

    // Configurar tabla con columnas
    doc.autoTable({
      startY: 30,
      head: [
        ["Movimiento", "Precio", "No. de orden", "Fecha", "Comentarios", "Caja"],
      ],
      body: tableData,
      margin: { top: 30, left: 10, right: 10 },
      styles: { fontSize: 10 },
    });

    doc.save("movimientos_caja.pdf");
  };

  return (
    <div className="caja-container">
         <Header text='Movimientos de caja' />
      <div>
   
        <div className="caja-input-top "  >
          <div style={{marginRight:'20px'}}>
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
          <div        style={{marginRight:'20px'}}>
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
                  <th onClick={() => handleSort("tipo")}>Movimiento {orderBy === "tipo" ? (orderAsc ? "▲" : "▼") : <span>▼</span>}</th>
                  <th onClick={() => handleSort("precio")}>Precio {orderBy === "precio" ? (orderAsc ? "▲" : "▼") : <span>▼</span>}</th>
                  <th onClick={() => handleSort("id_orden")}>No. de orden {orderBy === "id_orden" ? (orderAsc ? "▲" : "▼") : <span>▼</span>}</th>
                  <th onClick={() => handleSort("created_at")}>Fecha {orderBy === "created_at" ? (orderAsc ? "▲" : "▼") : <span>▼</span>}</th>
                  <th onClick={() => handleSort("motivo")}>Comentarios {orderBy === "motivo" ? (orderAsc ? "▲" : "▼") : <span>▼</span>}</th>
                  <th onClick={() => handleSort("caja")}>Caja {orderBy === "caja" ? (orderAsc ? "▲" : "▼") : <span>▼</span>}</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "" : "row-even"}>
                    <td>{item.id_orden ? "Ingreso" : "Egreso"}</td>
                    <td>{item.total}</td>
                    <td>{item.id_orden || "-"}</td>
                    <td>{formatDate(item.created_at)}</td>
                    <td className="comentarios-columna">{item.motivo || "-"}</td>
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
    </div>
        </div>
      </div>
    </div>
  );
};

export default Caja;
