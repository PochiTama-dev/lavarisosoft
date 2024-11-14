import PropTypes from "prop-types";
import "./Cajas.css";

const Cajas = ({ cajas, onCajaSelect }) => {
  const handleCaja = (event) => {
    const selectedIndex = event.target.value;
    onCajaSelect(Number(selectedIndex));
  };

  return (
    <div className="cajas bg-secondary">
      <select onChange={handleCaja} className="form-select" defaultValue="">
        <option value="" disabled>
          Seleccione una caja
        </option>
        <option>Todas las cajas</option>
        {cajas?.map((caja, index) => (
          <option key={index} value={caja?.id}>
            {caja?.denominacion}
          </option>
        ))}
      </select>
    </div>
  );
};

Cajas.propTypes = {
  cajas: PropTypes.array.isRequired,
  onCajaSelect: PropTypes.func.isRequired,
};

export default Cajas;
