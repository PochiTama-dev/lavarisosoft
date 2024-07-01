import PropTypes from 'prop-types';
import OrdenesTecnico from './OrdenesTecnico';
const Tecnicos = ({ tecnicos, onSelectOrden }) => {
  return (
    <div className='bg-secondary tecnico overflow-scroll'>
      <h2>Por técnico</h2>
      {tecnicos.map((personalTecnico, index) => {
        const nombreCompleto = `${personalTecnico.nombre} ${personalTecnico.apellido}`;
        return (
          <OrdenesTecnico 
            key={index} 
            nombre={nombreCompleto} 
            ordenes={personalTecnico.Ordenes} 
            onSelectOrden={onSelectOrden}
          />
        );
      })}
    </div>
  );
};
export default Tecnicos;

Tecnicos.propTypes = {
  tecnicos: PropTypes.array.isRequired,
  onSelectOrden: PropTypes.func.isRequired,
};
