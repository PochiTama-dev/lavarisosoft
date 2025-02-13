import "./DetalleOrdenPresupuesto.css";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { guardarFacturaVenta } from "../../services/facturaVentasService";

const DetalleOrdenPresupuesto = ({ orden, cajaSeleccionada }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  if (!orden) {
    return <div className="detalle-placeholder">Seleccione una orden</div>;
  }

  const calcularTotalRepuestos = () => {
    if (!orden.repuestos) return 0;
    return orden.repuestos.reduce((total, repuesto) => {
      return total + repuesto.precio * repuesto.cantidad;
    }, 0);
  };

  const handleImprimirFactura = () => {
    navigate("/facturaOrden", { state: { orden } });
  };

  const handleConsolidar = () => {
    console.log("Botón consolidar clickeado");
    setShowModal(true);
    console.log("Estado showModal:", showModal);
  };

  const handleConfirmConsolidar = async () => {
    try {
      const totalStr = orden.Presupuesto?.total || "0";
      const totalNum = Math.round(parseFloat(totalStr) * 100) / 100;

      const facturaData = {
        tipo_comprobante: "FACTURA",
        nro_comprobante: Number(orden.id),
        id_cliente: Number(orden.id_cliente),
        id_caja: Number(cajaSeleccionada?.id),
        cuit_cliente: orden.Cliente?.cuil?.toString() || null,
        descripcion: `Factura orden #${orden.id}`,
        importe: totalNum,
        iva_alicuota: 0.0,
        iva_deb_fiscal: 0.0,
        total: totalNum,
        created_at: new Date().toISOString().split("T")[0],
      };

      console.log("Datos a enviar:", facturaData);
      console.log("Tipo de importe:", typeof facturaData.importe);
      console.log("Valor importe:", facturaData.importe);

      const result = await guardarFacturaVenta(facturaData);

      if (result === true) {
        alert("Factura creada con éxito");
        setShowModal(false);
      } else {
        alert("Error al crear la factura");
      }
    } catch (error) {
      console.error("Error al crear la factura:", error);
      alert("Error al crear la factura");
    }
  };

  console.log("Estado actual showModal:", showModal);
  console.log("Caja seleccionada:", cajaSeleccionada);

  return (
    <div className="detalle-orden-container">
      <div className="detalle-header">
        <h2>Orden #{orden.id}</h2>
        <a className="visualizar-orden">Visualizar orden</a>
      </div>

      <div className="campos-container">
        <div className="campo">
          <label>Seguro:</label>
          <input
            type="text"
            value={orden.Presupuesto?.dpg || "$85790"}
            readOnly
          />
        </div>

        <div className="campo">
          <label>Repuestos:</label>
          <input type="text" value={`${calcularTotalRepuestos()}`} readOnly />
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
            value={orden.Presupuesto?.comision_visita || "$105790"}
            readOnly
          />
        </div>
      </div>

      <div className="d-flex justify-content-around div-botones">
        <button
          className="bg-info rounded-pill py-1 px-4 text-white"
          onClick={() => {
            console.log("Click en consolidar");
            handleConsolidar();
          }}
        >
          Consolidar
        </button>
        <button className="bg-info rounded-pill py-1 px-4 text-white">
          Liq. inmediata
        </button>
        <button
          className="bg-info rounded-pill py-1 px-4 text-white"
          onClick={handleImprimirFactura}
        >
          Imprimir factura
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar Factura</h3>
            <p>¿Desea generar la factura para esta orden?</p>
            <div className="modal-buttons">
              <button
                className="bg-info text-white"
                onClick={handleConfirmConsolidar}
              >
                Confirmar
              </button>
              <button
                className="bg-secondary text-black"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetalleOrdenPresupuesto;
