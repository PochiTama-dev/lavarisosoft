import "./Gastos.css";

const Gastos = () => {
  return (
    <div>
      <div className="gastos-heading">
        <h1>Declarar gasto</h1>
      </div>
      <div className="gastos-formulario">
        <h2>Declarar gasto</h2>
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
