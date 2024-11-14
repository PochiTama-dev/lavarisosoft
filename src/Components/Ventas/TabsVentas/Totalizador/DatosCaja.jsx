import PropTypes from "prop-types";

const DatosCaja = ({ cobros, selectedDate }) => {
  const filteredCobros = selectedDate
    ? cobros.filter((cobro) => {
        const formattedDate = cobro.created_at.split("T")[0];
        return formattedDate === selectedDate;
      })
    : cobros;

  return (
    <div>
      {filteredCobros.map((datos, index) => (
        <div
          className={`d-flex datosCaja ${index % 2 === 0 ? "bg-light" : ""}`}
          key={index}
        >
          <li className="col text-center">{datos.id_orden}</li>
          <li className="col text-center">{datos.id_repuesto}</li>
          <li className="col text-center">{datos.id_caja}</li>
          <li className="col text-center">{datos.precio}</li>
          <li className="col text-center">{datos.cantidad}</li>
          <li className="col text-center">{datos.total}</li>
        </div>
      ))}
    </div>
  );
};

DatosCaja.propTypes = {
  cobros: PropTypes.array.isRequired,
  selectedDate: PropTypes.string,
};

export default DatosCaja;
