import { Suspense, useState, useEffect } from 'react';
import './OpVentas.css';
import PropTypes from 'prop-types';
import { listaFacturasVentas } from '../../../../services/facturaVentasService';
import eye from '../../../../assets/eye.svg';
import jsPDF from 'jspdf';
import logo from '../../../../assets/logo-service.png';

const PorTecnico = () => {
  const [data, setData] = useState([]);
  const [orderBy, setOrderBy] = useState(null);
  const [orderAsc, setOrderAsc] = useState(true);
  const [remito, setRemito] = useState({});
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const fetchFacturas = async () => {
      const facturas = await listaFacturasVentas();
      if (facturas) {
        // Filter to include only sales with id_tecnico
        const filteredFacturas = facturas.filter((item) => item.id_tecnico);
        setData(filteredFacturas);
      }
    };
    fetchFacturas();
  }, []);
console.log("data",data);
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

  const handleRemito = (item) => {
    const remito = {
      fecha: new Date(item.created_at).toLocaleDateString(),
      id_tecnico: item.id_tecnico,
      nombreEmpleado: `${item.Empleado?.nombre} ${item.Empleado?.apellido}`,
      legajo: item.Empleado?.legajo,
      nro_comprobante: item.nro_comprobante,
      tipo_comprobante: item.tipo_comprobante,
      tipo_factura: item.tipo_factura,
      efectivo: item.efectivo,
      dolares: item.dolares,
      transferencia: item.transferencia,
      total: item.total,
    };
    setRemito(remito);
    setModal(!modal);
  };

  const handleExportToPDF = () => {
    const doc = new jsPDF();
    let posY = 10;
    const pageWidth = doc.internal.pageSize.getWidth();

    if (logo) {
      doc.addImage(logo, 'PNG', 40, posY, 40, 40);
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
    doc.text(`Remito Ventas y Servicios No.#${remito.nro_comprobante}`, 10, posY);
    posY += 10;

    doc.setFontSize(12);
    doc.text(`Fecha: ${remito.fecha}`, 10, posY);
    doc.text(`Técnico: ${remito.nombreEmpleado || '-'}`, 10, posY + 10);
    doc.text(`Legajo: ${remito.legajo || '-'}`, pageWidth / 2, posY + 10);
    posY += 20;
    doc.text(`Tipo de comprobante: ${remito.tipo_comprobante || '-'}`, 10, posY);
    doc.text(`Tipo de factura: ${remito.tipo_factura || '-'}`, pageWidth / 2, posY);
    posY += 20;

    
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
    doc.text(`Total: $${remito.total || '0.00'}`, 10, posY);

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  };

 
  return (
    <div className='opventas-tab-container'>
      <div>
        <div className='opventas-excel'>
          <div className='opventas-excel-wrapper'>
            <table className='table'>
              <thead>
                <tr>
                  <th onClick={() => handleSort('created_at')}>Fecha {orderBy === 'created_at' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}</th>
                  <th onClick={() => handleSort('id_tecnico')}>Técnico {orderBy === 'id_tecnico' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}</th>
                  <th onClick={() => handleSort('codigo_imputacion')}>Cod. Imp. {orderBy === 'codigo_imputacion' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}</th>
                  <th onClick={() => handleSort('descripcion')}>Descripcion {orderBy === 'descripcion' ? orderAsc ? '▲' : '▼' : <span>▼</span>}</th>

                  <th onClick={() => handleSort('tipo_comprobante')}>Tipo Comprobante {orderBy === 'tipo_comprobante' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}</th>
                   <th onClick={() => handleSort('efectivo')}>Efectivo {orderBy === 'efectivo' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}</th>
                  <th onClick={() => handleSort('dolares')}>Dólares {orderBy === 'dolares' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}</th>
                  <th onClick={() => handleSort('transferencia')}>Transferencia {orderBy === 'transferencia' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}</th>
                  <th onClick={() => handleSort('total')}>Monto {orderBy === 'total' ? (orderAsc ? '▲' : '▼') : <span>▼</span>}</th>
                </tr>
              </thead>
              <tbody>
                <Suspense fallback={<h1>Cargando...</h1>}>
                  {sortedData &&
                    sortedData.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? '' : 'row-even'}>
                        <td>{new Date(item.created_at).toLocaleDateString()}</td>
                        <td>{item.id_tecnico || '-'}</td>
                        <td>{item.codigo_imputacion}</td>
                        <td>{item.descripcion}</td>
                        <td>{item.tipo_comprobante}</td>
                         <td>$ {item.efectivo || '-'}</td>
                        <td>US$ {item.dolares || '-'}</td>
                        <td>$ {item.transferencia || '-'}</td>
                        <td>$ {item.total}</td>
                        <img className='pointer' style={{ width: '46px' }} src={eye} alt='Ver remito' onClick={() => handleRemito(item)} />
                      </tr>
                    ))}
                </Suspense>
              </tbody>
            </table>
          </div>
        </div>
        {modal && (
          <div className='remito-modal'>
            <div className='remito-content'>
              <div style={{ width: '50%' }} className='d-flex justify-content-evenly'>
                <h2>Remito #{remito.nro_comprobante}</h2>
                <h4 className='pointer' onClick={() => setModal(!modal)}>
                  X
                </h4>
              </div>
              <h4>Fecha: {remito.fecha}</h4>
              <div style={{ width: '80%' }} className='d-flex justify-content-between'>
                <p>Técnico: {remito.nombreEmpleado}</p>
                <p>Legajo: {remito.legajo}</p>
              </div>
              <div style={{ width: '80%' }} className='d-flex justify-content-between'>
                <p>Tipo de comprobante: {remito.tipo_comprobante}</p>
                <p>Tipo de factura: {remito.tipo_factura}</p>
              </div>
              <div style={{ width: '80%' }} className='d-flex justify-content-between'>
                <h3>Total: $ {remito.total}</h3>
              </div>
              <button className='pointer m-5' onClick={handleExportToPDF}>
                Imprimir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

PorTecnico.propTypes = {
  data: PropTypes.array,
};

export default PorTecnico;
