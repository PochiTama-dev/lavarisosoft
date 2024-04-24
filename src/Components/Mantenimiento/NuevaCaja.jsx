import "./NuevaCaja.css";

const NuevaCaja = () => {
  return (
    <div>
      <div className="nuevaCaja-heading">
        <h1>Cajas y bancos</h1>
      </div>
      <div className="nuevaCaja-formulario">
        <h2>Nueva caja/banco</h2>
        <form action="">
          <div>
            <h3>Descripción:</h3>
            <input type="text" />
            <span className="required">*</span>
          </div>
          <div>
            <h3>Cuenta corriente:</h3>
            <input type="text" />
            <span className="required">*</span>
          </div>
          <div>
            <h3>Saldo inicial:</h3>
            <input type="text" />
          </div>
          <div>
            <h3>Codigo de imp:</h3>
            <input type="text" />
            <span className="required">*</span>
          </div>
          <div>
            <button type="submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevaCaja;
