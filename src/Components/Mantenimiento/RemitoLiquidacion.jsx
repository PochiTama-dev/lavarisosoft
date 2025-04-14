import jsPDF from 'jspdf';
import { any, func, object } from 'prop-types';
import { useCustomContext } from '../../hooks/context';
import logo from '../../assets/logo-service.png';

const RemitoLiquidacion = ({ tecnico, setModal,    monto, selectedCaja,efectivo, dolares, transferencia }) => {
  const { PostSaldosPendientes } = useCustomContext();
  console.log(tecnico);
  const handleModal = () => {
    setModal(false);
    window.location.reload();
  };

  const sendToPrinter = async () => {
    exportToPDF();
    const dataBody = {
      caja: selectedCaja,
      presupuesto: null,
      facturaCompra: null,
      tecnico: tecnico.empleadoId,
    
      tipo: 'liquidacion',
      efectivo: efectivo,
      dolares: dolares,
      transferencia: transferencia,
      monto:monto
    };
    await PostSaldosPendientes(dataBody);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    let posY = 10;
    const pageWidth = doc.internal.pageSize.getWidth();

    if (logo) {
      doc.addImage(logo, 'PNG', 40, posY, 40, 40);
    }
    // Información de la empresa a la derecha de la imagen, en un bloque de ancho 80%
    const companyBlockWidth = pageWidth * 0.8;
    const companyX = pageWidth - companyBlockWidth; // posición X del bloque

    doc.setFontSize(14);
    doc.text("Juan Garcia Martinez 65 local 3", companyX + companyBlockWidth / 2, posY + 10, { align: "center" });
    doc.text("CUIL/CUIT: 30-71794576-6", companyX + companyBlockWidth / 2, posY + 20, { align: "center" });
    doc.text("www.gruposervice.ar", companyX + companyBlockWidth / 2, posY + 30, { align: "center" });
    doc.text("TEL: 351-7061881", companyX + companyBlockWidth / 2, posY + 40, { align: "center" });

    posY += 50;

    doc.setDrawColor(142, 163, 191);
    doc.setLineWidth(0.5);
    doc.line(10, posY, pageWidth - 10, posY);
    posY += 10;

    doc.setFontSize(18);
    doc.text(`Remito liquidación ${tecnico.Empleado.nombre} ${tecnico.Empleado.apellido}`, 10, posY);
    doc.text(`${new Date().toLocaleDateString()}`, pageWidth - 10, posY, { align: 'right' });
    posY += 10;

    doc.setFontSize(14);
    let startY = posY + 10;

    // Display payment methods if their amounts are greater than zero
    if ( efectivo > 0) {
      doc.text(`Monto efectivo: $${efectivo}`, 10, startY);
      startY += 10;
    }
    if ( dolares > 0) {
      doc.text(`Monto dólares: $${dolares}`, 10, startY);
      startY += 10;
    }
    if ( transferencia > 0) {
      doc.text(`Transferencia: $${transferencia}`, 10, startY);
      startY += 10;
    }

    // Display total or partial liquidation
    doc.setFontSize(16);
      doc.text(`Total: $${monto}`, 10, startY);
  

    const pdfBlob = doc.output('blob');
    const pdfURL = URL.createObjectURL(pdfBlob);
    setModal(false);
    window.open(pdfURL, '_blank');
    window.location.reload();
  };

  return (
    <div className='container2'>
      <div className='remito-container-content'>
        <div className='remito-container-top' style={{ marginTop: '-60px' }}>
          <div>
            <h2 className='m-auto'>Remito liquidación</h2>
            <h1 onClick={handleModal} className='pointer m-0'>
              x
            </h1>
          </div>
          <div style={{ marginTop: '30px' }}>
            
            <h4>
              Fecha <strong>{new Date().toLocaleDateString()}</strong>
            </h4>
          </div>
        </div>
        <svg height='5' viewBox='0 0 1829 5' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <line x1='-2.18557e-07' y1='2.5' x2='1829' y2='2.49984' stroke='#8EA3BF' strokeWidth='5' />
        </svg>
        <div>
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'row', gap: '20px', marginTop: '20px' }}>
          
            <div className='d-flex flex-column'>
              {efectivo > 0 && <h4>Efectivo: ${efectivo}</h4>}
              {dolares > 0 && <h4>Dólares: ${dolares}</h4>}
              {transferencia > 0 && <h4>Transferencia: ${transferencia}</h4>}
            </div>
          </div>
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'row', gap: '20px', marginTop: '20px' }}>
            <h4 className='d-flex flex-column'>
              <strong>Total:</strong>
            </h4>
            <div className='d-flex flex-column'>
              <h4>${monto}</h4>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', width: '150px', justifyContent: 'center', margin: '20px auto' }}>
          <button onClick={sendToPrinter}>Guardar</button>
        </div>
      </div>
    </div>
  );
};

RemitoLiquidacion.propTypes = {
  tecnico: object,
  setModal: func,
  liqParcial: any,
  selectedCaja: any,
  cajas: any,
  efectivo: any,
  dolares: any,
  transferencia: any,
  monto: any,
};

export default RemitoLiquidacion;
