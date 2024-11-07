import React, { useContext, useState, useEffect } from "react";
import { DataContext } from "../../../hooks/DataContext";  
import "./Caja.css";  

const Caja = () => {
  const { orders, stockCamioneta } = useContext(DataContext);  
  const [orderBy, setOrderBy] = useState(null);
  const [orderAsc, setOrderAsc] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cajaFilter, setCajaFilter] = useState("");  
  const [startDate, setStartDate] = useState("");  
  const [endDate, setEndDate] = useState(""); 
  const [filterName, setFilterName] = useState("");

  // Filtrar stockCamioneta para incluir solo los elementos donde "responsable" no es null
  const filteredStockCamioneta = stockCamioneta.filter(item => item.responsable !== null);

  // Combinar orders con el stockCamioneta filtrado
  const combinedData = [...orders, ...filteredStockCamioneta];
  console.log("combinedData:", combinedData);

  const handleSort = (columnName) => {
    if (orderBy === columnName) {
      setOrderAsc((prevOrderAsc) => !prevOrderAsc);
    } else {
      setOrderBy(columnName);
      setOrderAsc(true);
    }
  };

  const sortedData = orderBy
    ? [...combinedData].sort((a, b) => {
        const valA = a[orderBy];
        const valB = b[orderBy];
        if (orderAsc) return valA < valB ? -1 : valA > valB ? 1 : 0;
        else return valA > valB ? -1 : valA < valB ? 1 : 0;
      })
    : combinedData;

  useEffect(() => {
    if (searchTerm) setFilterName(`Búsqueda: ${searchTerm}`);
    else if (cajaFilter) setFilterName(`Caja: ${cajaFilter}`);
    else if (startDate || endDate) setFilterName(`Rango de Fechas`);
    else setFilterName(""); 
  }, [searchTerm, cajaFilter, startDate, endDate]);

  // Modificar el filtro para que funcione con items sin numero_orden o caja
  const filteredData = sortedData.filter((item) => {
    // Si el elemento tiene "numero_orden", filtra por número de orden y caja
    const matchesOrderNumber = item.numero_orden ? item.numero_orden.toString().includes(searchTerm) : true;
    const matchesCaja = item.caja ? item.caja === cajaFilter : true;

    // Filtrar por rango de fechas en ambos casos
    const matchesDateRange =
      (!startDate || new Date(item.created_at) >= new Date(startDate)) &&
      (!endDate || new Date(item.created_at) <= new Date(endDate));

    // Aplicar los filtros solo donde corresponde
    return matchesOrderNumber && matchesCaja && matchesDateRange;
  });

  const formatDate = (isoString) => new Date(isoString).toLocaleString();

  const getCurrentDate = () => {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('es-ES', options);
  };
 
  return (
    <div className="caja-container">
      <div>
        <div className="caja-heading mb-4">
          <h1>Movimientos de caja</h1>
        </div>
        <div className="caja-input-top">
          <div>
            <h4 className="caja-input-text">Buscar por número de orden</h4>
            <input
              className="caja-input"
              type="text"
              placeholder="Buscar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="caja-button-search">🔍︎</button>
          </div>

          {/* Filtro por caja */}
          <div>
            <h4 className="caja-input-text">Filtrar por Caja</h4>
            <select
              className="caja-input"
              value={cajaFilter}
              onChange={(e) => setCajaFilter(e.target.value)}
            >
              <option value="">Todas</option>
              <option value="Caja1">Caja1</option>
              <option value="Caja2">Caja2</option>
            </select>
          </div>

          <div>
            <h4 className="caja-input-text">Filtrar por rango de fechas</h4>
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

        <div className="caja-excel">
          <h2 className="caja-excel-heading">
            Movimientos al {getCurrentDate()}
          </h2>

          <div className="caja-excel-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("tipo")}>Movimiento {orderBy === "tipo" ? (orderAsc ? "▲" : "▼") : <span>▼</span>}</th>
                  <th onClick={() => handleSort("importe")}>Importe {orderBy === "importe" ? (orderAsc ? "▲" : "▼") : <span>▼</span>}</th>
                  <th onClick={() => handleSort("numero_orden")}>No. de orden {orderBy === "numero_orden" ? (orderAsc ? "▲" : "▼") : <span>▼</span>}</th>
                  <th onClick={() => handleSort("created_at")}>Fecha {orderBy === "created_at" ? (orderAsc ? "▲" : "▼") : <span>▼</span>}</th>
                  <th onClick={() => handleSort("motivo")}>Comentarios {orderBy === "motivo" ? (orderAsc ? "▲" : "▼") : <span>▼</span>}</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "" : "row-even"}>
                    <td>{item.numero_orden ? "Ingreso" : "Egreso"}</td>
                    <td>{item.Presupuesto?.total || item.StockPrincipal?.precio}</td>
                    <td>{item.numero_orden || "-"}</td>
                    <td>{formatDate(item.created_at)}</td>
                    <td className="comentarios-columna">{item.motivo || "-" } </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="caja-export-button-container">
            <button className="caja-export-button" type="submit">
              {/* Icono */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Caja;
