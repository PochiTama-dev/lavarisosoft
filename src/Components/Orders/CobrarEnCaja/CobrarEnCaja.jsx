import Header from '../../Header/Header';
import NuevosDatosCliente from '../NuevaOrden/NuevosDatosCliente';
import DatosDelRepuesto from './DatosDelRepuesto';

const CobrarEnCaja = () => {
  return (
    <div>
      <Header text='Cobrar en caja' />
      <div className='mt-5 pt-5'>
        <NuevosDatosCliente />
        <DatosDelRepuesto />
      </div>
    </div>
  );
};
export default CobrarEnCaja;
