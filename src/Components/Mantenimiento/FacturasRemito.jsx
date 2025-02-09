import "./FacturasRemito.css";
import Header from "../Header/Header";
import { useLocation } from "react-router-dom";

const FacturasRemito = () => {
  const location = useLocation();
  const { factura } = location.state || {};

  return (
    <div className="remito-container">
      <Header text="Remito Facturas" />
      <div className="remito-container-content">
        <div className="remito-container-top">
          <div>
            <h2>Remito Facturas</h2>
          </div>
          <div>
            <h4>
              No. <strong>#{factura?.nro_comprobante || factura?.id}</strong>
            </h4>
            <h4>
              Fecha{" "}
              <strong>
                {factura?.fecha_ingreso || factura?.created_at.slice(0, 10)}
              </strong>
            </h4>
            <h4>
              CUIT <strong>{factura?.Cliente?.cuil}</strong>
            </h4>
            <h4>IVA RESPONSABLE INSCRIPTO</h4>
          </div>
        </div>
        <div className="remito-container-bottom">
          <div>
            <h2>Cliente</h2>
          </div>
          <div>
            <h4>
              {factura?.Cliente?.nombre} {factura?.Cliente?.apellido}
            </h4>
            <h4>
              CUIT <strong>{factura?.Cliente?.cuil}</strong>
            </h4>
          </div>
          <div>
            <h4>{factura?.Cliente?.direccion}</h4>
          </div>
          <div>
            <h4>(1824) Ciudad de Buenos Aires</h4>
          </div>
        </div>
        <svg
          width="1829"
          height="5"
          viewBox="0 0 1829 5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="-2.18557e-07"
            y1="2.5"
            x2="1829"
            y2="2.49984"
            stroke="#8EA3BF"
            strokeWidth="5"
          />
        </svg>
        <div className="remito-container-table">
          <div>
            <h2>Orden de compra</h2>
          </div>
          <table>
            <thead>
              <tr>
                <th>Cantidad</th>
                <th>Código</th>
                <th>Descripción</th>
                <th>Precio unidad</th>
                <th>Precio total</th>
              </tr>
            </thead>
            <tbody>
              {factura?.productos?.map((producto, index) => (
                <tr key={index}>
                  <td>{producto.cantidad}</td>
                  <td>{producto.codigo}</td>
                  <td>{producto.descripcion}</td>
                  <td>${producto.precio_unitario}</td>
                  <td>${producto.precio_total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="remito-container-total">
            <h4>
              <strong>Total:</strong>
            </h4>
            <h4> ${factura?.total}</h4>
          </div>
          <div className="facturas-remito-button-container">
            <button className="facturas-remito-button">Editar</button>
            <button className="facturas-remito-button">Imprimir</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacturasRemito;
