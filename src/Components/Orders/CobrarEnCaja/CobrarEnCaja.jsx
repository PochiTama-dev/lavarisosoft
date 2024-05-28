import Header from '../../Header/Header';
import NuevosDatosCliente from '../NuevaOrden/NuevosDatosCliente';
import DatosDelRepuesto from './DatosDelRepuesto';
import './DatosDelRepuesto.css';
const CobrarEnCaja = () => {
  return (
    <div className='cobrarCaja-ctn'>
      <Header text='Cobrar en caja' />
      <NuevosDatosCliente />
      <DatosDelRepuesto />
    </div>
  );
};
export default CobrarEnCaja;
