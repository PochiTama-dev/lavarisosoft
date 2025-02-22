import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import DatosCliente from "./DatosCliente";
import DatosIncidente from "./DatosIncidente";
import DatosTecnico from "./DatosTecnico";
import { modificarOrden } from "../../../services/ordenesService";
import "./OrdenDetalle.css";
import { useCustomContext } from "../../../hooks/context";
import { listadoEmpleados } from "../../../services/empleadoService";
import { useEffect, useState } from "react";

const OrdenDetalle = ({ orden, onUpdateOrden }) => {
  const [tecnicos, setTecnicos] = useState([]);
  const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState(null);

  const navigate = useNavigate();
  const { guardarRepuestoOrden } = useCustomContext();
  const repuestos = [];

  useEffect(() => {
    const fetchTecnicos = async () => {
      try {
        const data = await listadoEmpleados();
        if (data.length > 0) {
          const rolTecnicos = data.filter((empleado) => empleado.id_rol === 5);
          setTecnicos(rolTecnicos);
        } else {
          console.log("Aún no se registra ningún técnico...");
        }
      } catch (error) {
        console.error(
          "Error, no se encontraron técnicos en la base de datos....",
          error
        );
      }
    };
    fetchTecnicos();
  }, []);

  const handleAsignarTecnico = async () => {
    const ordenActualizada = { ...orden, id_empleado: tecnicoSeleccionado };
    const resultado = await modificarOrden(orden.id, ordenActualizada);
    if (resultado) {
      console.log("Técnico asignado con éxito.");
      onUpdateOrden();
    } else {
      console.log("Error al asignar técnico.");
    }
  };
  if (!orden) {
    return <div>Selecciona una orden para ver los detalles</div>;
  }

  const {
    id,
    equipo,
    modelo,
    antiguedad,
    motivo,
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
        for (const repuesto of repuestos) {
          const exito = await guardarRepuestoOrden({
            id_orden: orden.id,
            id_repuesto: repuesto.id,
          });
          if (exito) {
            console.log(
              `Repuesto con ID ${repuesto.id_repuesto} agregado con éxito a la orden.`
            );
          } else {
            console.error(
              `Error al agregar el repuesto con ID ${repuesto.id_repuesto}.`
            );
          }
        }
        onUpdateOrden();
      } else {
        console.log("Error al aprobar la orden.");
      }
    } catch (error) {
      console.error("Error al aprobar la orden:", error);
    }
  };

  const handlePreliminar = async () => {
    try {
      const ordenActualizada = { ...orden, id_tipo_estado: 4 };
      const resultado = await modificarOrden(orden.id, ordenActualizada);
      if (resultado) {
        console.log("Orden preliminar con éxito.");
        onUpdateOrden();
      } else {
        console.log("Error al cambiar estado de la orden.");
      }
    } catch (error) {
      console.error("Error al cambiar estado de la orden:", error);
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

  const handleRedirect = () => {
    navigate("/remitoOrden", { state: { orden } });
  };

  return (
    <div className="contentDetail">
      <div>
        <h1>Orden #{id}</h1>
        <span>Estado: {TiposEstado.tipo_estado}</span>
      </div>
      {orden.Empleado ? (
        <DatosTecnico
          nombre={orden.Empleado.nombre}
          apellido={orden.Empleado.apellido}
          legajo={orden.Empleado.legajo}
        />
      ) : (
        <div>
          <h3>Seleccionar Técnico</h3>
          <select
            onChange={(e) => setTecnicoSeleccionado(e.target.value)}
            value={tecnicoSeleccionado || ""}
          >
            <option value="">Seleccione un técnico</option>
            {tecnicos.map((tecnico) => (
              <option key={tecnico.id} value={tecnico.id}>
                {tecnico.nombre} {tecnico.apellido}
              </option>
            ))}
          </select>
          <button
            onClick={handleAsignarTecnico}
            disabled={!tecnicoSeleccionado}
            className="bg-primary rounded-pill text-white"
            style={{ marginLeft: "1%" }}
          >
            Asignar Técnico
          </button>
        </div>
      )}

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
        diagnostico={motivo}
        estado={TiposEstado.tipo_estado}
        repuestosSeleccionados={repuestos}
        idOrden={orden.id}
      />
      <div className="d-flex justify-content-evenly position-relative">
        {TiposEstado.tipo_estado === "Pendiente" && (
          <div className="orders-btn">
            <button
              className="bg-info rounded-pill text-white"
              onClick={handleDeclinar}
            >
              Declinar
            </button>
            <button
              className="bg-info rounded-pill text-white"
              onClick={handleAprobar}
            >
              Aprobar
            </button>
          </div>
        )}
        {TiposEstado.tipo_estado === "Cancelada" && (
          <div className="orders-btn">
            <button
              className="bg-info rounded-pill text-white"
              onClick={handlePreliminar}
            >
              Preliminar
            </button>
          </div>
        )}
        {TiposEstado.tipo_estado === "Aprobada" && (
          <div className="orders-btn">
            <button
              className="bg-info rounded-pill text-white"
              onClick={handleDeclinar}
            >
              Declinar
            </button>
          </div>
        )}
        {TiposEstado.tipo_estado === "Aprobada" && (
          <div className="orders-btn">
            <button
              className="bg-success rounded-pill text-white"
              onClick={handleRedirect}
            >
              Remito
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

OrdenDetalle.propTypes = {
  orden: PropTypes.shape({
    numero_orden: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    id_tipo_estado: PropTypes.number.isRequired,
    equipo: PropTypes.string.isRequired,
    modelo: PropTypes.string.isRequired,
    antiguedad: PropTypes.number.isRequired,
    diagnostico: PropTypes.string,
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
  onUpdateOrden: PropTypes.func,
};

export default OrdenDetalle;
