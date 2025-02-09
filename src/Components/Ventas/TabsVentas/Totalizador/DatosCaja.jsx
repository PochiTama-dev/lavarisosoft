import PropTypes from 'prop-types';

const DatosCaja = ({ cobros, selectedDate, totalFacturado, totalPagado, margenBruto }) => {
  const filteredCobros = selectedDate
    ? cobros.filter((cobro) => {
        const formattedDate = cobro.created_at.split('T')[0];
        return formattedDate === selectedDate;
      })
    : cobros;

  return (
    <div>
      {filteredCobros.map((datos, index) => (
        <div className={`d-flex datosCaja ${index % 2 === 0 ? 'bg-light' : ''}`} key={index}>
          <li className='col text-center'>MES</li>
          <li className='col text-center'>{totalFacturado}</li>
          <li className='col text-center'>{totalPagado}</li>
          <li className='col text-center'>{margenBruto}</li>
          <li className='col text-center'>{datos.cantidad}</li>
          <li className='col text-center'>{datos.total}</li>
          <li className='col text-center'>{datos.total}</li>
        </div>
      ))}
    </div>
  );
};

DatosCaja.propTypes = {
  cobros: PropTypes.array.isRequired,
  selectedDate: PropTypes.string,
  totalFacturado: PropTypes.number,
};

export default DatosCaja;
