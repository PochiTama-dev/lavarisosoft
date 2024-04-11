import "./RemitoVentas.css";

const RemitoVentas = () => {
  return (
    <div className="remito-container">
      <div className="ventas-heading">
        <h1>Remito</h1>
      </div>
      <div className="remito-container-content">
        <div className="remito-container-top">
          <div>
            <h2>Remito</h2>
          </div>
          <div>
            <h4>
              No. <strong>#25647</strong>
            </h4>
            <h4>
              Fecha <strong>25/08/2023</strong>
            </h4>
            <h4>
              CUIT <strong>30-7 1188779-9</strong>
            </h4>
            <h4>IVA RESPONSABLE INSCRIPTO</h4>
          </div>
        </div>
        <div className="remito-container-bottom">
          <div>
            <h2>Proveedor</h2>
          </div>
          <div>
            <h4>SALAZAR</h4>
            <h4>
              CUIT <strong>30-7 1188779-9</strong>
            </h4>
          </div>
          <div>
            <h4>Corrientes 654</h4>
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
            stroke-width="5"
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
              <tr>
                <td>10</td>
                <td>1200</td>
                <td>Fuelle de cambio lineal</td>
                <td>$4000</td>
                <td>$40.000</td>
              </tr>
              <tr>
                <td>10</td>
                <td>1200</td>
                <td>Fuelle de cambio lineal</td>
                <td>$4.000</td>
                <td>$40.000</td>
              </tr>
              <tr>
                <td>15</td>
                <td>12013</td>
                <td>Repuesto A</td>
                <td>$7.000</td>
                <td>$105.000</td>
              </tr>
              <tr>
                <td>10</td>
                <td>1263</td>
                <td>Repuesto B</td>
                <td>$2.000</td>
                <td>$20.000</td>
              </tr>
              <tr>
                <td>15</td>
                <td>1296</td>
                <td>Repuesto C</td>
                <td>$2.000</td>
                <td>$30.000</td>
              </tr>
              <tr>
                <td>10</td>
                <td>1245</td>
                <td></td>
                <td>$6.000</td>
                <td>$60.000</td>
              </tr>
            </tbody>
          </table>
          <div className="remito-container-total">
            <h4>
              <strong>Total:</strong>
            </h4>
            <h4> $255.000</h4>
          </div>
          <div className="remito-button-container">
            <button>Imprimir</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemitoVentas;
