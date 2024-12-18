import { useEffect, useState } from "react";
import Header from "../Header/Header";
import "./CargarFactura.css";
import { useNavigate } from "react-router-dom";
import { listadoEmpleados } from "../../services/empleadoService";
import { listaCajas } from "../../services/cajasService";
import { listaStockPrincipal } from "../../services/stockPrincipalService";
import { listadoProveedores } from "../../services/proveedoresService";

const CargarFactura = () => {
  const [factura, setFactura] = useState({
    id_proveedor: 0,
    id_repuesto: 0,
    id_responsable: 0,
    cantidad: 0,
    importe: 0,
    codigo_imputacion: "",
    fecha_ingreso: "",
    imagen_comprobante: "",
    estado_pago: 0,
    caja: 0,
    lote: "",
  });
  const [proveedores, setProveedores] = useState([]);
  const [repuestos, setRepuestos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [cajas, setCajas] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const obtenerProveedores = async () => {
      const data = await listadoProveedores();
      setProveedores(data);
    };

    const obtenerRepuestos = async () => {
      const data = await listaStockPrincipal();
      setRepuestos(data);
    };
    const obtenerEmpleados = async () => {
      const data = await listadoEmpleados();
      setEmpleados(data);
    };
    const obtenerCajas = async () => {
      const data = await listaCajas();
      setCajas(data);
    };
    obtenerProveedores();
    obtenerRepuestos();
    obtenerEmpleados();
    obtenerCajas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFactura((prevFactura) => ({
      ...prevFactura,
      [name]: name === "estado_pago" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateFactura(factura);
  };

  const handleCreateFactura = async (factura) => {
    try {
      const {
        id_proveedor,
        id_repuesto,
        id_responsable,
        cantidad,
        importe,
        codigo_imputacion,
        fecha_ingreso,
        imagen_comprobante,
        estado_pago,
        caja,
        lote,
      } = await factura;
      await postFactura({
        id_proveedor,
        id_repuesto,
        id_responsable,
        cantidad,
        importe,
        codigo_imputacion,
        fecha_ingreso,
        imagen_comprobante,
        estado_pago,
        caja,
        lote,
      });
      alert("Factura agregada con éxito");
      navigate(-1);
    } catch (error) {
      console.error(error);
    }
  };

  const postFactura = async (factura) => {
    const {
      id_proveedor,
      id_repuesto,
      id_responsable,
      cantidad,
      importe,
      codigo_imputacion,
      fecha_ingreso,
      imagen_comprobante,
      estado_pago,
      caja,
      lote,
    } = await factura;
    const fetchFactura = await fetch(
      "https://lv-back.online/facturas/guardar",
      {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_proveedor,
          id_repuesto,
          id_responsable,
          cantidad,
          importe,
          codigo_imputacion,
          fecha_ingreso,
          imagen_comprobante,
          estado_pago,
          caja,
          lote,
        }),
      }
    );
    console.log("Factura cargada: ", fetchFactura.status);
  };

  return (
    <div>
      <Header text="Cargar factura" />
      <div className="factura-formulario">
        <h2>Cargar factura</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <h3>Proveedor:</h3>
            <select
              name="id_proveedor"
              value={factura.id_proveedor}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un proveedor</option>
              {proveedores.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <h3>Repuesto:</h3>
            <select
              name="id_repuesto"
              value={factura.id_repuesto}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un repuesto</option>
              {repuestos.map((rep) => (
                <option key={rep.id} value={rep.id}>
                  {rep.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <h3>Responsable:</h3>
            <select
              name="id_responsable"
              value={factura.id_responsable}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un responsable</option>
              {empleados.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.nombre} {emp.apellido}
                </option>
              ))}
            </select>
          </div>
          <div>
            <h3>Cantidad:</h3>
            <input
              type="number"
              placeholder="0"
              name="cantidad"
              value={factura.cantidad}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <h3>Importe:</h3>
            <input
              type="text"
              placeholder="0"
              name="importe"
              value={factura.importe}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <h3>Cod. imputación:</h3>
            <input
              type="text"
              name="codigo_imputacion"
              value={factura.codigo_imputacion}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <h3>Fecha de ingreso:</h3>
            <input
              type="text"
              placeholder="dd/mm/aaaa"
              name="fecha_ingreso"
              value={factura.fecha_ingreso}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <h3>Imagen comprobante:</h3>
            <input
              type="file"
              name="imagen_comprobante"
              value={factura.imagen_comprobante}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <h3>Estado pago:</h3>
            <select
              name="estado_pago"
              value={factura.estado_pago}
              onChange={handleChange}
              required
            >
              <option value={0}>No pagado</option>
              <option value={1}>Pagado</option>
            </select>
          </div>

          <div>
            <h3>Caja:</h3>
            <select
              name="caja"
              value={factura.caja}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una caja</option>
              {cajas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.denominacion}
                </option>
              ))}
            </select>
          </div>
          <div>
            <h3>Lote:</h3>
            <input
              type="text"
              name="lote"
              value={factura.lote}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <button type="submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CargarFactura;
