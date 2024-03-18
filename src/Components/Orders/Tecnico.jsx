import PropTypes from 'prop-types';
import OrdenesTecnico from './OrdenesTecnico';
const Tecnicos = ({ tecnicos }) => {
  return (
    <div>
      <h2>Por técnico</h2>
      {tecnicos.map((nombreTecnico, id) => (
        <>
          <OrdenesTecnico key={id} tecnico={nombreTecnico} />
        </>
      ))}
    </div>
  );
};
export default Tecnicos;

Tecnicos.propTypes = {
  tecnicos: PropTypes.object.isRequired,
};
