import jsPDF from 'jspdf';
import { any, func, object } from 'prop-types';
import { useCustomContext } from '../../hooks/context';
 
const RemitoLiquidacion = ({ tecnico, setModal, liqParcial, selectedCaja   }) => {
  const { PostSaldosPendientes } = useCustomContext();
  console.log(tecnico);
  const handleModal = () => {
    setModal(false);
  };

  const sendToPrinter = async () => {
    exportToPDF();
    const dataBody = {
      caja: selectedCaja,
      presupuesto: null,
      facturaCompra: null,
      tecnico: tecnico.empleadoId,
      monto: liqParcial ? liqParcial : tecnico.total,
      tipo: 'liquidacion',
    };
    await PostSaldosPendientes(dataBody);
 
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Remito ${tecnico.nombre}`, 10, 10);
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, 30);
 
    doc.setDrawColor(142, 163, 191);
    doc.setLineWidth(0.5);
    doc.line(10, 50, 200, 50);
    doc.setFontSize(14);
    //doc.text(`Porcentaje Técnico: ${tecnico.porcentaje_arreglo * 100}%`, 10, 60);
    let startY = 70;
 
    if (liqParcial) {
      doc.text(`Liquidacion Parcial: ${liqParcial}`, 10, startY + 10);
      doc.text(`Debe: ${parseFloat(tecnico.total - liqParcial).toFixed(2)}`, 10, startY + 20);
    } else {
      doc.text(`Total: $${tecnico.total}`, 10, startY + 10);
    }
 
    const pdfBlob = doc.output('blob');
    const pdfURL = URL.createObjectURL(pdfBlob);
    setModal(false);
    window.open(pdfURL, '_blank');
  };

  return (
    <div className='container'>
      <div className='remito-container-content'>
        <div className='remito-container-top' style={{marginTop:'-60px'}}>
          <div>
            <h2 className='m-auto'>Remito {tecnico.nombre}</h2>
            <h1 onClick={handleModal} className='pointer m-0'>
              x
            </h1>
          </div>
          <div style={{marginTop:'30px'}}>
            <h4>
              No. <strong>#25647</strong>
            </h4>
            <h4>
              Fecha <strong>{new Date().toLocaleDateString()}</strong>
            </h4>
          </div>
        </div>
        <svg height='5' viewBox='0 0 1829 5' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <line x1='-2.18557e-07' y1='2.5' x2='1829' y2='2.49984' stroke='#8EA3BF' strokeWidth='5' />
        </svg>
        <div>
 
           <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'row', gap: '20px', marginTop:'20px' }}>
 
            <h4 className='d-flex flex-column'>
              <strong>Monto:</strong>
            </h4>
            <div className='d-flex flex-column'>
              <h4>${liqParcial}</h4>
            </div>
          </div>
          <div  style={{ display: 'flex', flexDirection: 'column', width: '150px', justifyContent:'center', margin:'20px auto' }}>
            <button onClick={sendToPrinter}>Guardar</button>
          </div>
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
};

export default RemitoLiquidacion;
