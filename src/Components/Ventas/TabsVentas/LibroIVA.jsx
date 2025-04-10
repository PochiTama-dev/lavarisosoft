import { useContext, useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import "./LibroIVA.css";
import dayjs from 'dayjs';
import { DataContext } from "../../../hooks/DataContext";
import Header from "../../Header/Header";
import Tabs2 from "../../Tabs/Tabs2";

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
console.log("FACTURAS", facturasVenta)
  console.log("CAJAS", listaCajas)
  useEffect(() => {
    const fetchFacturasCompra = async () => {
      const response = await fetch("https://lv-back.online/facturascompra/lista");
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

  const filteredData = (data) => {
    return data.filter((item) => {
      const itemDate = new Date(item.created_at); 
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      const matchesCaja = selectedCaja ? item.id_caja === parseInt(selectedCaja) : true;

      return matchesCaja && (!start || itemDate >= start) && (!end || itemDate <= end);
    });
  };

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
      <Header text="Libro IVA" />
      <div className="libro-header-container">
     
        <div className="libro-header-center">
          <div className="libro-input-container">
            <h3 className="libro-input-text">Filtrar por fechas</h3>
            <input
              className="libro-input"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              className="libro-input"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button
              className="libro-button-clear"
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
            >
              Limpiar
            </button>
            <select
              className="libro-select"
              value={selectedCaja}
              onChange={(e) => setSelectedCaja(e.target.value)}
            >
              <option value="">Todas las cajas</option>
              {listaCajas.map((caja) => (
                <option key={caja.id} value={caja.id}>
                  {caja.denominacion}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <Tabs2 active={activeTab === "proveedores" ? 0 : 1} onChange={(index) => setActiveTab(index === 0 ? "proveedores" : "ventas")}>
        <div title="Proveedores">
          <div className="libro-excel-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo de Comprobante</th>
                  <th>Número de Comprobante</th>
                  <th>Proveedor</th>
                  <th>CUIT Proveedor</th>
                  <th>Descripción Bienes o Servicios</th>
                  <th>Importe neto gravado</th>
                  <th>Alicuota IVA</th>
                  <th>IVA crédito fiscal</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {sortedData(facturasCompra).map((item, index) => (
                  <tr key={index}>
                    <td>{dayjs(item.created_at).format("DD/MM/YYYY")}</td>
                    <td>{item.tipo_comprobante}</td>
                    <td>{item.nro_comprobante}</td>
                    <td>{item.Proveedore.nombre}</td>
                    <td>{item.Proveedore.cuit}</td>
                    <td>{item.descripcion}</td>
                    <td>${item.importe}</td>
                    <td>${item.iva_alicuota}</td>
                    <td>${item.iva_cred_fiscal}</td>
                    <td>${item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div title="Ventas">
          <div className="libro-excel-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo de Comprobante</th>
                  <th>Número de Comprobante</th>
                  <th>Cliente</th>
                  <th>CUIT Cliente</th>
                  <th>Descripción Bienes o Servicios</th>
                  <th>Importe neto gravado</th>
                  <th>Alicuota IVA</th>
                  <th>IVA crédito fiscal</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {sortedData(facturasVenta).map((item, index) => (
                  <tr key={index}>
                    <td>{dayjs(item.created_at).format("DD/MM/YYYY")}</td>
                    <td>{item.tipo_comprobante}</td>
                    <td>{item.nro_comprobante}</td>
                    <td>{`${item.Cliente?.nombre || ""} ${item.Cliente?.apellido || ""}`.trim()}</td>
                    <td>{item.cuit_cliente}</td>
                    <td>{item.descripcion}</td>
                    <td>{item.importe}</td>
                    <td>{item.iva_alicuota}%</td>
                    <td>${item.importe * (item.iva_alicuota / 100)}</td>
                    <td>${item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Tabs2>
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
