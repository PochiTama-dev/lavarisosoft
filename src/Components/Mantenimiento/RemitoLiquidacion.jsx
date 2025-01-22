import { func, object } from 'prop-types';
const RemitoLiquidacion = ({ tecnico, setModal }) => {
  console.log(tecnico);
  const handleModal = () => {
    setModal(false);
  };
  return (
    <div className='container'>
      <div className='remito-container-content'>
        <div className='remito-container-top'>
          <div>
            <h2 className='m-auto'>Remito {tecnico.nombre}</h2>
            <h1 onClick={handleModal} className='pointer m-0'>
              x
            </h1>
          </div>
          <div>
            <h4>
              No. <strong>#25647</strong>
            </h4>
            <h4>
              Fecha <strong>{new Date().toLocaleDateString()}</strong>
            </h4>
            <h4>
              CUIT/CUIL <strong>{tecnico.ordenes[0].Empleado.cuil}</strong>
            </h4>
          </div>
        </div>
        <svg height='5' viewBox='0 0 1829 5' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <line x1='-2.18557e-07' y1='2.5' x2='1829' y2='2.49984' stroke='#8EA3BF' strokeWidth='5' />
        </svg>
        <div>
          <div>
            <h2 className='text-center'>Ordenes</h2>
            <span>Porcentaje Tecnico: {tecnico.porcentaje_arreglo * 100}%</span>
          </div>
          <table>
            <thead>
              <tr className='row'>
                <th className='col'>Nro</th>
                <th className='col'>Fecha</th>
                <th className='col'>Descripción</th>
                <th className='col'>Seguro</th>
                <th className='col'>Precio total</th>
              </tr>
            </thead>
            <tbody>
              {tecnico.ordenes.map((orden) => (
                <tr className='row p-3' key={orden.id}>
                  <td className='col'>{orden.numero_orden}</td>
                  <td className='col'>{new Date(orden.created_at).toLocaleDateString()}</td>
                  <td className='col w-auto'>{orden.diagnostico}</td>
                  <td className='col'>${orden.dpg}</td>
                  <td className='col'>${orden.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='remito-container-total'>
            <h4>
              <strong>Total:</strong>
            </h4>
            <h4> ${tecnico.total}</h4>
          </div>
          <div className='remito-button-container'>
            <button>Imprimir</button>
          </div>
        </div>
      </div>
    </div>
  );
};

RemitoLiquidacion.propTypes = {
  tecnico: object,
  setModal: func,
};

export default RemitoLiquidacion;
