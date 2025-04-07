import "./Facturas.css";
import { useEffect, useState } from "react";
/* import { listaFacturasCompras } from "../../../services/facturaComprasService";
import { listaFacturasProveedores } from "../../../services/facturaProveedoresService"; */
/* import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button"; */
import { listaFacturasVentas } from "../../../services/facturaVentasService";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import eye from "../../../assets/eye.svg";
import Pagination from "react-bootstrap/Pagination";

const Facturas = () => {
  /*   const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null); */
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
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

        const sortedFacturas = [
          // ...compras,
          ...ventas,
          // ...proveedores,
        ].sort((a, b) => new Date(b.fecha_ingreso || b.created_at) - new Date(a.fecha_ingreso || a.created_at));

        setFacturas(sortedFacturas);
      } catch (err) {
        console.error("Error fetching facturas data:", err);
        setError("Hubo un problema al cargar las facturas.");
      } finally {
        setLoading(false);
      }
    };

    fetchFacturas();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFacturas = facturas.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(facturas.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
          {currentFacturas?.map((factura, index) => (
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
      <div className="pagination-container">
        <Pagination>
          {[...Array(totalPages).keys()].map((page) => (
            <Pagination.Item
              key={page + 1}
              active={page + 1 === currentPage}
              onClick={() => handlePageChange(page + 1)}
            >
              {page + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </div>
  );
};

export default Facturas;
