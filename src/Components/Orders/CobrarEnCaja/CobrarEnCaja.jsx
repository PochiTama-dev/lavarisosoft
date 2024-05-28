import Header from '../../Header/Header';
import NuevosDatosCliente from '../NuevaOrden/NuevosDatosCliente';
import DatosDelRepuesto from './DatosDelRepuesto';
import './DatosDelRepuesto.css';
const CobrarEnCaja = () => {
  return (
    <div className='cobrarCaja-ctn'>
      <Header text='Cobrar en caja' />
      <div className='mt-5 pt-5'>
        <NuevosDatosCliente />
        <DatosDelRepuesto />
      </div>
    </div>
  );
};
export default CobrarEnCaja;
