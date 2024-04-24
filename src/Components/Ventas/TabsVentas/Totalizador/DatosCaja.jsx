import PropTypes from 'prop-types';
const DatosCaja = ({ datosCajaSelected }) => {
  return (
    <>
      {datosCajaSelected.map((datos, index) => (
        <div className={`d-flex ${index % 2 === 0 ? 'bg-light' : ''}`} key={index}>
          <li className='col text-center'>{datos.fecha}</li>
          <li className='col text-center'>{datos.codImp}</li>
          <li className='col text-center'>{datos.numOp}</li>
          <li className='col text-center'>{datos.nomCliente}</li>
          <li className='col text-center'>{datos.idCliente}</li>
          <li className='col text-center'>{datos.valor}</li>
        </div>
      ))}
    </>
  );
};
export default DatosCaja;
DatosCaja.propTypes = {
  datosCajaSelected: PropTypes.array.isRequired,
};
