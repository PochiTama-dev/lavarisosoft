import PropTypes from 'prop-types';
import OrdenesTecnico from './OrdenesTecnico';
const Tecnicos = ({ tecnicos }) => {
  return (
    <div className='bg-secondary'>
      <h2>Por técnico</h2>
      {tecnicos.map((personalTecnico, index) => (
        <>
          <OrdenesTecnico key={index} tecnico={personalTecnico.nombre} />
        </>
      ))}
    </div>
  );
};
export default Tecnicos;

Tecnicos.propTypes = {
  tecnicos: PropTypes.array.isRequired,
};
