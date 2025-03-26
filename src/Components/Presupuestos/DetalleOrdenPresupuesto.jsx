import "./DetalleOrdenPresupuesto.css";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { guardarFacturaVenta } from "../../services/facturaVentasService";
import { modificarPresupuesto } from "../../services/presupuestosService";
import { listaCajas } from "../../services/cajasService";
import {
  guardarLiquidacionPendiente,
  liquidacionesPendientesPorTecnico,
  actualizarLiquidacionPendiente,
} from "../../services/liquidacionesPendientesService";

const DetalleOrdenPresupuesto = ({ orden, setOrden, comisiones }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [cajas, setCajas] = useState([]);
  const [cajaSeleccionada, setCajaSeleccionada] = useState(null);

  useEffect(() => {
    const fetchCajas = async () => {
      const data = await listaCajas();
      setCajas(data);
    };
    fetchCajas();
  }, []);

  useEffect(() => {
    setCajaSeleccionada(null);
  }, [orden]);

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
    setShowModal(true);
  };

  const guardarFactura = async () => {
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

    return await guardarFacturaVenta(facturaData);
  };

  const guardarOActualizarLiquidacion = async () => {
    const liquidacionData = {
      id_tecnico: orden.id_empleado,
      total: parseFloat(orden.Presupuesto?.comision_visita || 0),
    };

    const liquidaciones = await liquidacionesPendientesPorTecnico(
      orden.id_empleado
    );

    if (liquidaciones && liquidaciones.length > 0) {
      const liquidacionExistente = liquidaciones[0];
      const nuevoTotal =
        parseFloat(liquidacionExistente.total) + liquidacionData.total;
      return await actualizarLiquidacionPendiente(liquidacionExistente.id, {
        total: nuevoTotal,
      });
    } else {
      return await guardarLiquidacionPendiente(liquidacionData);
    }
  };

  const handleConfirmConsolidar = async () => {
    try {
      const facturaResult = await guardarFactura();

      if (facturaResult === true) {
        const liquidacionResult = await guardarOActualizarLiquidacion();
        if (liquidacionResult) {
          alert("Factura y liquidación creadas/actualizadas con éxito");
          setOrden(null);
        } else {
          alert("Error al crear/actualizar la liquidación");
        }
      } else {
        alert("Error al crear la factura");
      }
    } catch (error) {
      console.error("Error al crear la factura o liquidación:", error);
      alert("Error al crear la factura o liquidación");
    } finally {
      setShowModal(false);
    }
  };

  const handleEdit = (field, value) => {
    setEditingField(field);
    setEditValues({ ...editValues, [field]: value });
  };

  const handleSaveEdit = async (field) => {
    try {
      let valorAEnviar = editValues[field];
      if (
        field === "viaticos" ||
        field === "total" ||
        field === "dpg" ||
        field === "monto_pagado"
      ) {
        valorAEnviar = parseFloat(editValues[field]);
        if (isNaN(valorAEnviar)) {
          alert("Por favor ingrese un valor numérico válido");
          return;
        }
        if (
          field === "monto_pagado" &&
          valorAEnviar > parseFloat(orden.Presupuesto?.total || "0")
        ) {
          alert("El monto pagado no puede ser mayor que el total");
          return;
        }
      }

      const presupuestoActualizado = {
        [field]: valorAEnviar,
      };

      const result = await modificarPresupuesto(
        orden.Presupuesto.id,
        presupuestoActualizado
      );

      if (result) {
        alert("Presupuesto actualizado con éxito");
        setEditingField(null);
        setEditValues({});
        window.location.reload();
      } else {
        alert("Error al actualizar el presupuesto");
        setEditingField(null);
        setEditValues({});
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al guardar los cambios");
      setEditingField(null);
      setEditValues({});
    }
  };

  const handleCancelEdit = (field) => {
    setEditingField(null);
    setEditValues({});
  };

  const renderInput = (label, value, field) => {
    if (
      [
        "repuestos",
        "viaticos",
        "descuentos_referidos",
        "comision_reparacion",
        "comision_entrega",
        "gasto_impositivo",
      ].includes(field) &&
      !comisiones[label]
    ) {
      return null;
    }

    return (
      <div className="campo">
        <label>{label}:</label>
        <div className="input-container">
          {editingField === field ? (
            <>
              <input
                type="text"
                value={editValues[field] || value}
                onChange={(e) =>
                  setEditValues({
                    ...editValues,
                    [field]: e.target.value,
                  })
                }
              />
              <button
                onClick={() => handleSaveEdit(field)}
                style={{
                  backgroundColor: "transparent",
                  color: "#69688c",
                  border: "1px solid #69688c",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                ✓
              </button>
              <button
                onClick={() => handleCancelEdit(field)}
                style={{
                  backgroundColor: "transparent",
                  color: "red",
                  border: "1px solid red",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                ✕
              </button>
            </>
          ) : (
            <>
              <input type="text" value={value} readOnly />
              <button
                onClick={() => handleEdit(field, value)}
                style={{
                  backgroundColor: "transparent",
                  color: "#69688c",
                  border: "1px solid #69688c",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                ✎
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="detalle-orden-container">
      <div className="detalle-header">
        <h2>Orden #{orden.id}</h2>
        <a className="visualizar-orden">Visualizar orden</a>
      </div>

      <div className="campos-container">
        {renderInput("Seguro", orden.Presupuesto?.dpg || "$85790", "dpg")}
        {renderInput("Repuestos", calcularTotalRepuestos(), "repuestos")}
        {renderInput(
          "Viáticos",
          orden.Presupuesto?.viaticos || "$400",
          "viaticos"
        )}

        {renderInput(
          "Descuento referidos",
          orden.Presupuesto?.descuentos_referidos || "0%",
          "descuentos_referidos"
        )}
        {renderInput(
          "Comisión reparación",
          orden.Presupuesto?.comision_reparacion || "0",
          "comision_reparacion"
        )}
        {renderInput(
          "Comisión entrega",
          orden.Presupuesto?.comision_entrega || "0",
          "comision_entrega"
        )}
        {renderInput(
          "Gasto impositivo",
          orden.Presupuesto?.gasto_impositivo || "0",
          "gasto_impositivo"
        )}

        <div className="separador"></div>

        {renderInput("Total", orden.Presupuesto?.total || "$105790", "total")}

        <div className="campo">
          <label>
            {cajaSeleccionada?.denominacion ? "Caja:" : "Seleccionar una caja"}
          </label>
          <select
            value={cajaSeleccionada?.id || ""}
            onChange={(e) => {
              const selectedCaja = cajas.find(
                (caja) => caja.id === parseInt(e.target.value)
              );
              setCajaSeleccionada(selectedCaja);
            }}
            required
          >
            <option value="" disabled>
              Seleccione una caja
            </option>
            {cajas.map((caja) => (
              <option key={caja.id} value={caja.id}>
                {caja.denominacion}
              </option>
            ))}
          </select>
        </div>
        {renderInput(
          "Técnico domicilio",
          orden.Presupuesto?.comision_visita || "$105790",
          "comision_visita"
        )}
        {renderInput(
          "Monto pagado",
          orden.Presupuesto?.monto_pagado || "0",
          "monto_pagado"
        )}
      </div>

      <div className="d-flex justify-content-around div-botones">
        <button
          className={`bg-info rounded-pill py-1 px-4 text-white ${
            !cajaSeleccionada ? "disabled" : ""
          }`}
          onClick={() => {
            handleConsolidar();
          }}
          disabled={!cajaSeleccionada}
        >
          Consolidar
        </button>
        <button
          className="bg-info rounded-pill py-1 px-4 text-white"
          onClick={handleImprimirFactura}
        >
          Imprimir factura
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay-presupuesto">
          <div className="modal-content-presupuesto">
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
