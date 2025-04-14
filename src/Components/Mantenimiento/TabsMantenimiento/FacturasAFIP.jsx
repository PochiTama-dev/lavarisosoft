import { useEffect, useState } from "react";
import { listaFacturasVentas } from "../../../services/facturaVentasService";
import jsPDF from "jspdf";
import logo from "../../../assets/logo-service.png";
import Table from "react-bootstrap/Table";
/* import { useNavigate } from "react-router-dom"; */
import eye from "../../../assets/eye.svg";
import Pagination from "react-bootstrap/Pagination";

const FacturasAFIP = () => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remito, setRemito] = useState({});
  const [modal, setModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
/*   const navigate = useNavigate(); */
console.log("FAC", facturas)
  const mediosPagos = (num) => {
    if (num === 1) return "Echeq";
    else if (num === 2) return "Efectivo en dólares";
    else if (num === 3) return "Efectivo en pesos";
    else if (num === 4) return "Transferencia en dólares";
    else if (num === 5) return "Transferencia en pesos";
  };

  const fetchOrdenesGenerales = async () => {
    try {
      const ordenesResponse = await fetch('https://lv-back.online/ordenes');
      if (!ordenesResponse.ok) {
        throw new Error('Error al obtener datos de las APIs');
      }
      return await ordenesResponse.json();
    } catch (error) {
      console.error('Error al obtener datos:', error);
      throw error;
    }
  };

  const handleRemito = async (factura) => {
    try {
      const ordenes = await fetchOrdenesGenerales();
      const orden = ordenes.find((o) => o.id === factura.nro_comprobante || o.id === factura.id);

      const remito = {
        codigo_imputacion: factura?.codigo_imputacion,
        fecha: new Date(factura.created_at).toLocaleDateString(),
        cuil: factura.Cliente?.cuil,
        descripcion: factura.descripcion,
        dolares: factura.dolares,
        efectivo: factura.efectivo,
        transferencia: factura.transferencia,
        total: factura.total,
        nombreCliente: `${factura.Cliente?.nombre} ${factura.Cliente?.apellido}`,
        medio_pago: mediosPagos(factura.Presupuesto?.id_medio_de_pago),
        equipo: orden?.equipo || "-",
        marca: orden?.marca || "-",
        modelo: orden?.modelo || "-",
        diagnostico: orden?.diagnostico || "-",
        motivo: orden?.motivo || "-",
        otrasReparaciones: orden?.otrasReparaciones || "-",
      };

      setRemito(remito);
      setModal(!modal);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const handleExportToPDF = () => {
    const doc = new jsPDF();
    let posY = 10;
    const pageWidth = doc.internal.pageSize.getWidth();

    if (logo) {
      doc.addImage(logo, "PNG", 40, posY, 40, 40);
    }

    doc.setFontSize(14);
    const infoPosX = 85;
    doc.text("Juan Garcia Martinez 65 local 3", infoPosX, posY + 10);
    doc.text("CUIL/CUIT: 30-71794576-6", infoPosX, posY + 20);
    doc.text("www.gruposervice.ar", infoPosX, posY + 30);
    doc.text("TEL: 351-7061881", infoPosX, posY + 40);

    posY += 50;
    doc.setDrawColor(142, 163, 191);
    doc.setLineWidth(0.5);
    doc.line(10, posY, pageWidth - 10, posY);
    posY += 10;

    doc.setFontSize(18);
    doc.text(`Remito orden`, 10, posY);
    posY += 10;

    doc.setFontSize(12);
    doc.text(`Fecha: ${remito.fecha}`, 10, posY);
    doc.text(`Cliente: ${remito.nombreCliente || "-"}`, 10, posY + 10);
    doc.text(`CUIT/CUIL: ${remito.cuil || "-"}`, pageWidth / 2, posY + 10);
    posY += 20;

    // Add additional details to the PDF
    doc.setFontSize(14);
    doc.text("Detalles del Equipo:", 10, posY);
    posY += 10;
    doc.setFontSize(12);
    doc.text(`Equipo: ${remito.equipo || "-"}`, 10, posY);
    posY += 10;
    doc.text(`Marca: ${remito.marca || "-"}`, 10, posY);
    posY += 10;
    doc.text(`Modelo: ${remito.modelo || "-"}`, 10, posY);
    posY += 10;
    doc.text(`Diagnóstico: ${remito.diagnostico || "-"}`, 10, posY);
    posY += 10;
    doc.text(`Motivo: ${remito.motivo || "-"}`, 10, posY);
    posY += 10;
    doc.text(`Otras Reparaciones: ${remito.otrasReparaciones || "-"}`, 10, posY);
    posY += 20;

    // Add payment methods and total after equipment details
    doc.setFontSize(14);
    doc.text("Medios de Pago:", 10, posY);
    posY += 10;
    doc.setFontSize(12);

    if (remito.efectivo > 0) {
      doc.text(`Efectivo: $${remito.efectivo}`, 10, posY);
      posY += 10;
    }
    if (remito.dolares > 0) {
      doc.text(`Dólares: $${remito.dolares}`, 10, posY);
      posY += 10;
    }
    if (remito.transferencia > 0) {
      doc.text(`Transferencia: $${remito.transferencia}`, 10, posY);
      posY += 10;
    }
    posY += 10;

    doc.setFontSize(14);
    doc.text(`Total: $${remito.total || "0.00"}`, 10, posY);

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  };

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const [facturas] = await Promise.all([listaFacturasVentas()]);

        const facturasFiltradas = [...facturas].filter(
          (factura) => factura?.id_caja === 7
        );

        setFacturas(facturasFiltradas);
      } catch (err) {
        console.error("Error fetching facturas data:", err);
        setError("Hubo un problema al cargar las facturas.");
      } finally {
        setLoading(false);
      }
    };

    fetchFacturas();
  }, []);

/*   const verFactura = (factura) => {
    navigate("/facturasremito", { state: { factura } });
  }; */

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFacturas = facturas.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(facturas.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div className="facturas-ctn">Cargando facturas...</div>;
  }

  if (error) {
    return <div className="facturas-ctn">{error}</div>;
  }

  return (
    <div className="facturas-ctn">
      <Table striped hover>
        <thead>
          <tr>
          <th>Operación</th>
            <th>Fecha</th>
            <th>N° de orden</th>
            <th>Cliente</th>
      {/*       <th>CUIT/CUIL/CDI</th> */}
            <th>Efectivo</th>
            <th>Dólares</th>
            <th>Transferencia</th>
            <th>Monto</th>
            <th>Factura</th>
          </tr>
        </thead>
        <tbody>
          {currentFacturas?.map((factura, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "row-even" : "row-white"}
            >
              <td>{factura.descripcion}</td>
              <td>
                {factura.fecha_ingreso || factura.created_at.slice(0, 10)}
              </td>
              <td>#{factura.nro_comprobante || factura.id}</td>
              <td>
                {factura.Cliente
                  ? factura.Cliente.nombre + " " + factura.Cliente?.apellido
                  : " "}
              </td>
     {/*          <td>{factura.Cliente?.cuil}</td> */}
              <td>{factura.efectivo > 0 ? `$ ${factura.efectivo}` : "-"}</td>
              <td>{factura.dolares > 0 ? `US$ ${factura.dolares}` : "-"}</td>
              <td>
                {factura.transferencia > 0 ? `$ ${factura.transferencia}` : "-"}
              </td>
              <td>${factura.total}</td>
              <td>
                <img
                  src={eye}
                  alt="Ver factura"
                  style={{
                    width: "32px",
                    height: "32px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleRemito(factura)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="pagination-container">
        <Pagination>
          {[...Array(totalPages).keys()].map((page) => (
            <Pagination.Item
              key={page + 1}
              active={page + 1 === currentPage}
              onClick={() => handlePageChange(page + 1)}
            >
              {page + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
           {modal && (
        <div className="remito-modal" style={{zIndex: 1000}}>
          <h4 
            onClick={() => setModal(!modal)} 
            style={{
              position: "absolute",
              top: "20px",
              right: "30px",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            X
          </h4>
          <div className="remito-content">
            <h2>Remito</h2>
            <p>Fecha: {remito.fecha}</p>
            <p>Cliente: {remito.nombreCliente}</p>
            <p>CUIT/CUIL: {remito.cuil}</p>
            <p>Equipo: {remito.equipo}</p>
            <p>Marca: {remito.marca}</p>
           {/*  <p>Modelo: {remito.modelo}</p>
            <p>Diagnóstico: {remito.diagnostico}</p>
            <p>Motivo: {remito.motivo}</p>
            <p>Otras Reparaciones: {remito.otrasReparaciones}</p> */}
            <p>Efectivo: {remito.efectivo}</p>
            <p>Dólares: {remito.dolares}</p>
            <p>Transferencia: {remito.transferencia}</p>
            <p>Total: {remito.total}</p>
            <button onClick={handleExportToPDF}>Imprimir</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacturasAFIP;
