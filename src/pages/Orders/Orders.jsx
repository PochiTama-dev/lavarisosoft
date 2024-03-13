import Header from '../../Components/Header/Header';

const Orders = () => {
  return (
    <div>
      <Header text={'Ordenes'} />
      <div>
        <aside>
          <div className='tecnico'>tecnico</div>
          <div className='numOrden'></div>
        </aside>
        <aside>
          <div className='orden'></div>
        </aside>
      </div>
    </div>
  );
};
export default Orders;
