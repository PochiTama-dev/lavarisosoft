const DetalleOrdenPresupuesto = ({ orden, cajaSeleccionada, onCajaSelect }) => {
  if (!orden) {
    return (
      <div className="detalle-placeholder">
        Selecciona una orden para ver los detalles
      </div>
    );
  }

  return (
    <div className="detalle-orden-container">
      <div className="detalle-header">
        <h3>Orden #{orden.numero_orden}</h3>
        <span className="estado-orden">{orden.TiposEstado?.tipo_estado}</span>
      </div>

      <div className="detalle-secciones">
        <section className="seccion-cliente">
          <h4>Datos del Cliente</h4>
          <div className="datos-grid">
            <p>
              <strong>Nombre:</strong> {orden.Cliente?.nombre}{" "}
              {orden.Cliente?.apellido}
            </p>
            <p>
              <strong>CUIL/CUIT:</strong> {orden.Cliente?.cuil}
            </p>
            <p>
              <strong>Teléfono:</strong> {orden.Cliente?.telefono}
            </p>
            <p>
              <strong>Email:</strong> {orden.Cliente?.email}
            </p>
          </div>
        </section>

        <section className="seccion-equipo">
          <h4>Datos del Equipo</h4>
          <div className="datos-grid">
            <p>
              <strong>Equipo:</strong> {orden.equipo}
            </p>
            <p>
              <strong>Marca:</strong> {orden.marca}
            </p>
            <p>
              <strong>Modelo:</strong> {orden.modelo}
            </p>
            <p>
              <strong>Diagnóstico:</strong> {orden.diagnostico}
            </p>
          </div>
        </section>

        <section className="seccion-facturacion">
          <h4>Datos de Facturación</h4>
          <div className="caja-selector">
            <p>
              <strong>Caja Seleccionada:</strong>
            </p>
            {cajaSeleccionada ? (
              <div className="caja-info">
                <span>{cajaSeleccionada.denominacion}</span>
                <button
                  className="btn-generar-factura"
                  onClick={() => onCajaSelect(null)}
                >
                  Cambiar Caja
                </button>
              </div>
            ) : (
              <p className="sin-caja">
                Selecciona una caja para generar la factura
              </p>
            )}
          </div>
          <button className="btn-generar-factura" disabled={!cajaSeleccionada}>
            Generar Factura
          </button>
        </section>
      </div>
    </div>
  );
};

export default DetalleOrdenPresupuesto;
