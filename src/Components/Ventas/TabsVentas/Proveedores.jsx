import "./Proveedores.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { empleados } from "../../../services/empleadoService";
import Header from "../../Header/Header";

const Proveedores = () => {
  const [proveedoresData, setProveedoresData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [empleadosData, setEmpleadosData] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [searchProveedor, setSearchProveedor] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const proveedoresDb = async () => {
    try {
      const response = await fetch("https://lv-back.online/facturascompra/lista");
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const gastosDb = async () => {
    try {
      const response = await fetch("https://lv-back.online/gastos/listado");
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    const fetchProveedoresData = async () => {
      try {
        const proveedoresData = await proveedoresDb();
        const gastosData = await gastosDb();

        // Normalize gastos data to match proveedores structure
        const normalizedGastos = gastosData.map((gasto) => ({
          Proveedore: { nombre: gasto.Proveedore.nombre },
          descripcion: gasto.motivo,
          created_at: gasto.fecha_ingreso,
          total: gasto.importe,
          monto_pagado: gasto.importe,
          estado: gasto.estado_pago,
        }));

        const combinedData = [...proveedoresData, ...normalizedGastos];
        setProveedoresData(combinedData);
        setFilteredData(combinedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setProveedoresData([]);
      } finally {
        setLoading(false);
      }
    };
    const fetchEmpleadosData = async () => {
      try {
        const data = await empleados();
        setEmpleadosData(data);
      } catch (error) {
        console.error("Error fetching empleados data:", error);
        setEmpleadosData([]);
      }
    };
    fetchProveedoresData();
    fetchEmpleadosData();
  }, []);

 
  const uniqueProveedores = [
    ...new Set(proveedoresData.map((prov) => prov.Proveedore.nombre)),
  ];

  const formatSearchDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const formattedDate = searchDate ? formatSearchDate(searchDate) : "";
    const filtered = proveedoresData.filter((prov) => {
      const dateMatch = !searchDate || prov.fecha_ingreso === formattedDate;
      const proveedorMatch =
        !searchProveedor || prov.Proveedore.nombre === searchProveedor;
      return dateMatch && proveedorMatch;
    });
    setFilteredData(filtered);
  }, [searchDate, searchProveedor, proveedoresData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="proveedores-container" style={{ padding: "20px" }}>
      <div>
        <Header text="Pagos a proveedores" />

        <div className="proveedores-top-box">
          <div>
            <select
              className="proveedores-select"
              value={searchProveedor}
              onChange={(e) => setSearchProveedor(e.target.value)}
            >
              <option value="">Todos los proveedores</option>
              {uniqueProveedores.map((proveedor, index) => (
                <option key={index} value={proveedor}>
                  {proveedor}
                </option>
              ))}
            </select>
          </div>
          <div>
            <input
              className="proveedores-input"
              type="date"
              placeholder="dd/mm/aaaa"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </div>
        </div>
        <div className="proveedores-button-box">
          <Link to="/ventas/cargarFactura">
            <button>Cargar factura</button>
          </Link>
          <Link to="/gastos">
            <button>Cargar gasto</button>
          </Link>
          {/*    <Link to="/VentasRemito">
            <button>Recibir lote</button>
          </Link> */}
        </div>
      </div>
      <div className="proveedores-excel-wrapper">
        <h2>Pagos efectuados</h2>
        <div className="grilla-inventario">
          <Table hover className="grilla-proveedores">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Fecha</th>
                <th>Estado de pago</th>
                <th>Importe</th>
                <th>Debe</th>
                {/*         <th>Responsable</th> */}
              </tr>
            </thead>
            <tbody className="grilla-proveedores-body">
              {filteredData.map((prov, index) => (
                <tr key={index} className={index % 2 === 0 ? "" : "row-even"}>
                  <td>{prov.Proveedore.nombre}</td>
                  <td>{prov.descripcion}</td>
                  <td>{formatDate(prov.created_at)}</td>
                  <td>
                    {prov.total !== prov.monto_pagado
                      ? "Pago Parcial"
                      : prov.estado === 0
                      ? "No pagado"
                      : "Pagado"}
                  </td>
                  <td>$ {prov.total}</td>
                             <td style={{ color: "red" }}>
                    {prov.total !== prov.monto_pagado ? `$${prov.total - prov.monto_pagado}` : <strong style={{color:'black'}}>-</strong>}
                  </td>
                  {/*   <td>{getResponsable(prov.id_responsable)}</td> */}
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
