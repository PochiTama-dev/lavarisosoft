import PropTypes from 'prop-types';
const Saldos = ({ saldos }) => {
  return (
    <>
      <ul className='p-0'>
        {saldos.map((saldo, index) => (
          <div
            key={index}
            className={`d-flex align-items-center ${index % 2 === 0 ? 'bg-light' : ''} ${
              saldo.estado === 'PAGO' ? 'borde-verde' : saldo.estado === 'PENDIENTE' ? 'borde-amarillo' : 'borde-rojo'
            }`}
          >
            <li className='col saldoItem'>{saldo.motivo}</li>
            <li className='col saldoItem'>{saldo.descripcion}</li>
            <li
              className={`col saldoItem ${saldo.estado === 'PAGO' ? 'text-success' : saldo.estado === 'PENDIENTE' ? 'text-warning' : 'text-danger'}`}
            >
              {saldo.estado}
            </li>

            {saldo.estado === 'PAGO' ? (
              <li className='text-success col saldoItem'>${saldo.saldo}</li>
            ) : saldo.estado === 'PENDIENTE' ? (
              <li className='text-warning col saldoItem'>+ ${saldo.saldo}</li>
            ) : (
              <li className='text-danger col saldoItem'>- ${saldo.saldo}</li>
            )}
            <li className='col saldoItem'>{saldo.caja}</li>
          </div>
        ))}
      </ul>
    </>
  );
};
export default Saldos;
Saldos.propTypes = {
  saldos: PropTypes.array.isRequired,
};
