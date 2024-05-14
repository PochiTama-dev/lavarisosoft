import Header from '../../Components/Header/Header';
import NumOrden from '../../Components/Orders/NumOrden/NumOrden';
import OrdenDetalle from '../../Components/Orders/OrdenDetalle/OrdenDetalle';
import Tecnicos from '../../Components/Orders/OrdenTecnico/Tecnicos';
import './Orders.css';
const Orders = () => {
  const tecnicos = [{ nombre: 'Alan Almendra' }, { nombre: 'Mariela Paz' }, { nombre: 'Leandro Suero' }];
  return (
    <div>
      <Header text={'Ordenes'} />
      <div className='d-flex m-5 p-5'>
        <aside>
          <div>
            <Tecnicos tecnicos={tecnicos} />
          </div>
          <div className='mt-3'>
            <NumOrden />
          </div>
        </aside>
        <aside className='w-100 bg-secondary asideDetail'>
          <div className='mx-3'>
            <OrdenDetalle />
          </div>
        </aside>
      </div>
    </div>
  );
};
export default Orders;
