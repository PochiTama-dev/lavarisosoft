import "./Facturas.css";
import { useEffect, useState } from "react";
import { listaFacturasCompras } from "../../../services/facturaComprasService";
import { listaFacturasVentas } from "../../../services/facturaVentasService";
import { listaFacturasProveedores } from "../../../services/facturaProveedoresService";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import eye from "../../../assets/eye.svg";

const Facturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const [
          // compras,
          ventas,
          // proveedores,
        ] = await Promise.all([
          // listaFacturasCompras(),
          listaFacturasVentas(),
          // listaFacturasProveedores(),
        ]);

        setFacturas([
          // ...compras,
          ...ventas,
          // ...proveedores,
        ]);
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
      <Table>
        <thead>
          <tr>
            <th>Operación</th>
            <th>Fecha</th>
            <th>N° de orden</th>
            <th>Cliente</th>
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
              <td>{factura.descripcion}</td>
              <td>
                {factura.fecha_ingreso || factura.created_at.slice(0, 10)}
              </td>
              <td>#{factura.nro_comprobante || factura.id}</td>
              <td>
                {factura.Cliente
                  ? factura.Cliente.nombre + " " + factura.Cliente?.apellido
                  : "Factura de proveedor"}
              </td>
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

export default Facturas;
