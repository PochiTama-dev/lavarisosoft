import Header from "../../Header/Header";
import "./EditarStockRepuestos.css";

const EditarProducto = () => {
  return (
    <div>
      <Header text="Agregar un repuesto" />

      <div className="stockContainer">
        <h1>Editar un producto</h1>
        <div className="editar-producto-formulario">
          <form action="">
            <div>
              <h3>Nombre:</h3>
              <input type="text" required />
            </div>
            <div>
              <h3>ID:</h3>
              <input type="text" required />
            </div>
            <div>
              <h3>Proveedor</h3>
              <select required>
                <option readOnly>Proovedores</option>
                <option>Proovedor a</option>
                <option>Proovedor b</option>
                <option>Proovedor c</option>
              </select>
            </div>
            <div>
              <h3>Precio:</h3>
              <input type="number" placeholder="0" required />
            </div>

            <div>
              <h3>Cantidad:</h3>
              <input type="text" required />
            </div>

            <div>
              <h3>Orden:</h3>
              <input type="text" />
            </div>
            <div>
              <h3>Fecha lote:</h3>
              <input type="date" required />
            </div>
            <div>
              <button type="submit">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default EditarProducto;
