import React, { useEffect, useState } from "react";
import { listaFacturasVentas } from "../../../services/facturaVentasService";
import { listaFacturasProveedores } from "../../../services/facturaProveedoresService";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const FacturasAFIP = () => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const [ventas, proveedores] = await Promise.all([
          listaFacturasVentas(),
          listaFacturasProveedores(),
        ]);

        const facturasFiltradas = [...ventas, ...proveedores].filter(
          (factura) => factura?.caja === 7
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

  const bufferToBase64 = (buffer) => {
    return btoa(
      new Uint8Array(buffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
  };

  const verFactura = (buffer) => {
    const base64Image = `data:image/jpeg;base64,${bufferToBase64(buffer)}`;
    setSelectedImage(base64Image);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setSelectedImage(null);
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
            <th>Nombre del proveedor</th>
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
              <td>{factura.id}</td>
              <td>{factura.Proveedore?.nombre}</td>
              <td>{factura.domicilio}</td>
              <td>{factura.cuitCuilCdi}</td>
              <td>{factura.importe || factura.total}</td>
              <td>
                {factura.imagen_comprobante ? (
                  <img
                    src={`data:image/png;base64,${bufferToBase64(
                      factura.imagen_comprobante?.data
                    )}`}
                    alt="Ver factura"
                    style={{
                      width: "32px",
                      height: "32px",
                      cursor: "pointer",
                    }}
                    onClick={() => verFactura(factura.imagen_comprobante?.data)}
                  />
                ) : (
                  "No hay imagen disponible"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal
        className="modal-imagen-comprobante"
        show={showModal}
        onHide={cerrarModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Imagen del Comprobante</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Comprobante"
              style={{ width: "100%" }}
            />
          ) : (
            <p>No se pudo cargar la imagen.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FacturasAFIP;
