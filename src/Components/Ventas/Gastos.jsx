import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import "./Gastos.css";
import { useEffect, useState } from "react";
import { listaCajas, modificarCaja } from "../../services/cajasService";
import fetchDolarBlue from "../../services/ApiDolarService";

const Gastos = () => {
 
  const [proveedores, setProveedores] = useState([]);
  const [gasto, setGasto] = useState({
    id_proveedor: null,
    motivo: "",
    importe: "",
    codigo_imputacion: "",
    fecha_ingreso: new Date().toISOString().split('T')[0],  
    id_caja: "",
    efectivo: "",
    dolares: "",
    transferencia: "",
  });
  const [cajas, setCajas] = useState([]);
  const [error, setError] = useState("");  
  const [total, setTotal] = useState(0);  

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

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setGasto((prevGasto) => ({
      ...prevGasto,
      [name]: value,
    }));

    // Update total and validate against importe
    if (['efectivo', 'transferencia', 'dolares'].includes(name)) {
      const dolarBlueRate = await fetchDolarBlue();
      setGasto((prevGasto) => {
        const efectivo = parseFloat(prevGasto.efectivo || 0);
        const transferencia = parseFloat(prevGasto.transferencia || 0);
        const dolares = parseFloat(prevGasto.dolares || 0) * dolarBlueRate;
        const importe = parseFloat(prevGasto.importe || 0);

        const newTotal = efectivo + transferencia + dolares;
        setTotal(newTotal);

        if (newTotal > importe) {
          setError("La suma de efectivo, dólares (convertidos a pesos) y transferencia no puede superar el importe.");
        } else {
          setError(""); // Clear error if valid
        }
        return prevGasto;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    await handleCreateGasto(gasto);  
  };

  const handleCreateGasto = async (gasto) => {
    try {
      const { id_proveedor, motivo, importe, codigo_imputacion, fecha_ingreso, id_caja, efectivo, dolares, transferencia } = gasto;
      if (total !== parseFloat(importe)) {
        alert("El monto no puede ser menor al importe a pagar");
        return;
      }
      await postGasto({
        id_proveedor,
        motivo,
        importe,
        codigo_imputacion,
        fecha_ingreso,
        id_caja,
        efectivo, dolares, transferencia,
      });
      // Actualizar caja: restar, según se hayan ingresado montos específicos o el importe total
      const cajaSeleccionada = cajas.find(c => Number(c.id) === Number(id_caja));
      if (cajaSeleccionada) {
        if (efectivo || dolares || transferencia) {
          let updatedFields = {};
          if (efectivo) {
            updatedFields.efectivo = Number(cajaSeleccionada.efectivo || 0) - Number(efectivo);
          }
          if (dolares) {
            updatedFields.dolares = Number(cajaSeleccionada.dolares || 0) - Number(dolares);
          }
          if (transferencia) {
            updatedFields.banco = Number(cajaSeleccionada.banco || 0) - Number(transferencia);
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
      console.error("Error al crear el gasto:", error.message); // Improve error logging
    }
  };

  const postGasto = async (gasto) => {
    const { id_proveedor, motivo, importe, codigo_imputacion, fecha_ingreso, id_caja, efectivo, dolares, transferencia } = gasto;
    console.log("Datos a enviar a gastos:", { id_proveedor, motivo, importe, codigo_imputacion, fecha_ingreso, id_caja });
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
        id_caja, 
        efectivo,   
        dolares,
        transferencia
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
            <h3>Monto Efectivo:</h3>
            <input
              type="text"
              placeholder="0"
              name="efectivo"
              value={gasto.efectivo}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                const disponible = parseFloat(cajas.find((c) => c.id === Number(gasto.id_caja))?.efectivo || 0);
                if (value > disponible) {
                  setGasto((prevGasto) => ({ ...prevGasto, efectivo: disponible }));
                } else {
                  handleChange(e);
                }
              }}
            />
            {gasto.id_caja && (
              <span style={{ fontSize: "14px", color: "gray" }}>
                Disponible: ${cajas.find((c) => c.id === Number(gasto.id_caja))?.efectivo || 0}
              </span>
            )}
          </div>
          <div>
            <h3>Monto Transferencia:</h3>
            <input
              type="text"
              placeholder="0"
              name="transferencia"
              value={gasto.transferencia}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                const disponible = parseFloat(cajas.find((c) => c.id === Number(gasto.id_caja))?.banco || 0);
                if (value > disponible) {
                  setGasto((prevGasto) => ({ ...prevGasto, transferencia: disponible }));
                } else {
                  handleChange(e);
                }
              }}
            />
            {gasto.id_caja && (
              <span style={{ fontSize: "14px", color: "gray" }}>
                Disponible: ${cajas.find((c) => c.id === Number(gasto.id_caja))?.banco || 0}
              </span>
            )}
          </div>
          <div>
            <h3>Monto Dolares:</h3>
            <input
              type="text"
              placeholder="0"
              name="dolares"
              value={gasto.dolares}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                const disponible = parseFloat(cajas.find((c) => c.id === Number(gasto.id_caja))?.dolares || 0);
                if (value > disponible) {
                  setGasto((prevGasto) => ({ ...prevGasto, dolares: disponible }));
                } else {
                  handleChange(e);
                }
              }}
            />
            {gasto.id_caja && (
              <span style={{ fontSize: "14px", color: "gray" }}>
                Disponible: ${cajas.find((c) => c.id === Number(gasto.id_caja))?.dolares || 0}
              </span>
            )}
          </div>
      
          <div>
            <h3>Total:</h3>
            <input
              type="text"
              value={total.toFixed(2)}
              readOnly
              style={{ backgroundColor: "#f0f0f0", border: "none" }}
            />
          </div>
          {error && (
            <span style={{ fontSize: "14px", color: "red" }}>{error}</span>
          )}
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
            <button type="submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Gastos;
