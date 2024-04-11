import "./CargarFactura.css";

const CargarFactura = () => {
  return (
    <div>
      <div className="factura-heading">
        <h1>Cargar factura</h1>
      </div>
      <div className="factura-formulario">
        <h2>Cargar factura</h2>
        <form action="">
          <div>
            <h3>Proveedor:</h3>
            <select name="" id="">
              <option value=""></option>
              <option value=""></option>
              <option value=""></option>
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
