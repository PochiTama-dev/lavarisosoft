import Header from "../Header/Header";
import { useLocation } from "react-router-dom";

import "./Ubicaciones.css";

const UbicacionesOrden = () => {
  const location = useLocation();
  const { selectedTechnician, selectedClient } = location.state || {};

  const separarDireccion = (direccion) => {
    const partes = direccion.split(" ");
    const altura = partes.pop();
    const calle = partes.join(" ");
    return { calle, altura };
  };

  const { calle, altura } = separarDireccion(selectedClient.direccion);

  return (
    <div className="ventas-container">
      <Header text="Ubicaciones"></Header>
      <div className="row w-100 p-5 mt-5">
        <h2 className="pt-3 mb-5 mx-4 feedback-containers-heading">
          Confirmar orden no. #{selectedClient.Ordenes[0]?.id}
        </h2>
        <div className="col-5">
          <div className="container-lists">
            <h2 className="px-3 pt-3 feedback-containers-heading">Cliente</h2>
            <div className="scrollable-container-top">
              <div className="feedback-tecnicos-container align-items-center">
                <h4 className="feedback-tecnicos-heading">{selectedClient.nombre} {selectedClient.apellido}</h4>
              </div>
              <div className="feedback-tecnicos-container align-items-center">
                <h4 className="feedback-tecnicos-heading">
                  Teléfono: {selectedClient.telefono}
                </h4>
              </div>
              <div className="feedback-tecnicos-container align-items-center">
                <h4 className="feedback-tecnicos-heading">
                  Calle: {calle}
                </h4>
              </div>
              <div className="feedback-tecnicos-container align-items-center">
                <h4 className="feedback-tecnicos-heading">Altura: {altura} </h4>
              </div>
              <div className="feedback-tecnicos-container align-items-center">
                <h4 className="feedback-tecnicos-heading">Localidad: {selectedClient.ubicacion}</h4>
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
                      <td>{selectedTechnician.nombre} {selectedTechnician.apellido}</td>
                      <td>Legajo: {selectedTechnician.legajo}</td>
                      <td>Técnico a domicilio</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UbicacionesOrden;
