import React, { useEffect, useState } from "react";
import { listaFacturasVentas } from "../../../services/facturaVentasService";
import { listaFacturasProveedores } from "../../../services/facturaProveedoresService";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import eye from "../../../assets/eye.svg";

const FacturasAFIP = () => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  /*Lo dejo armado así por si se tienen que agregar más fetch de otras tablas de facturas*/
  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const [facturas] = await Promise.all([listaFacturasVentas()]);

        const facturasFiltradas = [...facturas].filter(
          (factura) => factura?.id_caja === 7
        );

        setFacturas(facturasFiltradas);
      } catch (err) {
        console.error("Error fetching facturas data:", err);
        setError("Hubo un problema al cargar las facturas.");
      } finally {
        setLoading(false);
      }
    };

    fetchFacturas();
  }, []);

  const verFactura = (factura) => {
    navigate("/facturasremito", { state: { factura } });
  };

  if (loading) {
    return <div className="facturas-ctn">Cargando facturas...</div>;
  }

  if (error) {
    return <div className="facturas-ctn">{error}</div>;
  }

  return (
    <div className="facturas-ctn">
      <Table striped hover>
        <thead>
          <tr>
            <th>N° de orden</th>
            <th>Domicilio</th>
            <th>CUIT/CUIL/CDI</th>
            <th>Monto</th>
            <th>Factura</th>
          </tr>
        </thead>
        <tbody>
          {facturas?.map((factura, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "row-even" : "row-white"}
            >
              <td>#{factura.nro_comprobante || factura.id}</td>
              <td>{factura.Cliente?.direccion}</td>
              <td>{factura.Cliente?.cuil}</td>
              <td>{factura.total}</td>
              <td>
                <img
                  src={eye}
                  alt="Ver factura"
                  style={{
                    width: "32px",
                    height: "32px",
                    cursor: "pointer",
                  }}
                  onClick={() => verFactura(factura)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default FacturasAFIP;
