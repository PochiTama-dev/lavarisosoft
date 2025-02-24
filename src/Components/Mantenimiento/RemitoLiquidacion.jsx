import jsPDF from 'jspdf';
import { func, object } from 'prop-types';
const RemitoLiquidacion = ({ tecnico, setModal }) => {
  const handleModal = () => {
    setModal(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Agregar título
    doc.setFontSize(18);
    doc.text(`Remito ${tecnico.nombre}`, 10, 10);

    // Información superior
    doc.setFontSize(12);
    doc.text(`No.: #25647`, 10, 20);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, 30);
    doc.text(`CUIT/CUIL: ${tecnico.ordenes[0]?.Empleado?.cuil || 'N/A'}`, 10, 40);

    // Línea de separación
    doc.setDrawColor(142, 163, 191);
    doc.setLineWidth(0.5);
    doc.line(10, 50, 200, 50);

    // Porcentaje Técnico
    doc.setFontSize(14);
    doc.text(`Porcentaje Técnico: ${tecnico.porcentaje_arreglo * 100}%`, 10, 60);

    // Tabla de órdenes
    let startY = 70;
    doc.setFontSize(12);
    doc.text('Ordenes:', 10, startY);

    const tableHeaders = ['Nro', 'Fecha', 'Descripción', 'Seguro', 'Precio total'];
    const columnWidths = [15, 45, 75, 25, 30]; // Ancho de cada columna
    const tableData = tecnico.ordenes.map((orden) => [orden.numero_orden, new Date(orden.created_at).toLocaleDateString(), orden.diagnostico, `$${orden.dpg}`, `$${orden.total}`]);
    // Agregar encabezados de la tabla
    let colX = 10;
    tableHeaders.forEach((header, index) => {
      doc.text(header, colX, startY + 10);
      colX += columnWidths[index]; // Ajustar espacio entre columnas
    });

    // Agregar filas de la tabla
    startY += 20;
    tableData.forEach((row) => {
      let cellX = 10;
      row.forEach((cell, index) => {
        doc.text(cell.toString(), cellX, startY);
        console.log(index);
        index === 0 ? (cellX -= 15) : (cellX += 1); // Ajustar espacio entre columnas
        index === 1 ? (cellX += 10) : (cellX += 15); // Ajustar espacio entre columnas
        index === 2 ? (cellX += 80) : (cellX += 15); // Ajustar espacio entre columnas
      });
      startY += 10;
    });

    // Total
    doc.setFontSize(14);
    doc.text(`Total: $${tecnico.total}`, 10, startY + 10);

    // Guardar el archivo
    // Crear un Blob URL para mostrar el PDF
    const pdfBlob = doc.output('blob');
    const pdfURL = URL.createObjectURL(pdfBlob);

    // Abrir el PDF en una nueva pestaña
    setModal(false);
    window.open(pdfURL, '_blank');
  };

  return (
    <div className='container'>
      <div className='remito-container-content'>
        <div className='remito-container-top'>
          <div>
            <h2 className='m-auto'>Remito {tecnico.nombre}</h2>
            <h1 onClick={handleModal} className='pointer m-0'>
              x
            </h1>
          </div>
          <div>
            <h4>
              No. <strong>#25647</strong>
            </h4>
            <h4>
              Fecha <strong>{new Date().toLocaleDateString()}</strong>
            </h4>
            <h4>
              CUIT/CUIL <strong>{tecnico.ordenes[0].Empleado.cuil}</strong>
            </h4>
          </div>
        </div>
        <svg height='5' viewBox='0 0 1829 5' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <line x1='-2.18557e-07' y1='2.5' x2='1829' y2='2.49984' stroke='#8EA3BF' strokeWidth='5' />
        </svg>
        <div>
          <div>
            <h2 className='text-center'>Ordenes</h2>
            <span>Porcentaje Tecnico: {tecnico.porcentaje_arreglo * 100}%</span>
          </div>
          <table>
            <thead>
              <tr className='row'>
                <th className='col'>Nro</th>
                <th className='col'>Fecha</th>
                <th className='col'>Descripción</th>
                <th className='col'>Seguro</th>
                <th className='col'>Precio total</th>
              </tr>
            </thead>
            <tbody>
              {tecnico.ordenes.map((orden) => (
                <tr className='row p-3' key={orden.id}>
                  <td className='col'>{orden.numero_orden}</td>
                  <td className='col'>{new Date(orden.created_at).toLocaleDateString()}</td>
                  <td className='col w-auto'>{orden.diagnostico}</td>
                  <td className='col'>${orden.dpg}</td>
                  <td className='col'>${orden.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='remito-container-total'>
            <h4>
              <strong>Total:</strong>
            </h4>
            <h4> ${tecnico.total}</h4>
          </div>
          <div className='remito-button-container'>
            <button onClick={exportToPDF}>Imprimir</button>
          </div>
        </div>
      </div>
    </div>
  );
};

RemitoLiquidacion.propTypes = {
  tecnico: object,
  setModal: func,
};

export default RemitoLiquidacion;
