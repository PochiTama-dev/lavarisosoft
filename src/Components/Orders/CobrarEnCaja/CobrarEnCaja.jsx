import Header from '../../Header/Header';
import NuevosDatosCliente from '../NuevaOrden/NuevosDatosCliente';
import DatosDelRepuesto from './DatosDelRepuesto';

const CobrarEnCaja = () => {
  return (
    <div>
      <Header text='Cobrar en caja' />
      <NuevosDatosCliente />
      <DatosDelRepuesto />
    </div>
  );
};
export default CobrarEnCaja;
