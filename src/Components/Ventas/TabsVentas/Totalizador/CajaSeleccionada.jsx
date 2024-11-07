import PropTypes from "prop-types";

const CajaSeleccionada = ({ onDateChange }) => {
  const handleDateInput = (event) => {
    onDateChange(event.target.value);
  };
  return (
    <div>
      <ul>
        <li>
          <div className="d-flex justify-content-between my-2 inputsItems">
            <label className="text-primary" htmlFor="">
              Filtrar por fecha
            </label>
            <input
              className="rounded-pill mx-4"
              type="date"
              onChange={handleDateInput}
            />
          </div>
          <div className="d-flex justify-content-between my-2 inputsItems">
            <label className="text-primary" htmlFor="">
              Filtrar por cod.Imp
            </label>
            <input className="rounded-pill mx-4 codImp" type="search" />
          </div>
        </li>
      </ul>
      <ul className="row">
        <li className="pestañasFont pestañasInventario col text-center">
          Efectivo
        </li>
        <li className="pestañasFont pestañasInventario col text-center">
          Dólares
        </li>
        <li className="pestañasFont pestañasInventario col text-center">
          Bancos
        </li>
      </ul>
      <ul className="row">
        <li className="col text-center items">ID de orden</li>
        <li className="col text-center items">ID de repuesto</li>
        <li className="col text-center items">Número de caja</li>
        <li className="col text-center items">Precio</li>
        <li className="col text-center items">Cantidad</li>
        <li className="col text-center items">Total</li>
      </ul>
    </div>
  );
};

CajaSeleccionada.propTypes = {
  onDateChange: PropTypes.func.isRequired,
};

export default CajaSeleccionada;
