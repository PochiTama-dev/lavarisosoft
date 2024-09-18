import "./Proveedores.css";
import Grilla from "../../Grilla/Grilla";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

const Proveedores = () => {
  const [proveedoresData, setProveedoresData] = useState([]);
  const [loading, setLoading] = useState(true);
  const proveedoresDb = async () => {
    try {
      const response = await fetch("https://lv-back.online/facturas/lista");
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    const fetchProveedoresData = async () => {
      try {
        const data = await proveedoresDb();
        setProveedoresData(data);
      } catch (error) {
        console.error("Error fetching proveedores data:", error);
        setProveedoresData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProveedoresData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

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
          entrego: "Entregó",
          numero: <strong>2</strong>,
          unidades: "unidades de",
          repuesto: <strong>Repuesto A</strong>,
          precio: "Precio por unidad:",
          unidad: <strong>$2000</strong>,
        },
        {
          entrego: "Entregó",
          numero: <strong>5</strong>,
          unidades: "unidades de",
          repuesto: <strong>Repuesto B</strong>,
          precio: "Precio por unidad:",
          unidad: <strong>$465</strong>,
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
          entrego: "Entregó",
          numero: <strong>2</strong>,
          unidades: "unidades de",
          repuesto: <strong>Repuesto A</strong>,
          precio: "Precio por unidad:",
          unidad: <strong>$2000</strong>,
        },
        {
          entrego: "Entregó",
          numero: <strong>5</strong>,
          unidades: "unidades de",
          repuesto: <strong>Repuesto B</strong>,
          precio: "Precio por unidad:",
          unidad: <strong>$465</strong>,
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
          entrego: "Entregó",
          numero: <strong>2</strong>,
          unidades: "unidades de",
          repuesto: <strong>Repuesto A</strong>,
          precio: "Precio por unidad:",
          unidad: <strong>$2000</strong>,
        },
        {
          entrego: "Entregó",
          numero: <strong>5</strong>,
          unidades: "unidades de",
          repuesto: <strong>Repuesto B</strong>,
          precio: "Precio por unidad:",
          unidad: <strong>$465</strong>,
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
          entrego: "Entregó",
          numero: <strong>2</strong>,
          unidades: "unidades de",
          repuesto: <strong>Repuesto A</strong>,
          precio: "Precio por unidad:",
          unidad: <strong>$2000</strong>,
        },
        {
          entrego: "Entregó",
          numero: <strong>5</strong>,
          unidades: "unidades de",
          repuesto: <strong>Repuesto B</strong>,
          precio: "Precio por unidad:",
          unidad: <strong>$465</strong>,
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
          entrego: "Entregó",
          numero: <strong>2</strong>,
          unidades: "unidades de",
          repuesto: <strong>Repuesto A</strong>,
          precio: "Precio por unidad:",
          unidad: <strong>$2000</strong>,
        },
        {
          entrego: "Entregó",
          numero: <strong>5</strong>,
          unidades: "unidades de",
          repuesto: <strong>Repuesto B</strong>,
          precio: "Precio por unidad:",
          unidad: <strong>$465</strong>,
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
            </select>
          </div>
          <div>
            <input
              className="proveedores-input"
              type="date"
              placeholder="dd/mm/aaaa"
            />
            <button className="proveedores-button-search">🔍︎</button>
          </div>

          <div>
            <h4>
              Saldo pendiente a la fecha:
              <span style={{ color: "#D4674A", marginLeft: "15px" }}>
                -$6565
              </span>
            </h4>
          </div>
        </div>
        <div className="proveedores-button-box">
          <Link to="/ventas/cargarFactura">
            <button>Cargar factura</button>
          </Link>
          <Link to="/gastos">
            <button>Cargar gasto</button>
          </Link>
          <Link to="/VentasRemito">
            <button>Recibir lote</button>
          </Link>
        </div>
      </div>
      <div className="proveedores-excel-wrapper">
        <h2>Pagos efectuados</h2>
        {/* <Grilla columnas={columnasStock} elementos={itemsStock} /> */}
        <div className="grilla-inventario">
          <Table hover className="grilla-proveedores">
            <thead>
              <tr>
                <th>Estado</th>
                <th>Proveedor</th>
                <th>Fecha</th>
                <th>Importe</th>
                <th>Caja</th>
                <th>Op.</th>
              </tr>
            </thead>
            <tbody className="grilla-proveedores-body">
              {proveedoresData.map((prov, index) => (
                <tr key={index} className={index % 2 === 0 ? "" : "row-even"}>
                  <td>
                    {prov.estado?.length === 0
                      ? "acá va el estado"
                      : prov.estado}
                  </td>
                  <td>{prov.Proveedore.nombre}</td>
                  <td>{prov.fecha_ingreso}</td>
                  <td>{prov.importe}</td>
                  <td>
                    {prov.caja?.length === 0 ? "acá va la caja" : prov.caja}
                  </td>
                  <td>{prov.op?.length == 0 ? "no se que va aca" : prov.op}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Proveedores;
