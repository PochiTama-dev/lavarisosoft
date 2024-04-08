import "./Proveedores.css";
import Grilla from "../../Grilla/Grilla";
import { Link } from "react-router-dom";

const Proveedores = () => {
  const columnasStock = [
    "Estado",
    "Proveedor",
    "Fecha",
    "Importe",
    "Caja",
    "Op.",
  ];
  const itemsStock = [
    {
      estado: <strong style={{ color: "#40A63D" }}>Pago</strong>,
      proveedor: "SALAZAR",
      fecha: "27/01/2024",
      importe: "$4325",
      caja: 1,
      op: "SALAZAR1234",
      lotes: [
        {
          proveedor: "SALAZAR",
          lote: "17/1/2-SALAZAR1234",
          orden: "N/A",
          unidadRestante: 1,
        },
        {
          proveedor: "SALAZAR",
          lote: "17/1/2-SALAZAR1234",
          orden: "N/A",
          unidadRestante: 1,
        },
      ],
    },
    {
      estado: <strong style={{ color: "#40A63D" }}>Pago</strong>,
      proveedor: "SALAZAR",
      fecha: "27/01/2024",
      importe: "$4325",
      caja: 1,
      op: "SALAZAR1234",
      lotes: [
        {
          proveedor: "SALAZAR",
          lote: "17/1/2-SALAZAR1234",
          orden: "N/A",
          unidadRestante: 1,
        },
      ],
    },
    {
      estado: <strong style={{ color: "#40A63D" }}>Pago</strong>,
      proveedor: "SALAZAR",
      fecha: "27/01/2024",
      importe: "$4325",
      caja: 1,
      op: "SALAZAR1234",
      lotes: [
        {
          proveedor: "SALAZAR",
          lote: "17/1/2-SALAZAR1234",
          orden: "N/A",
          unidadRestante: 1,
        },
      ],
    },
    {
      estado: <strong style={{ color: "#D4674A" }}>Debe</strong>,
      proveedor: "SALAZAR",
      fecha: "27/01/2024",
      importe: "$4325",
      caja: 1,
      op: "SALAZAR1234",
      lotes: [
        {
          proveedor: "SALAZAR",
          lote: "17/1/2-SALAZAR1234",
          orden: "N/A",
          unidadRestante: 1,
        },
      ],
    },
    {
      estado: <strong style={{ color: "#40A63D" }}>Pago</strong>,
      proveedor: "SALAZAR",
      fecha: "27/01/2024",
      importe: "$4325",
      caja: 1,
      op: "SALAZAR1234",
      lotes: [
        {
          proveedor: "SALAZAR",
          lote: "17/1/2-SALAZAR1234",
          orden: "N/A",
          unidadRestante: 1,
        },
      ],
    },
  ];

  return (
    <div className="proveedores-container">
      <div>
        <div className="proveedores-heading mb-4">
          <h1>Pagos a proveedores</h1>
        </div>
        <div className="proveedores-top-box">
          <div>
            <select className="proveedores-select">
              <option value="">Proveedores</option>
              {/* 
            <button className="proveedores-button-arrow">▼</button> */}
            </select>
          </div>
          <div>
            <input
              className="proveedores-input"
              type="text"
              placeholder="dd/mm/aaaa"
            />
            <button className="proveedores-button-search">🔍︎</button>
          </div>

          <div>
            <h4>Saldo pendiente a la fecha: -$6565</h4>
          </div>
        </div>
        <div className="proveedores-button-box">
          <Link to="/cargarFactura">
            <button>Cargar factura</button>
          </Link>
          <Link to="/gastos">
            <button>Cargar gasto</button>
          </Link>
          <Link to="/addLoteExcel">
            <button>Recibir lote</button>
          </Link>
        </div>
      </div>
      <div className="proveedores-excel-wrapper">
        <h2>Pagos efectuados</h2>
        <Grilla columnas={columnasStock} elementos={itemsStock} />
      </div>
    </div>
  );
};

export default Proveedores;
