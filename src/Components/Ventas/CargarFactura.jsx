import Header from "../Header/Header";
import "./CargarFactura.css";

const CargarFactura = () => {
  return (
    <div>
      <Header text="Cargar factura" />
      <div className="factura-formulario">
        <h2>Cargar factura</h2>
        <form action="">
          <div>
            <h3>Proveedor:</h3>
            <select required>
              <option readOnly>Proveedor</option>
              <option value="">Proveedor A</option>
              <option value="">Proveedor B</option>
              <option value="">Proveedor C</option>
            </select>
          </div>
          <div>
            <h3>Repuesto:</h3>
            <input type="text" />
          </div>
          <div>
            <h3>Cantidad:</h3>
            <input type="number" placeholder="0" />
          </div>
          <div>
            <h3>Importe:</h3>
            <input type="text" />
          </div>
          <div>
            <h3>Cod. imputación:</h3>
            <input type="text" />
          </div>
          <div>
            <h3>Fecha:</h3>
            <input type="date" />
          </div>
          <div>
            <h3>Factura:</h3>
            <input type="file" />
          </div>
          <div>
            <button type="submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CargarFactura;
