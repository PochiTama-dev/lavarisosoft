import "./EditProveedor.css";

const EditProveedor = () => {
  return (
    <div>
      <div className="editProveedor-heading">
        <h1>Editar proveedor</h1>
      </div>
      <div className="editProveedor-formulario">
        <h2>Editar proveedor</h2>
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

export default EditProveedor;
