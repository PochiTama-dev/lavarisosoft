import PropTypes from "prop-types";
import DatosCliente from "./DatosCliente";
import DatosIncidente from "./DatosIncidente";
import DatosTecnico from "./DatosTecnico";
import { modificarOrden/* , obtenerOrden */ } from "../../../services/ordenesService";
import "./OrdenDetalle.css";
import caja from "../../../images/caja.webp";
import nuevaOrden from "../../../images/nuevaOrdenTrabajo.webp";
import dolar from "../../../images/signoDolar.webp";
import { Link } from "react-router-dom";
import { useState } from "react";

const OrdenDetalle = ({ orden, onUpdateOrden }) => {
  const [show, setShow] = useState(false);

  // Verificación para asegurarse de que 'orden' no sea undefined
  if (!orden) {
    return <div>Selecciona una orden para ver los detalles</div>;
  }

  const {
    numero_orden,
    equipo,
    modelo,
    antiguedad,
    diagnostico,
    Cliente,
    Empleado,
    TiposEstado,
  } = orden;

  const handleAprobar = async () => {
    try {
      const ordenActualizada = { ...orden, id_tipo_estado: 1 };
      const resultado = await modificarOrden(orden.id, ordenActualizada);
      if (resultado) {
        console.log("Orden aprobada con éxito.");
        onUpdateOrden();
      } else {
        console.log("Error al aprobar la orden.");
      }
    } catch (error) {
      console.error("Error al aprobar la orden:", error);
    }
  };

  const handleDeclinar = async () => {
    try {
      const ordenActualizada = { ...orden, id_tipo_estado: 2 };
      const resultado = await modificarOrden(orden.id, ordenActualizada);
      if (resultado) {
        console.log("Orden declinada con éxito.");
        onUpdateOrden();
      } else {
        console.log("Error al declinar la orden.");
      }
    } catch (error) {
      console.error("Error al declinar la orden:", error);
    }
  };

  return (
    <div className="contentDetail">
      <div>
        <h1>Orden #{numero_orden}</h1>
        <span>Estado: {TiposEstado.tipo_estado}</span>
      </div>
      <DatosTecnico
        nombre={Empleado.nombre}
        apellido={Empleado.apellido}
        legajo={Empleado.legajo}
      />
      <DatosCliente
        nombre={Cliente.nombre}
        apellido={Cliente.apellido}
        legajo={`CL-${Cliente.id}`}
        telefono={Cliente.telefono}
        direccion={Cliente.direccion}
        localidad={Cliente.ubicacion}
      />
      <DatosIncidente
        equipo={equipo}
        modelo={modelo}
        antiguedad={`${antiguedad} años`}
        diagnostico={diagnostico}
      />
      <div className="d-flex justify-content-evenly position-relative">
        {/* Botones condicionales según el estado de la orden */}
        {TiposEstado.tipo_estado === "Pendiente" && (
          <div className="orders-btn">
            <button className="bg-info rounded-pill text-white">
              Declinar
            </button>
            <button className="bg-info rounded-pill text-white" onClick={handleAprobar}>Aprobar</button>
          </div>
        )}
        {TiposEstado.tipo_estado === "Cancelada" && (
          <div className="orders-btn">
            <button className="bg-info rounded-pill text-white" onClick={handleAprobar}>Aprobar</button>
          </div>
        )}
        {TiposEstado.tipo_estado === "Aprobada" && (
          <div className="orders-btn">
            <button className="bg-info rounded-pill text-white" onClick={handleDeclinar}>
              Declinar
            </button>
          </div>
        )}
        {/* Si la orden está "Cerrada", no se muestran botones */}
        {TiposEstado.tipo_estado === "Cerrada" && null}
        <aside
          className={`d-flex flex-column ${
            show ? "asideButtons" : "positionButton"
          } justify-content-end`}
        >
          {show && (
            <div>
              <Link to="/ordenes/ordenGlobal" className="text-decoration-none">
                <center className="imageContainer bg-info rounded-circle position-relative">
                  <img
                    className="iconsOptions position-absolute iconDolar"
                    src={dolar}
                    alt=""
                  />
                  <span className="black-text" style={{ fontSize: "14px" }}>
                    Aumento Global
                  </span>
                </center>
              </Link>
              <Link to="/ordenes/cobrarCaja" className="text-decoration-none">
                <center className="imageContainer bg-info rounded-circle position-relative">
                  <img className="iconsOptions" src={caja} alt="" />
                  <span className="black-text" style={{ fontSize: "14px" }}>
                    Cobrar en caja
                  </span>
                </center>
              </Link>
              <Link to="/ordenes/nuevaOrden" className="text-decoration-none">
                <center className="imageContainer bg-info rounded-circle position-relative">
                  <img className="iconsOptions" src={nuevaOrden} alt="" />
                  <span className="black-text" style={{ fontSize: "14px" }}>
                    Nueva orden de trabajo
                  </span>
                </center>
              </Link>
            </div>
          )}
          <h2
            className="bg-info text-white text-center rounded-pill agregarRepuesto"
            onClick={() => setShow(!show)}
          >
            +
          </h2>
        </aside>
      </div>
    </div>
  );
};

OrdenDetalle.propTypes = {
  orden: PropTypes.shape({
    numero_orden: PropTypes.number.isRequired,
    id_tipo_estado: PropTypes.number.isRequired,
    equipo: PropTypes.string.isRequired,
    modelo: PropTypes.string.isRequired,
    antiguedad: PropTypes.number.isRequired,
    diagnostico: PropTypes.string.isRequired,
    Cliente: PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      apellido: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      telefono: PropTypes.string.isRequired,
      direccion: PropTypes.string.isRequired,
      ubicacion: PropTypes.string.isRequired,
    }).isRequired,
    Empleado: PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      apellido: PropTypes.string.isRequired,
      legajo: PropTypes.string,
    }).isRequired,
    TiposEstado: PropTypes.shape({
      tipo_estado: PropTypes.string.isRequired,
    }).isRequired,
  }),
};

export default OrdenDetalle;
