import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../Header/Header";
import "./remitoOrden.css";

const RemitoOrden = () => {
  const location = useLocation();
  const { orden } = location.state || {};
  const [mediosDePago, setMediosDePago] = useState([]);
  const [medioDePagoNombre, setMedioDePagoNombre] = useState("");

  useEffect(() => {
    const fetchMediosDePago = async () => {
      try {
        const response = await fetch("https://lv-back.online/opciones/pago");
        const data = await response.json();
        if (data && data.length > 0) {
          setMediosDePago(data);
          // Encontrar el nombre del medio de pago correspondiente
          const medio = data.find((m) => m.id === orden?.Presupuesto?.id_medio_de_pago);
          if (medio) {
            setMedioDePagoNombre(medio.medio_de_pago || "");
          }
        }
      } catch (error) {
        console.error("Error, no se encontraron medios de pago en la base de datos....", error);
      }
    };

    fetchMediosDePago();
  }, [orden?.Presupuesto?.id_medio_de_pago]);

  if (!orden) {
    return <div>No hay datos de orden disponibles.</div>;
  }

  const {
    numero_orden,
    Cliente = {},
    Empleado = {},
    equipo = "",
    modelo = "",
    antiguedad = "",
    diagnostico = "",
    Presupuesto = {}
  } = orden;

  return (
    <div className="remito-container">
      <Header text="Remito" />
      <div className="remito-container-content">
        <div className="remito-container-top">
          <div>
            <h2>Remito</h2>
          </div>
          <div>
            <h4>
              No. <strong>#{numero_orden || ""}</strong>
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
        <div className="remito-container-bottom">
          <div>
            <h2>Cliente</h2>
          </div>
          <div>
            <h4>{Cliente.nombre || ""} {Cliente.apellido || ""}</h4>
            <h4>
              CUIL <strong>{Cliente.cuil || ""}</strong>
            </h4>
          </div>
          <div>
            <h4>{Cliente.direccion || ""}</h4>
          </div>
          <div>
            <h4>{Cliente.ubicacion || ""}</h4>
          </div>
        </div>
        <svg
          width="1829"
          height="5"
          viewBox="0 0 1829 5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="-2.18557e-07"
            y1="2.5"
            x2="1829"
            y2="2.49984"
            stroke="#8EA3BF"
            strokeWidth="5"
          />
        </svg>
        <div className="remito-container-table">
          <div>
            <h2>Detalles de la Orden</h2>
          </div>
          <div className="remito-details">
            <h4><strong>Equipo:</strong> {equipo || ""}</h4>
            <h4><strong>Modelo:</strong> {modelo || ""}</h4>
        
            <h4><strong>Diagnóstico:</strong> {diagnostico || ""}</h4>
          </div>
          <svg
            width="1829"
            height="5"
            viewBox="0 0 1829 5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="-2.18557e-07"
              y1="2.5"
              x2="1829"
              y2="2.49984"
              stroke="#8EA3BF"
              strokeWidth="5"
            />
          </svg>
          <div>
            <h2>Detalles de pago</h2>
            <h4>
              Método de pago <strong>{medioDePagoNombre || ""}</strong>
            </h4>
            <h4>
              TOTAL: <strong>${Presupuesto.total || ""}</strong>
            </h4>
          </div>
          <svg
            width="1829"
            height="5"
            viewBox="0 0 1829 5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="-2.18557e-07"
              y1="2.5"
              x2="1829"
              y2="2.49984"
              stroke="#8EA3BF"
              strokeWidth="5"
            />
          </svg>
          <div className="remito-button-container">
            <button>Imprimir</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemitoOrden;
