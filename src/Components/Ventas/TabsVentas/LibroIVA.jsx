import { useContext, useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import "./LibroIVA.css";
import dayjs from 'dayjs';
import { DataContext } from "../../../hooks/DataContext";
const LibroIVA = () => {
  const [orderBy, setOrderBy] = useState(null);
  const [orderAsc, setOrderAsc] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { listaCajas } = useContext(DataContext);
  const [selectedCaja, setSelectedCaja] = useState("");
  const [facturasCompra, setFacturasCompra] = useState([]);
  const [facturasVenta, setFacturasVenta] = useState([]);
  const [activeTab, setActiveTab] = useState("proveedores");

  useEffect(() => {
    const fetchFacturasCompra = async () => {
      const response = await fetch("https://lv-back.online/facturasproveedores/lista");
      const data = await response.json();
      setFacturasCompra(data);
    };

    const fetchFacturasVenta = async () => {
      const response = await fetch("https://lv-back.online/facturasventa/lista");
      const data = await response.json();
      setFacturasVenta(data);
    };

    fetchFacturasCompra();
    fetchFacturasVenta();
  }, []);
 const combinedData = [...facturasCompra, ...facturasVenta];
 console.log(combinedData)
  // eslint-disable-next-line no-unused-vars
  const handleSort = (columnName) => {
    if (orderBy === columnName) {
      setOrderAsc((prevOrderAsc) => !prevOrderAsc);
    } else {
      setOrderBy(columnName);
      setOrderAsc(true);
    }
  };

  const filteredData = (data) => data.filter((item) => {
    const itemDate = new Date(item.fecha);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return (!start || itemDate >= start) && (!end || itemDate <= end);
  });

  const sortedData = (data) => orderBy
    ? [...filteredData(data)].sort((a, b) => {
        const valA = a[orderBy];
        const valB = b[orderBy];
        if (orderAsc) {
          return valA < valB ? -1 : valA > valB ? 1 : 0;
        } else {
          return valA > valB ? -1 : valA < valB ? 1 : 0;
        }
      })
    : filteredData(data);

  const exportToPDF = (data, title) => {
    const doc = new jsPDF();
    doc.text(title, 14, 20);

    doc.autoTable({
      startY: 30,
      head: [
        activeTab === "proveedores"
          ? ["Fecha", "Tipo de Comprobante", "Número de Comprobante", "Proveedor", "CUIT Proveedor", "Descripción Bienes o Servicios", "Importe neto gravado", "Alicuota IVA", "IVA crédito fiscal", "Total"]
          : ["Fecha", "Tipo de Comprobante", "Número de Comprobante", "Cliente", "CUIT Cliente", "Descripción Bienes o Servicios", "Importe neto gravado", "Alicuota IVA", "IVA crédito fiscal", "Total"],
      ],
      body: sortedData(data).map((item) => [
        new Date(item.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        item.tipoComprobante,
        item.numeroComprobante,
        activeTab === "proveedores" ? item.proveedor : `${item.Cliente?.nombre || ''} ${item.Cliente?.apellido || ''}`.trim(),
        activeTab === "proveedores" ? item.cuitProveedor : item.cuitCliente,
        item.descripcion,
        item.importeNetoGravado,
        item.alicuotaIVA,
        item.ivaCreditoFiscal,
        item.total,
      ]),
    });

    doc.save(`${title}.pdf`);
  };

  const exportToExcel = (data, title) => {
    const worksheet = XLSX.utils.json_to_sheet(sortedData(data));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title);
    XLSX.writeFile(workbook, `${title}.xlsx`);
  };

  return (
    <div className="libro-container">
      <div className="libro-header-container">
        <div className="libro-header-left">
          <div className="libro-heading">
            <h1>Libro IVA</h1>
          </div>
        </div>
        <div className="libro-header-right">
          <div className="libro-input-container">
            <h3 className="libro-input-text">Filtrar por rango de fechas</h3>
            <input className="libro-input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input className="libro-input" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <button
              className="libro-button-clear"
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
            >
              Limpiar
            </button>
            <select className="libro-select" value={selectedCaja} onChange={(e) => setSelectedCaja(e.target.value)}>
              <option value="">Seleccionar Caja</option>
              {listaCajas.map((caja) => (
                <option key={caja.id} value={caja.id}>
                  {caja.denominacion}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="libro-tabs">
        <button className={`libro-tab ${activeTab === "proveedores" ? "active" : ""}`} onClick={() => setActiveTab("proveedores")}>
          Proveedores
        </button>
        <button className={`libro-tab ${activeTab === "ventas" ? "active" : ""}`} onClick={() => setActiveTab("ventas")}>
          Ventas
        </button>
      </div>
      <div className="libro-excel-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo de Comprobante</th>
              <th>Número de Comprobante</th>
              {activeTab === "proveedores" ? <th>Proveedor</th> : <th>Cliente</th>}
              {activeTab === "proveedores" ? <th>CUIT Proveedor</th> : <th>CUIT Cliente</th>}
              <th>Descripción Bienes o Servicios</th>
              <th>Importe neto gravado</th>
              <th>Alicuota IVA</th>
              <th>IVA crédito fiscal</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {sortedData(activeTab === "proveedores" ? facturasCompra : facturasVenta).map((item, index) => (
          <tr key={index}>
          <td>
            {dayjs(item.created_at).format('DD/MM/YYYY')}
          </td>       
          <td>{activeTab === "proveedores" ? item.comprobante : item.tipo_comprobante} </td>
                       <td>{activeTab === "proveedores" ? item.comprobante : item.nro_comprobante} </td>
                          <td>{activeTab === "proveedores" ? item.Proveedore.nombre : `${item.Cliente?.nombre || ''} ${item.Cliente?.apellido || ''}`.trim()}</td>
                          <td>{activeTab === "proveedores" ? item.Proveedore.cuit : item.cuit_cliente}</td>
                          <td>{item.descripcion}</td>
                          <td>{activeTab === "proveedores" ? item.importe : item.importe} </td>
                          <td>{activeTab === "proveedores" ? item.iva_alicuota : item.iva_alicuota}% </td>
          
                          <td>${activeTab === "proveedores" ? item.iva_alicuota : (item.importe * (item.iva_alicuota /100))} </td>
                          <td>${activeTab === "proveedores" ? item.importe : item.total} </td>
                        </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="libro-export-button-container">
        <button onClick={() => exportToPDF(activeTab === "proveedores" ? facturasCompra : facturasVenta, activeTab === "proveedores" ? "Libro IVA Proveedores" : "Libro IVA Ventas")} className="libro-export-button">
          Exportar a PDF
        </button>
        <button onClick={() => exportToExcel(activeTab === "proveedores" ? facturasCompra : facturasVenta, activeTab === "proveedores" ? "Libro IVA Proveedores" : "Libro IVA Ventas")} className="libro-export-button">
          Exportar a Excel
        </button>
      </div>
    </div>
  );
};

export default LibroIVA;
