import PropTypes from "prop-types";
import "./Cajas.css";

const Cajas = ({ cajas, onCajaSelect }) => {
  // Definición de la función handleCaja
  const handleCaja = (event) => {
    const selectedIndex = event.target.value;
    onCajaSelect(Number(selectedIndex)); // Llamando al prop `onCajaSelect`
  };

  return (
    <div className="cajas bg-secondary">
      <select onChange={handleCaja} className="form-select" defaultValue="">
        <option value="" disabled>
          Seleccione una caja
        </option>
        {cajas?.map((caja, index) => (
          <option key={index} value={caja.id}>
            {caja.denominacion}
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
