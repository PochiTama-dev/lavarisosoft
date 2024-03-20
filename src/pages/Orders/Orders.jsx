import Header from '../../Components/Header/Header';
import NumOrden from '../../Components/Orders/NumOrden/NumOrden';
import OrdenDetalle from '../../Components/Orders/OrdenDetalle/OrdenDetalle';
import Tecnicos from '../../Components/Orders/OrdenTecnico/Tecnicos';

const Orders = () => {
  const tecnicos = [
    { nombre: 'Alan Almendra' },
    { nombre: 'Mariela Paz' },
    { nombre: 'Leandro Suero' },
  ];
  return (
    <div>
      <Header text={'Ordenes'} />
      <div className='d-flex m-3'>
        <aside>
          <div className='tecnico'>
            <Tecnicos tecnicos={tecnicos} />
          </div>
          <div className='mt-3'>
            <NumOrden />
          </div>
        </aside>
        <aside className='m-0'>
          <div className='mx-3'>
            <OrdenDetalle />
          </div>
        </aside>
      </div>
    </div>
  );
};
export default Orders;
