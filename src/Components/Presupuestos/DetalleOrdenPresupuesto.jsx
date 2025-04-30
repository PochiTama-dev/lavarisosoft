/* eslint-disable react/prop-types */
import "./DetalleOrdenPresupuesto.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { guardarFacturaVenta } from "../../services/facturaVentasService";
import { modificarPresupuesto } from "../../services/presupuestosService";
import { listaCajas, modificarCaja } from "../../services/cajasService";
import { modificarOrden } from "../../services/ordenesService";
import {
  guardarLiquidacionPendiente,
  liquidacionesPendientesPorTecnico,
  actualizarLiquidacionPendiente,
} from "../../services/liquidacionesPendientesService";
import { guardarLiquidacion } from "../../services/liquidacionesService";
import fetchDolarBlue from "../../services/ApiDolarService";

const DetalleOrdenPresupuesto = ({ orden, setOrden, comisiones }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [cajas, setCajas] = useState([]);
  const [cajaSeleccionada, setCajaSeleccionada] = useState(null);
  const [codigoImputacion, setCodigoImputacion] = useState("");
  const [metodoPago, setMetodoPago] = useState({
    efectivo: false,
    banco: false,
    dolares: false,
  });
  const [valoresPago, setValoresPago] = useState({
    efectivo: 0,
    banco: 0,
    dolares: 0,
  });
  const [porcentajePago, setPorcentajePago] = useState(50);
  const [valorDolar, setValorDolar] = useState(0);

  useEffect(() => {
    const fetchCajas = async () => {
      const data = await listaCajas();
      setCajas(data);
    };
    fetchCajas();
  }, []);

  useEffect(() => {
    const cajaPorDefecto = cajas.find((caja) => caja.id === 7);
    if (cajaPorDefecto) {
      setCajaSeleccionada(cajaPorDefecto);
    }
  }, [cajas]);

  useEffect(() => {
    const obtenerValorDolar = async () => {
      const dolar = await fetchDolarBlue();
      setValorDolar(dolar || 0);
    };
    obtenerValorDolar();
  }, []);

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
      cuit_cliente: orden.Cliente?.cuil?.toString(),
      descripcion: `Factura orden #${orden.id}`,
      importe: totalNum,
      iva_alicuota: 0.0,
      iva_deb_fiscal: 0.0,
      total: totalNum,
      created_at: new Date().toISOString().split("T")[0],
      codigo_imputacion: codigoImputacion,
      efectivo: valoresPago.efectivo || 0,
      dolares: valoresPago.dolares || 0,
      transferencia: valoresPago.banco || 0,
    };

    return await guardarFacturaVenta(facturaData);
  };

  const guardarOActualizarLiquidacion = async () => {
    const totalEnPesos = parseFloat(orden.Presupuesto?.total || 0);

    const montoLiquidacion = (totalEnPesos * porcentajePago) / 100;

    const liquidacionData = {
      id_tecnico: orden.id_empleado,
      total: montoLiquidacion,
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

  const handleConfirmConsolidarBase = async (conPago) => {
    try {
      if (!cajaSeleccionada) {
        alert("Debe seleccionar una caja antes de consolidar.");
        return;
      }

      const totalFactura = parseFloat(orden.Presupuesto?.total || 0);

      const sumaMetodosPago =
        valoresPago.efectivo +
        valoresPago.banco +
        valoresPago.dolares * valorDolar;

      if (sumaMetodosPago < totalFactura) {
        alert(
          `La suma de los montos de los métodos de pago (${sumaMetodosPago.toFixed(
            2
          )} ARS) es menor al total (${totalFactura.toFixed(
            2
          )} ARS). Por favor, ajuste los valores.`
        );
        return;
      }

      const facturaResult = await guardarFactura();
      if (!facturaResult) {
        alert("Error al crear la factura.");
        return;
      }

      const ordenActualizada = {
        id_tipo_estado: 3,
      };
      await modificarOrden(orden.id, ordenActualizada);

      const montoTecnico = (totalFactura * porcentajePago) / 100;
      const montoCajaSeleccionada = totalFactura - montoTecnico;

      const montoActualCaja = parseFloat(
        cajaSeleccionada.monto.replace(",", ".") || 0
      );
      const nuevoMontoCaja = montoActualCaja + montoCajaSeleccionada;

      const efectivoActualCaja = parseFloat(cajaSeleccionada.efectivo || 0);
      const bancoActualCaja = parseFloat(cajaSeleccionada.banco || 0);
      const dolaresActualCaja = parseFloat(cajaSeleccionada.dolares || 0);

      const cajaSeleccionadaActualizada = {
        monto: nuevoMontoCaja.toFixed(2),
        efectivo: (efectivoActualCaja + valoresPago.efectivo).toFixed(2),
        banco: (bancoActualCaja + valoresPago.banco).toFixed(2),
        dolares: (
          dolaresActualCaja + parseFloat(valoresPago.dolares || 0)
        ).toFixed(2),
      };

      const cajaSeleccionadaResult = await modificarCaja(
        cajaSeleccionada.id,
        cajaSeleccionadaActualizada
      );
      if (!cajaSeleccionadaResult) {
        alert("Error al actualizar el monto de la caja seleccionada.");
        return;
      }

      // Actualizar la caja 2
      const cajaTecnico = cajas.find((caja) => caja.id === 8);
      if (cajaTecnico) {
        const montoActualTecnico = parseFloat(
          cajaTecnico.monto.replace(",", ".") || 0
        );
        const nuevoMontoTecnico = montoActualTecnico + montoTecnico;

        const efectivoActualTecnico = parseFloat(cajaTecnico.efectivo || 0);
        const bancoActualTecnico = parseFloat(cajaTecnico.banco || 0);
        const dolaresActualTecnico = parseFloat(cajaTecnico.dolares || 0);

        const proporcion = montoTecnico / sumaMetodosPago;

        const efectivoTecnico = (valoresPago.efectivo * proporcion).toFixed(2);
        const bancoTecnico = (valoresPago.banco * proporcion).toFixed(2);
        const dolaresTecnico = (valoresPago.dolares * proporcion).toFixed(2);

        const cajaTecnicoActualizada = {
          monto: nuevoMontoTecnico.toFixed(2),
          efectivo: (
            efectivoActualTecnico + parseFloat(efectivoTecnico)
          ).toFixed(2),
          banco: (bancoActualTecnico + parseFloat(bancoTecnico)).toFixed(2),
          dolares: (dolaresActualTecnico + parseFloat(dolaresTecnico)).toFixed(
            2
          ),
        };

        const cajaTecnicoResult = await modificarCaja(
          cajaTecnico.id,
          cajaTecnicoActualizada
        );
        if (!cajaTecnicoResult) {
          alert("Error al actualizar el monto de la caja del técnico.");
          return;
        }
      } else {
        alert("No se encontró la caja con ID 8.");
        return;
      }
    } catch (error) {
      console.error("Error al consolidar la orden:", error);
      alert("Error al consolidar la orden.");
    }
  };

  const handlePagoTecnico = async () => {
    try {
      const totalFactura = parseFloat(orden.Presupuesto?.total || 0);
      const montoCalculado = (totalFactura * porcentajePago) / 100;

      const sumaMetodosPago =
        valoresPago.efectivo +
        valoresPago.banco +
        valoresPago.dolares * valorDolar;

      if (sumaMetodosPago === 0) {
        alert("Debe ingresar al menos un valor en los métodos de pago.");
        return;
      }

      const proporcion = montoCalculado / sumaMetodosPago;

      const efectivoAjustado = (valoresPago.efectivo * proporcion).toFixed(2);
      const bancoAjustado = (valoresPago.banco * proporcion).toFixed(2);
      const dolaresAjustados = (valoresPago.dolares * proporcion).toFixed(2);

      const response = await guardarLiquidacion({
        id_tecnico: orden.id_empleado,
        monto: montoCalculado.toFixed(2),
        id_caja: 8, // Caja 2
        codigo_imputacion: codigoImputacion,
        efectivo: parseFloat(efectivoAjustado),
        dolares: parseFloat(dolaresAjustados),
        transferencia: parseFloat(bancoAjustado),
        created_at: new Date().toISOString(),
      });

      if (!response) {
        alert("Error al realizar el pago al técnico.");
        return;
      }

      // Actualizo la caja 2
      const cajaTecnico = cajas.find((caja) => caja.id === 8);

      if (cajaTecnico) {
        const montoActualTecnico = parseFloat(
          cajaTecnico.monto.replace(",", ".") || 0
        );
        const nuevoMontoTecnico = montoActualTecnico - montoCalculado;

        const efectivoActualTecnico = parseFloat(cajaTecnico.efectivo || 0);
        const bancoActualTecnico = parseFloat(cajaTecnico.banco || 0);
        const dolaresActualTecnico = parseFloat(cajaTecnico.dolares || 0);

        const cajaTecnicoActualizada = {
          monto: nuevoMontoTecnico.toFixed(2),
          efectivo: efectivoActualTecnico.toFixed(2),
          banco: bancoActualTecnico.toFixed(2),
          dolares: dolaresActualTecnico.toFixed(2),
        };

        if (
          cajaTecnicoActualizada.monto < 0 ||
          cajaTecnicoActualizada.efectivo < 0 ||
          cajaTecnicoActualizada.banco < 0 ||
          cajaTecnicoActualizada.dolares < 0
        ) {
          alert(
            "Error: No se puede realizar el pago porque los valores de la caja quedarían en negativo."
          );
          return;
        }

        const cajaTecnicoResult = await modificarCaja(
          cajaTecnico.id,
          cajaTecnicoActualizada
        );

        if (!cajaTecnicoResult) {
          alert("Error al actualizar el monto de la caja del técnico.");
          return;
        }
      } else {
        alert("No se encontró la caja con ID 8.");
        return;
      }

      alert(
        `Pago al técnico realizado con éxito. Monto: $${montoCalculado.toFixed(
          2
        )}`
      );
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Error al realizar el pago al técnico:", error);
      alert("Error al realizar el pago al técnico.");
    }
  };

  const handleLiquidacionPendiente = async () => {
    try {
      const totalFactura = parseFloat(orden.Presupuesto?.total || 0);

      const montoTecnico = parseFloat(
        ((totalFactura * porcentajePago) / 100).toFixed(2)
      );

      const liquidaciones = await liquidacionesPendientesPorTecnico(
        orden.id_empleado
      );

      if (liquidaciones && liquidaciones.length > 0) {
        const liquidacionExistente = liquidaciones[0];

        const totalExistente = parseFloat(liquidacionExistente.total || 0);

        const nuevoTotal = parseFloat(
          (totalExistente + montoTecnico).toFixed(2)
        );

        const response = await actualizarLiquidacionPendiente(
          liquidacionExistente.id,
          {
            total: nuevoTotal,
          }
        );

        if (!response) {
          console.error("Error al actualizar la liquidación pendiente.");
          alert("Error al actualizar la liquidación pendiente.");
          return;
        }
      } else {
        const response = await guardarLiquidacionPendiente({
          id_tecnico: orden.id_empleado,
          total: montoTecnico,
        });

        if (!response) {
          console.error("Error al crear la liquidación pendiente.");
          alert("Error al crear la liquidación pendiente.");
          return;
        }
      }

      alert("Liquidación pendiente actualizada con éxito.");
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Error al manejar la liquidación pendiente:", error);
      alert("Error al manejar la liquidación pendiente.");
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

  const handleCancelEdit = () => {
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

  const handleMetodoPagoChange = (metodo) => {
    const totalFactura = parseFloat(orden.Presupuesto?.total || 0);
    const nuevosMetodos = {
      ...metodoPago,
      [metodo]: !metodoPago[metodo],
    };

    setMetodoPago(nuevosMetodos);

    const metodosSeleccionados = Object.keys(nuevosMetodos).filter(
      (key) => nuevosMetodos[key]
    );

    if (metodosSeleccionados.length === 1) {
      const nuevoValoresPago = {
        efectivo: 0,
        banco: 0,
        dolares: 0,
      };

      if (metodo === "dolares" && valorDolar > 0) {
        // Convertir el total de pesos a dólares
        nuevoValoresPago.dolares = (totalFactura / valorDolar).toFixed(2);
      } else {
        nuevoValoresPago[metodosSeleccionados[0]] = totalFactura;
      }

      setValoresPago(nuevoValoresPago);
    } else {
      setValoresPago({
        efectivo: 0,
        banco: 0,
        dolares: 0,
      });
    }
  };

  const handleValorPagoChange = (metodo, valor) => {
    const totalFactura = parseFloat(orden.Presupuesto?.total || 0);
    const nuevoValor = parseFloat(valor) || 0;

    const sumaOtros = Object.keys(valoresPago)
      .filter((key) => key !== metodo)
      .reduce((acc, key) => acc + valoresPago[key], 0);

    if (nuevoValor + sumaOtros > totalFactura) {
      alert("La suma de Efectivo, Banco y Dólares no puede exceder el total.");
      return;
    }

    setValoresPago((prev) => ({
      ...prev,
      [metodo]: nuevoValor,
    }));
  };

  const convertirAPesos = (valorEnDolares) => {
    return (valorEnDolares * valorDolar).toFixed(2);
  };

  return (
    <div className="detalle-orden-container">
      <div className="detalle-header">
        <h2>Orden #{orden.id}</h2>
        <a className="visualizar-orden">Visualizar orden</a>
      </div>

      <div className="campos-container">
        {renderInput("Seguro", orden.Presupuesto?.dpg || 0, "dpg")}
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

        {renderInput("Total", orden.Presupuesto?.total || 0, "total")}

        <div className="campo">
          <label>Porcentaje de Pago al Técnico:</label>
          <div className="input-container">
            <input
              type="number"
              value={porcentajePago}
              min="0"
              max="100"
              onChange={(e) => setPorcentajePago(e.target.value)}
            />
            <span>%</span>
          </div>
        </div>
        <div className="campo">
          <label>Código de Imputación:</label>
          <input
            type="text"
            value={codigoImputacion}
            onChange={(e) => setCodigoImputacion(e.target.value)}
          />
        </div>

        <div className="campo">
          <label>Método de Pago:</label>
          <div className="metodo-pago-container">
            <label>
              <input
                type="checkbox"
                checked={metodoPago.efectivo}
                onChange={() => handleMetodoPagoChange("efectivo")}
              />
              Efectivo
            </label>
            <label>
              <input
                type="checkbox"
                checked={metodoPago.banco}
                onChange={() => handleMetodoPagoChange("banco")}
              />
              Banco
            </label>
            <label>
              <input
                type="checkbox"
                checked={metodoPago.dolares}
                onChange={() => handleMetodoPagoChange("dolares")}
              />
              Dólares
            </label>
          </div>
        </div>

        {metodoPago.efectivo && (
          <div className="campo">
            <label>Efectivo:</label>
            <input
              type="number"
              value={valoresPago.efectivo}
              onFocus={(e) => {
                if (e.target.value === "0") e.target.value = "";
              }}
              onBlur={(e) => {
                if (e.target.value === "") e.target.value = "0";
              }}
              onChange={(e) =>
                handleValorPagoChange("efectivo", e.target.value)
              }
            />
          </div>
        )}

        {metodoPago.banco && (
          <div className="campo">
            <label>Banco:</label>
            <input
              type="number"
              value={valoresPago.banco}
              onFocus={(e) => {
                if (e.target.value === "0") e.target.value = "";
              }}
              onBlur={(e) => {
                if (e.target.value === "") e.target.value = "0";
              }}
              onChange={(e) => handleValorPagoChange("banco", e.target.value)}
            />
          </div>
        )}

        {metodoPago.dolares && (
          <div className="campo">
            <label>Dólares:</label>
            <input
              type="number"
              value={valoresPago.dolares}
              onFocus={(e) => {
                if (e.target.value === "0") e.target.value = "";
              }}
              onBlur={(e) => {
                if (e.target.value === "") e.target.value = "0";
              }}
              onChange={(e) => handleValorPagoChange("dolares", e.target.value)}
            />
            <span>(≈ ${convertirAPesos(valoresPago.dolares)} ARS)</span>
          </div>
        )}

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
        {/* 
        {renderInput(
          "Técnico domicilio",
          orden.Presupuesto?.comision_visita || 0,
          "comision_visita"
        )} */}
      </div>

      <div className="d-flex justify-content-around div-botones">
        <button
          className={`bg-info rounded-pill py-1 px-4 text-white ${
            !cajaSeleccionada ? "disabled" : ""
          }`}
          onClick={() => {
            handleConfirmConsolidarBase();
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
                onClick={handlePagoTecnico}
              >
                Confirmar CON Pago al Técnico
              </button>
              <button
                className="bg-info text-white"
                onClick={handleLiquidacionPendiente}
              >
                Confirmar SIN Pago al Técnico
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
