import { useEffect, useState } from "react";
import Header from "../Header/Header";
import "./CargarFactura.css";
import { useNavigate } from "react-router-dom";

const CargarFactura = () => {
  const [factura, setFactura] = useState({
    id_proveedor: 0,
    id_repuesto: 0,
    cantidad: 0,
    importe: 0,
    codigo_imputacion: "",
    fecha_ingreso: "",
    imagen_comprobante: "",
  });
  const [proveedores, setProveedores] = useState([]);
  const [repuestos, setRepuestos] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const obtenerProveedores = async () => {
      try {
        const response = await fetch("https://lv-back.online/proveedores");
        if (!response.ok) {
          throw new Error("Error al obtener los proveedores");
        }
        const data = await response.json();
        setProveedores(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    const obtenerRepuestos = async () => {
      try {
        const response = await fetch("https://lv-back.online/repuestos/lista");
        if (!response.ok) {
          throw new Error("Error al obtener los repuestos");
        }
        const data = await response.json();
        setRepuestos(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    obtenerProveedores();
    obtenerRepuestos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFactura((prevFactura) => ({
      ...prevFactura,
      [name]: value,
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
        cantidad,
        importe,
        codigo_imputacion,
        fecha_ingreso,
        imagen_comprobante,
      } = await factura;
      await postFactura({
        id_proveedor,
        id_repuesto,
        cantidad,
        importe,
        codigo_imputacion,
        fecha_ingreso,
        imagen_comprobante,
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
      cantidad,
      importe,
      codigo_imputacion,
      fecha_ingreso,
      imagen_comprobante,
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
          cantidad,
          importe,
          codigo_imputacion,
          fecha_ingreso,
          imagen_comprobante,
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
                  {rep.descripcion}
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
            <button type="submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CargarFactura;
