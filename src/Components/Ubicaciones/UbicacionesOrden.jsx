import { useEffect, useState } from "react";
import Header from "../Header/Header";
import { useLocation } from "react-router-dom";
import { ordenes, guardarOrden } from "../../services/ordenesService";

import "./Ubicaciones.css";

const UbicacionesOrden = () => {
  const location = useLocation();
  const { selectedTechnician, selectedClient } = location.state || {};
  const [nroNuevaOrden, setNroNuevaOrden] = useState(0);

  const separarDireccion = (direccion) => {
    if (!direccion || typeof direccion !== "string") {
      return { calle: "", altura: "" };
    }

    const regex = /(.*?)(\d+)\s*$/;
    const match = direccion.match(regex);

    if (match) {
      const calle = match[1].trim();
      const altura = match[2];
      return { calle, altura };
    }

    return { calle: direccion, altura: "" };
  };

  const { calle, altura } = separarDireccion(selectedClient.direccion);

  const fetchOrdenes = async () => {
    try {
      const data = await ordenes();
      if (data.length > 0) {
        console.log(`Se encontraron una lista con ${data.length} ordenes!!`);
        const entries = Object.entries(data);
        const [last] = entries.slice(-1);
        const nroOrden = last[1].id + 1; //Tomo el ultimo id de las ordenes cargadas y le sumo 1
        setNroNuevaOrden(nroOrden);
      } else {
        console.log("Aún no se registra ningúna orden...");
      }
    } catch (error) {
      console.error(
        "Error, no se encontraron ordenes en la base de datos....",
        error
      );
    }
  };

  const handleSubmit = async () => {
    if (selectedClient) {
      const orden = {
        numero_orden: nroNuevaOrden,
        id_cliente: selectedClient.id,
        id_empleado: selectedTechnician.id,
        id_tipo_estado: 4,
        id_tipo_cierre_extendido: null,
        equipo: "",
        marca: "",
        modelo: "",
        antiguedad: 0,
        diagnostico: null,
        motivo: null,
      };
      const ordenGuardada = await guardarOrden(orden);
      console.log("ordenGuardada:", ordenGuardada);
      if (ordenGuardada) {
        alert("Orden guardada con éxito");
        console.log("Orden completa guardada con éxito!!!");
      } else {
        alert("Error al guardar orden");
        console.log("Error al guardar la orden completa...");
      }
    }
  };

  useEffect(() => {
    fetchOrdenes();
  });

  return (
    <div className="ventas-container">
      <Header text="Ubicaciones"></Header>
      <div className="row w-100 p-5 mt-5">
        <h2 className="pt-3 mb-5 mx-4 feedback-containers-heading">
          Confirmar orden no. #{nroNuevaOrden}
        </h2>
        <div className="col-5">
          <div className="container-lists">
            <h2 className="px-3 pt-3 feedback-containers-heading">Cliente</h2>
            <div className="scrollable-container-top">
              <div className="feedback-tecnicos-container align-items-center">
                <h4 className="feedback-tecnicos-heading">
                  {selectedClient.nombre} {selectedClient.apellido}
                </h4>
              </div>
              <div className="feedback-tecnicos-container align-items-center">
                <h4 className="feedback-tecnicos-heading">
                  Teléfono: {selectedClient.telefono}
                </h4>
              </div>
              <div className="feedback-tecnicos-container align-items-center">
                <h4 className="feedback-tecnicos-heading">Calle: {calle}</h4>
              </div>
              <div className="feedback-tecnicos-container align-items-center">
                <h4 className="feedback-tecnicos-heading">Altura: {altura} </h4>
              </div>
              <div className="feedback-tecnicos-container align-items-center">
                <h4 className="feedback-tecnicos-heading">
                  Localidad: {selectedClient.ubicacion}
                </h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-7">
          <div className="container-lists w-100">
            <h2 className="px-3 pt-3 feedback-containers-heading">
              Técnicos a cargo
            </h2>
            <div className="caja-excel">
              <div className="caja-excel-wrapper px-5">
                <table className="table">
                  <tbody>
                    <tr className="row-even">
                      <td>
                        {selectedTechnician.nombre}{" "}
                        {selectedTechnician.apellido}
                      </td>
                      <td>Legajo: {selectedTechnician.legajo}</td>
                      <td>Técnico a domicilio</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <button
            className="bg-info rounded-pill text-white"
            onClick={handleSubmit}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UbicacionesOrden;
