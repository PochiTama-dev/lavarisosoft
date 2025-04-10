import PropTypes from "prop-types";
import { useState } from "react";

const CajaSeleccionada = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    const [year, month] = newDate.split("-");
    onDateChange({ year, month });
  };

  return (
    <div>
      <div className="d-flex justify-content-evenly my-2">
        <label className="text-primary" htmlFor="dateFilter">
          Filtrar por período
        </label>
        <div className="d-flex">
          {/* Selector de Mes y Año */}
          <input
            id="dateFilter"
            className="rounded-pill mx-4"
            type="month"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>
      </div>
      <ul className="row" style={{ marginTop: "3%" }}>
        <li className="col text-center items">Periodo del Mes</li>
        <li className="col text-center items">Total Facturado</li>
        <li className="col text-center items">Total Pagado a tecnicos</li>
        <li className="col text-center items">Margen Bruto</li>
        <li className="col text-center items">Gastos Operativos</li>  
        <li className="col text-center items">Ganancia Neta</li>
        {/* <li className="col text-center items">Facturas pendientes de cobro</li> */}
      </ul>
    </div>
  );
};

CajaSeleccionada.propTypes = {
  onDateChange: PropTypes.func.isRequired,
};

export default CajaSeleccionada;
