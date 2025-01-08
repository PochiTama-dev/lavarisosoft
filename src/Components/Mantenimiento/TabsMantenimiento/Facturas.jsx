import React from "react";
import Table from "react-bootstrap/Table";
import datosFacturas from "./DatosFacturas";
import "./Facturas.css";

const Facturas = () => {
  return (
    <div className="facturas-ctn">
      <Table striped hover>
        <thead>
          <tr>
            <th>Operacion</th>
            <th>N° de orden</th>
            <th>Técnico D.</th>
            <th>Técnico T.</th>
            <th>Cliente</th>
            <th>Monto</th>
            <th>Medio de pago</th>
            <th>Factura</th>
          </tr>
        </thead>
        <tbody>
          {datosFacturas.map((factura, index) => (
            <tr key={index}>
              <td>{factura.operacion}</td>
              <td>{factura.numeroOrden}</td>
              <td>{factura.tecnicoD}</td>
              <td>{factura.tecnicoT}</td>
              <td>{factura.cliente}</td>
              <td>{factura.monto}</td>
              <td>{factura.medioPago}</td>
              <td>
                <img
                  src={factura.icon}
                  alt="Ver factura"
                  style={{ width: "24px", height: "24px", cursor: "pointer" }}
                  onClick={() => verFactura(factura.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Facturas;
