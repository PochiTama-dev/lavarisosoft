import Header from "../Header/Header";
import "./Gastos.css";

const Gastos = () => {
  return (
    <div>
      <Header text="Declarar gasto" />
      <div className="gastos-formulario">
        <h2>Declarar gasto</h2>
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
            <h3>Importe:</h3>
            <input type="text" />
          </div>
          <div>
            <h3>Motivo:</h3>
            <input type="text" />
          </div>
          <div>
            <h3>Codigo imp. contable:</h3>
            <input type="text" />
          </div>
          <div>
            <h3>Fecha:</h3>
            <input type="date" />
          </div>
          <div>
            <button type="submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Gastos;
