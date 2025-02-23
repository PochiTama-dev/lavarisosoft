import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../Header/Header";
import "./FacturaOrden.css";
import { opcionesPago } from "../../services/opcionesPagoService";

const FacturaOrden = () => {
  const location = useLocation();
  const { orden } = location.state || {};
  const [mediosDePago, setMediosDePago] = useState([]);
  const [medioDePagoNombre, setMedioDePagoNombre] = useState("");
  const [editableValues, setEditableValues] = useState({
    dpg: orden?.Presupuesto?.dpg || "0",
    viaticos: orden?.Presupuesto?.viaticos || "0",
    comision_visita: orden?.Presupuesto?.comision_visita || "0",
    repuestos:
      orden?.repuestos?.map((r) => ({
        ...r,
        precio: r.precio,
      })) || [],
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchMediosDePago = async () => {
      try {
        const data = await opcionesPago();
        if (data && data.length > 0) {
          setMediosDePago(data);
          const medio = data.find(
            (m) => m.id === orden?.Presupuesto?.id_medio_de_pago
          );
          if (medio) {
            setMedioDePagoNombre(medio.medio_de_pago || "");
          }
        }
      } catch (error) {
        console.error("Error al cargar medios de pago:", error);
      }
    };

    fetchMediosDePago();
  }, [orden?.Presupuesto?.id_medio_de_pago]);

  if (!orden) {
    return <div>No hay datos de factura disponibles.</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleValueChange = (field, value) => {
    setEditableValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRepuestoPriceChange = (repuestoId, newPrice) => {
    setEditableValues((prev) => ({
      ...prev,
      repuestos: prev.repuestos.map((r) =>
        r.id === repuestoId ? { ...r, precio: newPrice } : r
      ),
    }));
  };

  const calcularTotalRepuestos = () => {
    if (!editableValues.repuestos) return 0;
    return editableValues.repuestos.reduce((total, repuesto) => {
      return total + parseFloat(repuesto.precio) * repuesto.cantidad;
    }, 0);
  };

  const calcularTotal = () => {
    const total =
      parseFloat(editableValues.dpg) +
      parseFloat(editableValues.viaticos) +
      parseFloat(editableValues.comision_visita) +
      calcularTotalRepuestos();
    return total.toFixed(2);
  };

  return (
    <div className="factura-container">
      <Header text="Factura" />
      <div className="factura-container-content">
        <div className="factura-container-top">
          <div>
            <h4>
              No. <strong>#{orden.id || ""}</strong>
            </h4>
            <h4>
              Fecha <strong>{new Date().toLocaleDateString()}</strong>
            </h4>
            <h4>
              CUIT <strong>30-7 1188779-9</strong>
            </h4>
            <h4>IVA RESPONSABLE INSCRIPTO</h4>
          </div>
        </div>

        <div className="factura-container-bottom">
          <div>
            <h2>Cliente</h2>
          </div>
          <div>
            <h4>
              {orden.Cliente?.nombre || ""} {orden.Cliente?.apellido || ""}
            </h4>
            <h4>
              CUIL <strong>{orden.Cliente?.cuil || ""}</strong>
            </h4>
            <h4>{orden.Cliente?.direccion || ""}</h4>
          </div>
        </div>

        <div className="factura-container-detalles">
          <h2>Detalles de la Orden</h2>
          <div className="detalles-grid">
            <div className="detalle-item">
              <h4>Seguro:</h4>
              {isEditing ? (
                <input
                  type="number"
                  value={editableValues.dpg}
                  onChange={(e) => handleValueChange("dpg", e.target.value)}
                  className="editable-input"
                />
              ) : (
                <p>${editableValues.dpg}</p>
              )}
            </div>
            <div className="detalle-item">
              <h4>Viáticos:</h4>
              {isEditing ? (
                <input
                  type="number"
                  value={editableValues.viaticos}
                  onChange={(e) =>
                    handleValueChange("viaticos", e.target.value)
                  }
                  className="editable-input"
                />
              ) : (
                <p>${editableValues.viaticos}</p>
              )}
            </div>
            <div className="detalle-item">
              <h4>Comisión visita:</h4>
              {isEditing ? (
                <input
                  type="number"
                  value={editableValues.comision_visita}
                  onChange={(e) =>
                    handleValueChange("comision_visita", e.target.value)
                  }
                  className="editable-input"
                />
              ) : (
                <p>${editableValues.comision_visita}</p>
              )}
            </div>
          </div>

          {editableValues.repuestos && editableValues.repuestos.length > 0 && (
            <div className="repuestos-section">
              <h3>Repuestos</h3>
              <table>
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Precio Unit.</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {editableValues.repuestos.map((repuesto) => (
                    <tr key={repuesto.id}>
                      <td>{repuesto.nombre}</td>
                      <td>{repuesto.cantidad}</td>
                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            value={repuesto.precio}
                            onChange={(e) =>
                              handleRepuestoPriceChange(
                                repuesto.id,
                                e.target.value
                              )
                            }
                            className="editable-input"
                          />
                        ) : (
                          `$${repuesto.precio}`
                        )}
                      </td>
                      <td>
                        ${(repuesto.precio * repuesto.cantidad).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="factura-totales">
            <div className="total-item">
              <h4>Subtotal Repuestos:</h4>
              <p>${calcularTotalRepuestos().toFixed(2)}</p>
            </div>
            <div className="total-item">
              <h4>Método de pago:</h4>
              <p>{medioDePagoNombre}</p>
            </div>
            <div className="total-item total-final">
              <h4>TOTAL:</h4>
              <p>${calcularTotal()}</p>
            </div>
          </div>
        </div>

        <div className="factura-button-container">
          <button onClick={handleEdit}>
            {isEditing ? "Guardar" : "Editar"}
          </button>
          <button onClick={handlePrint}>Imprimir</button>
        </div>
      </div>
    </div>
  );
};

export default FacturaOrden;
