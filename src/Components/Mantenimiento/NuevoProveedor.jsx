import Header from "../Header/Header";
import "./NuevoProveedor.css";

const NuevoProveedor = () => {
  return (
    <div>
      <Header text="Nuevo proveedor" />
      <div className="nuevoProveedor-formulario">
        <h2>Nuevo proveedor</h2>
        <form action="">
          <div>
            <h3>Nombre:</h3>
            <input type="text" />
          </div>
          <div>
            <h3>Motivo:</h3>
            <input type="text" />
          </div>
          <div>
            <h3>Fecha de ingreso:</h3>
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

export default NuevoProveedor;
