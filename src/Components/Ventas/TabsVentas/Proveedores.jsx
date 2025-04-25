import "./Proveedores.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { empleados } from "../../../services/empleadoService";
import Header from "../../Header/Header";
import { listaCajas, modificarCaja } from "../../../services/cajasService";
import { modificarFacturaCompra } from "../../../services/facturaComprasService";

const Proveedores = () => {
  const [proveedoresData, setProveedoresData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [empleadosData, setEmpleadosData] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [searchProveedor, setSearchProveedor] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [montoPagar, setMontoPagar] = useState("");
  const [medioPago, setMedioPago] = useState("");
  const [cajaSeleccionada, setCajaSeleccionada] = useState("");
  const [cajasDisponibles, setCajasDisponibles] = useState([]);

  const proveedoresDb = async () => {
    try {
      const response = await fetch(
        "https://lv-back.online/facturascompra/lista"
      );
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

        // Normalize gastos data to match proveedores structure, adding missing fields
        const normalizedGastos = gastosData.map((gasto) => ({
          Proveedore: { nombre: gasto.Proveedore.nombre },
          descripcion: gasto.motivo,
          created_at: gasto.fecha_ingreso,
          total: gasto.importe,
          monto_pagado: gasto.importe,
          estado: gasto.estado_pago,
          efectivo: gasto.efectivo || 0, // default value for efectivo
          dolares: gasto.dolares || 0, // default value for dolares
          transferencia: gasto.transferencia || 0, // default value for transferencia
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

  useEffect(() => {
    const fetchCajas = async () => {
      try {
        const cajas = await listaCajas();
        const cajasFormateadas = cajas.map((caja) => ({
          id: caja.id,
          denominacion: caja.denominacion,
          monto: parseFloat(caja.monto),
          efectivo: parseFloat(caja.efectivo),
          dolares: parseFloat(caja.dolares),
          banco: parseFloat(caja.banco),
        }));
        setCajasDisponibles(cajasFormateadas || []);

        const caja2 = cajasFormateadas.find(
          (caja) => caja.denominacion === "Caja 2"
        );
        if (caja2) {
          setCajaSeleccionada(caja2.id.toString());
        }
      } catch (error) {
        console.error("Error al cargar las cajas:", error);
      }
    };

    fetchCajas();
  }, []);

  const uniqueProveedores = [
    ...new Set(proveedoresData.map((prov) => prov.Proveedore.nombre)),
  ];

  useEffect(() => {
    const filtered = proveedoresData.filter((prov) => {
      // Formatear la fecha de creación de la factura o gasto
      const provDate = new Date(prov.created_at).toISOString().split("T")[0];

      // Comparar la fecha formateada con la fecha ingresada por el usuario
      const dateMatch = !searchDate || provDate === searchDate;

      // Comparar el nombre del proveedor
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

  const handleConfirmarPago = async () => {
    const cajaSeleccionadaData = cajasDisponibles.find(
      (caja) => caja.id === parseInt(cajaSeleccionada)
    );

    if (!cajaSeleccionadaData) {
      alert("Por favor, seleccione una caja válida.");
      return;
    }

    const disponible = parseFloat(cajaSeleccionadaData.efectivo);

    if (
      montoPagar > 0 &&
      montoPagar <=
        selectedProveedor?.total - selectedProveedor?.monto_pagado &&
      montoPagar <= disponible
    ) {
      try {
        const nuevoMontoPagado =
          parseFloat(selectedProveedor.monto_pagado) + parseFloat(montoPagar);

        const actualizado = await modificarFacturaCompra(selectedProveedor.id, {
          monto_pagado: nuevoMontoPagado,
        });

        if (actualizado) {
          const nuevoSaldoEfectivo =
            parseFloat(cajaSeleccionadaData.efectivo) - parseFloat(montoPagar);

          const cajaActualizada = await modificarCaja(cajaSeleccionadaData.id, {
            efectivo: nuevoSaldoEfectivo,
          });

          if (cajaActualizada) {
            alert("Pago registrado y monto actualizado con éxito.");
            setShowModal(false);

            window.location.reload();
          } else {
            alert(
              "El pago fue registrado, pero hubo un error al actualizar el saldo de la caja."
            );
          }
        } else {
          alert("Hubo un error al actualizar el monto pagado.");
        }
      } catch (error) {
        console.error("Error al registrar el pago:", error);
        alert("Hubo un error al registrar el pago. Intente nuevamente.");
      }
    } else {
      alert(
        `El monto a pagar no puede ser mayor al disponible (${disponible}) en la caja.`
      );
    }
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
                <th style={{ textAlign: "left" }}>Nombre</th>
                <th style={{ textAlign: "left" }}>Descripción</th>
                <th style={{ textAlign: "left" }}>Fecha</th>
                <th style={{ textAlign: "left" }}>Estado de pago</th>
                <th style={{ textAlign: "left" }}>Importe</th>

                <th style={{ textAlign: "left" }}>Efectivo</th>
                <th style={{ textAlign: "left" }}>Dolares</th>
                <th style={{ textAlign: "left" }}>Transferencia</th>
                <th style={{ textAlign: "left" }}>Pagado</th>
                <th style={{ textAlign: "left" }}>Debe</th>
                <th style={{ textAlign: "left" }}>Acciones</th>
                {/*         <th>Responsable</th> */}
              </tr>
            </thead>
            <tbody className="grilla-proveedores-body">
              {filteredData.map((prov, index) => (
                <tr key={index} className={index % 2 === 0 ? "" : "row-even"}>
                  <td style={{ textAlign: "left" }}>
                    {prov.Proveedore.nombre}
                  </td>
                  <td style={{ textAlign: "left" }}>{prov.descripcion}</td>
                  <td style={{ textAlign: "left" }}>
                    {formatDate(prov.created_at)}
                  </td>
                  <td style={{ textAlign: "left" }}>
                    {prov.total !== prov.monto_pagado
                      ? "Pago Parcial"
                      : prov.estado === 0
                      ? "No pagado"
                      : "Pagado"}
                  </td>
                  <td style={{ color: "green", textAlign: "left" }}>
                    $ {prov.total}
                  </td>

                  <td style={{ textAlign: "left" }}>
                    {prov.efectivo == 0 ? "-" : `$ ${prov.efectivo}`}
                  </td>
                  <td style={{ textAlign: "left" }}>
                    {prov.dolares == 0 ? "-" : `$ ${prov.dolares}`}
                  </td>
                  <td style={{ textAlign: "left" }}>
                    {prov.transferencia == 0 ? "-" : `$ ${prov.transferencia}`}
                  </td>
                  <td style={{ textAlign: "left" }}>$ {prov.monto_pagado}</td>
                  <td style={{ color: "red", textAlign: "left" }}>
                    {prov.total !== prov.monto_pagado ? (
                      `$${(
                        Number(prov.total) - Number(prov.monto_pagado)
                      ).toFixed(2)}`
                    ) : (
                      <strong style={{ color: "black" }}>-</strong>
                    )}
                  </td>
                  <td>
                    {parseFloat(prov.total) > parseFloat(prov.monto_pagado) && (
                      <button
                        onClick={() => {
                          setSelectedProveedor(prov);
                          setShowModal(true);
                        }}
                        style={{
                          backgroundColor: "#69688c",
                          color: "white",
                          border: "none",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        Saldar Deuda
                      </button>
                    )}
                  </td>
                  {/*   <td>{getResponsable(prov.id_responsable)}</td> */}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "20px",
            zIndex: 1000,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            width: "400px",
          }}
        >
          <h3>Saldar Deuda</h3>
          <p>Proveedor: {selectedProveedor?.Proveedore.nombre}</p>
          <p>
            Deuda: ${selectedProveedor?.total - selectedProveedor?.monto_pagado}
          </p>
          <div>
            <label>Monto a pagar:</label>
            <input
              type="number"
              value={montoPagar}
              onChange={(e) => setMontoPagar(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            {montoPagar >
              selectedProveedor?.total - selectedProveedor?.monto_pagado && (
              <p style={{ color: "red" }}>
                El monto no puede ser mayor a la deuda.
              </p>
            )}
          </div>
          <div>
            <label>Caja:</label>
            <select
              value={cajaSeleccionada}
              onChange={(e) => setCajaSeleccionada(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">Seleccione una caja</option>
              {cajasDisponibles.map((caja) => (
                <option key={caja.id} value={caja.id}>
                  {caja.denominacion} (Disponible: $
                  {parseFloat(caja.efectivo).toFixed(2)})
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              onClick={() => setShowModal(false)}
              style={{
                backgroundColor: "gray",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmarPago}
              style={{
                backgroundColor: "#69688c",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Confirmar Pago
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Proveedores;
