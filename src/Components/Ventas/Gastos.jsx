import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import "./Gastos.css";
import { useEffect, useState } from "react";
import { listaCajas, modificarCaja } from "../../services/cajasService";
const Gastos = () => {
 
  const [proveedores, setProveedores] = useState([]);
  const [gasto, setGasto] = useState({
    id_proveedor: null,
    motivo: "",
    importe: "",
    codigo_imputacion: "",
    fecha_ingreso: "",
    id_caja: "",
    monto_efectivo: "",
    monto_dolares: "",
    monto_transferencia: "",
  });
  const [cajas, setCajas] = useState([]);

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

    obtenerProveedores();
  }, []);

  useEffect(() => {
    const obtenerCajas = async () => {
      try {
        const data = await listaCajas();
        setCajas(data);
      } catch (error) {
        console.error("Error al obtener las cajas:", error.message);
      }
    };

    obtenerCajas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGasto((prevGasto) => ({
      ...prevGasto,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateGasto(gasto);
  };

  const handleCreateGasto = async (gasto) => {
    try {
      const { id_proveedor, motivo, importe, codigo_imputacion, fecha_ingreso, id_caja, monto_efectivo, monto_dolares, monto_transferencia } = await gasto;
      await postGasto({
        id_proveedor,
        motivo,
        importe,
        codigo_imputacion,
        fecha_ingreso,
        id_caja
      });
      // Actualizar caja: restar, según se hayan ingresado montos específicos o el importe total
      const cajaSeleccionada = cajas.find(c => Number(c.id) === Number(id_caja));
      if (cajaSeleccionada) {
        if (monto_efectivo || monto_dolares || monto_transferencia) {
          let updatedFields = {};
          if (monto_efectivo) {
            updatedFields.efectivo = Number(cajaSeleccionada.efectivo || 0) - Number(monto_efectivo);
          }
          if (monto_dolares) {
            updatedFields.dolares = Number(cajaSeleccionada.dolares || 0) - Number(monto_dolares);
          }
          if (monto_transferencia) {
            updatedFields.banco = Number(cajaSeleccionada.banco || 0) - Number(monto_transferencia);
          }
          await modificarCaja(id_caja, updatedFields);
        } else {
          const nuevoMonto = Number(cajaSeleccionada.monto) - Number(importe);
          await modificarCaja(id_caja, { monto: nuevoMonto });
        }
      }
      alert("Gasto agregado con éxito");
      navigate(-1);
    } catch (error) {
      console.error(error);
    }
  };

  const postGasto = async (gasto) => {
    const { id_proveedor, motivo, importe, codigo_imputacion, fecha_ingreso , id_caja } =
      await gasto;
    const fetchGasto = await fetch("https://lv-back.online/gastos/guardar", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_proveedor,
        motivo,
        importe,
        codigo_imputacion,
        fecha_ingreso,
        id_caja
      }),
    });
    console.log("Gasto cargada: ", fetchGasto.status);
  };

  return (
    <div>
      <Header text="Declarar gasto" />
      <div className="gastos-formulario">
        <h2>Declarar gasto</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <h3>Proveedor:</h3>
            <select
              name="id_proveedor"
              value={gasto.id_proveedor}
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
            <h3>Importe:</h3>
            <input
              type="text"
              placeholder="0"
              name="importe"
              value={gasto.importe}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <h3>Monto Efectivo:</h3>
            <input
              type="text"
              placeholder="0"
              name="monto_efectivo"
              value={gasto.monto_efectivo}
              onChange={handleChange}
            />
          </div>
          <div>
            <h3>Monto Dolares:</h3>
            <input
              type="text"
              placeholder="0"
              name="monto_dolares"
              value={gasto.monto_dolares}
              onChange={handleChange}
            />
          </div>
          <div>
            <h3>Monto Transferencia:</h3>
            <input
              type="text"
              placeholder="0"
              name="monto_transferencia"
              value={gasto.monto_transferencia}
              onChange={handleChange}
            />
          </div>
          <div>
            <h3>Motivo:</h3>
            <input
              type="text"
              name="motivo"
              value={gasto.motivo}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <h3>Cod. imputación:</h3>
            <input
              type="text"
              name="codigo_imputacion"
              value={gasto.codigo_imputacion}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <h3>Fecha:</h3>
            <input
              type="date"
              placeholder="dd/mm/aaaa"
              name="fecha_ingreso"
              value={gasto.fecha_ingreso}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <h3>Caja:</h3>
            <select
              name="id_caja"
              value={gasto.id_caja}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una caja</option>
              {cajas.map((caja) => (
                <option key={caja.id} value={caja.id}>
                  {caja.denominacion}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button type="submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Gastos;
