import { useState } from 'react';
import Header from '../../../Header/Header';
import CajaSeleccionada from './CajaSeleccionada';
import Cajas from './Cajas';
import  cajasVarias from './cajasData';
const Totalizador = () => {
  
  const [caja, setCaja] = useState(cajasVarias[0]);

  const nombreCajas = cajasVarias.map((nombre) => nombre.name);

  const handleCaja = (num) => {
    setCaja(cajasVarias[num]);
  };

  return (
    <div>
      <Header text={'Totalizador'} />
      <div className='containerTotalizador d-flex'>
        <div className='cajaDetalle'>
        <Cajas nombresCajas={nombreCajas} cajaSeteada={handleCaja} />
          <CajaSeleccionada cajaSelected={caja} />
        </div>
      </div>
    </div>
  );
};

export default Totalizador;
