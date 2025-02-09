import "./DetalleOrdenPresupuesto.css";

const DetalleOrdenPresupuesto = ({ orden, cajaSeleccionada }) => {
  if (!orden) {
    return <div className="detalle-placeholder">Seleccione una orden</div>;
  }

  return (
    <div className="detalle-orden-container">
      <div className="detalle-header">
        <h2>Orden #{orden.numero_orden}</h2>
        <a className="visualizar-orden">Visualizar orden</a>
      </div>

      <div className="campos-container">
        <div className="campo">
          <label>Servicio:</label>
          <input type="text" value={orden.servicio || "$85790"} readOnly />
        </div>

        <div className="campo">
          <label>Repuestos:</label>
          <input type="text" value={orden.repuestos || "$20000"} readOnly />
        </div>

        <div className="campo">
          <label>Viáticos:</label>
          <input
            type="text"
            value={orden.Presupuesto?.viaticos || "$400"}
            readOnly
          />
        </div>

        <div className="separador"></div>

        <div className="campo">
          <label>Total:</label>
          <input
            type="text"
            value={orden.Presupuesto?.total || "$105790"}
            readOnly
          />
        </div>

        <div className="campo">
          <label>
            {cajaSeleccionada?.denominacion ? "Caja:" : "Seleccionar una caja"}
          </label>
          <input
            type="text"
            value={cajaSeleccionada?.denominacion || ""}
            readOnly
          />
        </div>

        <div className="campo">
          <label>Código de imp.:</label>
          <input type="text" value={orden.codigo_imp || "1.111.111"} readOnly />
        </div>

        <div className="campo">
          <label>Técnico domicilio:</label>
          <input
            type="text"
            value={orden.tecnico_domicilio || "$105790"}
            readOnly
          />
        </div>

        <div className="campo">
          <label>Técnico taller:</label>
          <input
            type="text"
            value={orden.tecnico_taller || "$84632"}
            readOnly
          />
        </div>

        <div className="campo">
          <label>Técnico entrega:</label>
          <input
            type="text"
            value={orden.tecnico_entrega || "$5631"}
            readOnly
          />
        </div>
      </div>

      <div className="d-flex justify-content-between div-botones">
        <button className="bg-info rounded-pill py-1 px-4 text-white">
          Consolidar
        </button>
        <button className="bg-info rounded-pill py-1 px-4 text-white">
          Liq. inmediata
        </button>
        <button className="bg-info rounded-pill py-1 px-4 text-white">
          Imprimir factura
        </button>
      </div>
    </div>
  );
};

export default DetalleOrdenPresupuesto;
