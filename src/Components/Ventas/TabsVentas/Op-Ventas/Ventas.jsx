import { Suspense, useState, useEffect } from 'react';
import './OpVentas.css';
import PropTypes from 'prop-types';
import { listaFacturasVentas } from '../../../../services/facturaVentasService';
import eye from '../../../../assets/eye.svg';
import jsPDF from 'jspdf';
const Ventas = () => {
  const [data, setData] = useState([]);
  const [orderBy, setOrderBy] = useState(null);
  const [orderAsc, setOrderAsc] = useState(true);
  const [remito, setRemito] = useState({});
  const [modal, setModal] = useState(false);
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
    if (num === 1) return 'Echeq';
    else if (num === 2) return 'Efectivo en dólares';
    else if (num === 3) return 'Efectivo en pesos';
    else if (num === 4) return 'Transferencia en dólares';
    else if (num === 5) return 'Transferencia en pesos';
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

  const handleRemito = (item) => {
    console.log(item);
    const remito = {
      codigo_imputacion: item?.codigo_imputacion,
      fecha: new Date(item.created_at).toLocaleDateString(),
      cuil: item.Cliente?.cuil,
      descripcion: item.descripcion,
      dolares: item.dolares,
      efectivo: item.efectivo,
      id_caja: item.id_caja,
      id_tecnico: item?.id_tecnico,
      importe: item.importe,
      iva_alicuota: item.iva_alicuota,
      iva_deb_fiscal: item.iva_deb_fiscal,
      nro_comprobante: item.nro_comprobante,
      tipo_comprobante: item.tipo_comprobante,
      tipo_factura: item.tipo_factura,
      total: item.total,
      transferencia: item.transferencia,
      nombreEmpleado: `${item.Empleado?.nombre} ${item.Empleado?.apellido}`,
      legajo: item.Empleado?.legajo,
      nombreCliente: `${item.Cliente?.nombre} ${item.Cliente?.apellido}`,
      medio_pago: mediosPagos(item.Presupuesto?.id_medio_de_pago),
      id_cliente: item.id_cliente,
    };
    setRemito(remito);
    setModal(!modal);
  };
  const handleExportToPDF = () => {
    const doc = new jsPDF();

    // Título del remito
    doc.setFontSize(18);
    doc.text(`Remito Ventas y Servicios No.#${remito.nro_comprobante}`, 10, 20);

    // Detalles del remito
    doc.setFontSize(12);
    doc.text(`Fecha: ${remito.fecha}`, 10, 40);
    doc.text(`Técnico: ${remito.nombreEmpleado || '-'}`, 10, 50);
    doc.text(`Legajo: ${remito.legajo || '-'}`, 120, 50);
    doc.text(`Cliente: ${remito.nombreCliente || '-'}`, 10, 60);
    doc.text(`CUIT/CUIL: ${remito.cuil || '-'}`, 120, 60);
    doc.text(`Tipo de comprobante: ${remito.tipo_comprobante || '-'}`, 10, 70);
    doc.text(`Tipo de factura: ${remito.tipo_factura || '-'}`, 120, 70);
    doc.text(`Código de imputación: ${remito.codigo_imputacion || '-'}`, 10, 80);
    doc.text(`Descripción: ${remito.descripcion || '-'}`, 120, 80);

    // Medios de pago
    doc.setFontSize(14);
    doc.text('Medios de Pago:', 10, 100);
    doc.setFontSize(12);
    doc.text(`Efectivo: $${remito.efectivo || '0.00'}`, 10, 110);
    doc.text(`Dólares: $${remito.dolares || '0.00'}`, 70, 110);
    doc.text(`Transferencia: $${remito.transferencia || '0.00'}`, 130, 110);

    // Totales
    doc.setFontSize(14);
    doc.text(`Total: $${remito.total || '0.00'}`, 10, 130);

    // IVA
    doc.setFontSize(12);
    doc.text(`IVA alícuota: ${remito.iva_alicuota || '0.00'}`, 70, 130);
    doc.text(`IVA débito fiscal: ${remito.iva_deb_fiscal || '0.00'}`, 130, 130);

    // Generar el PDF como un blob
    const pdfBlob = doc.output('blob');

    // Crear una URL para el blob
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Abrir el PDF en una nueva pestaña
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
                  <th onClick={() => handleSort('created_at')}>Fecha {orderBy === 'created_at' ? orderAsc ? '▲' : '▼' : <span>▼</span>}</th>
                  <th onClick={() => handleSort('nro_comprobante')}>N° de orden {orderBy === 'nro_comprobante' ? orderAsc ? '▲' : '▼' : <span>▼</span>}</th>
                  <th onClick={() => handleSort('Cliente.cuil')}>CUIL-Cliente {orderBy === 'Cliente.cuil' ? orderAsc ? '▲' : '▼' : <span>▼</span>}</th>
                  <th onClick={() => handleSort('efectivo')}>Efectivo {orderBy === 'efectivo' ? orderAsc ? '▲' : '▼' : <span>▼</span>}</th>{' '}
                  <th onClick={() => handleSort('dolares')}>Dólares {orderBy === 'dolares' ? orderAsc ? '▲' : '▼' : <span>▼</span>}</th>
                  <th onClick={() => handleSort('transferencia')}>Transferencia {orderBy === 'transferencia' ? orderAsc ? '▲' : '▼' : <span>▼</span>}</th>
                  <th onClick={() => handleSort('total')}>Monto {orderBy === 'total' ? orderAsc ? '▲' : '▼' : <span>▼</span>}</th>
                </tr>
              </thead>
              <tbody>
                <Suspense fallback={<h1>Cargando...</h1>}>
                  {sortedData &&
                    sortedData.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? '' : 'row-even'}>
                        <td>{new Date(item.created_at).toLocaleDateString()}</td>
                        <td>{item.nro_comprobante}</td>
                        <td>{item.cuit_cliente}</td>
                        <td>{item.efectivo}</td>
                        <td>{item.dolares}</td>
                        <td>{item.transferencia}</td>
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
              {remito.id_tecnico && (
                <div style={{ width: '80%' }} className='d-flex justify-content-between'>
                  <p>Técnico: {remito.nombreEmpleado}</p>
                  <p>Legajo: {remito.legajo}</p>
                </div>
              )}
              <div style={{ width: '80%' }} className='d-flex justify-content-between'>
                <p>Tipo de comprobante: {remito?.tipo_comprobante || '-'}</p>
                <p>Tipo de factura: {remito?.tipo_factura || '-'}</p>
              </div>
              <div style={{ width: '80%' }} className='d-flex justify-content-between'>
                <p>Codigo de imputación: {remito?.codigo_imputacion || '-'}</p>
                <p>Descripcion: {remito.descripcion}</p>
              </div>
              {remito.id_cliente && (
                <div style={{ width: '80%' }} className='d-flex justify-content-between'>
                  <p>Cliente: {remito.nombreCliente}</p>
                  <p>CUIT/CUIL: {remito.cuil}</p>
                </div>
              )}
              <div style={{ width: '80%' }} className='d-flex justify-content-between'>
                <p>Importe: {remito.importe}</p>
                <p>IVA alicuota: {remito?.iva_alicuota || '0.00'}</p>
                <p>IVA debito fiscal: {remito?.iva_deb_fiscal || '0.00'}</p>
              </div>
              <h4>Medios de pago</h4>
              <div style={{ width: '100%' }} className='d-flex justify-content-between'>
                <p>Efectivo: $ {remito.efectivo}</p>
                <p>Dolares: $ {remito.dolares}</p>
                <p>Transferencia: $ {remito?.trasferencia || '0.00'}</p>
              </div>
              <div style={{ width: '100%' }} className='d-flex justify-content-between'>
                <h3>Total: $ {remito.total}</h3>
              </div>
              <button className='pointer m-5' onClick={handleExportToPDF}>
                Imprimir
              </button>
            </div>
            {/* 
            id_caja: item.id_caja,
            id_tecnico: item?.id_tecnico,
            nombreEmpleado: `${item.Empleado?.nombre} ${item.Empleado?.apellido}`,
            legajo: item.Empleado?.legajo,
            */}
          </div>
        )}
      </div>
    </div>
  );
};

Ventas.propTypes = {
  data: PropTypes.array,
};

export default Ventas;
