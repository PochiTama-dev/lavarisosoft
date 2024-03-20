import './NumOrden.css';
const NumOrden = () => {
  const resultadoOrden = ['text-success', 'text-danger', 'text-secondary'];

  return (
    <div className='bg-secondary'>
      <h3>Por número de orden</h3>
      <ul className='numOrden'>
        <li className='d-flex justify-content-around'>
          <a href=''>#25000</a>
          <span className={resultadoOrden[0]}>Aprobada</span>
        </li>
        <li className='d-flex justify-content-around'>
          <a href=''>#25100</a>
          <span className={resultadoOrden[0]}>Aprobada</span>
        </li>
        <li className='d-flex justify-content-around'>
          <a href=''>#25111</a>
          <span className={resultadoOrden[1]}>Pendiente</span>
        </li>
        <li className='d-flex justify-content-around'>
          <a href=''>#25456</a>
          <span className={resultadoOrden[2]}>Cerrada</span>
        </li>
        <li className='d-flex justify-content-around'>
          <a href=''>#25245</a>
          <span className={resultadoOrden[2]}>Cerrada</span>
        </li>
        <li className='d-flex justify-content-around'>
          <a href=''>#25423</a>
          <span className={resultadoOrden[0]}>Aprobada</span>
        </li>
        <li className='d-flex justify-content-around'>
          <a href=''>#25453</a>
          <span className={resultadoOrden[2]}>Cerrada</span>
        </li>
        <li className='d-flex justify-content-around'>
          <a href=''>#25268</a>
          <span className={resultadoOrden[2]}>Cerrada</span>
        </li>
      </ul>
    </div>
  );
};
export default NumOrden;
