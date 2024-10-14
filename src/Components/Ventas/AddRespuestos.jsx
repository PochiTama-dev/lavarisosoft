import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import "./AddRepuestos.css";
import { useState, useEffect } from "react";
import fetchDolarBlue from "../../services/ApiDolarService";

const AgregarRepuesto = () => {
  const [repuesto, setRepuesto] = useState({
    nombre: "",
    id_repuesto: 0,
    id_proveedor: "",
    precio: 0,
    cantidad: 0,
    lote: "",
    fecha_ingreso: new Date().toISOString().split("T")[0],
  });
  const [proveedoresList, setProveedoresList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [tasaDolarBlue, setTasaDolarBlue] = useState(null);

  useEffect(() => {
    fetchProveedores();
  }, []);

  useEffect(() => {
    const obtenerTasaDolar = async () => {
      const tasa = await fetchDolarBlue();
      setTasaDolarBlue(tasa);
    };
    obtenerTasaDolar();
  }, []);

  const fetchProveedores = async () => {
    try {
      const response = await fetch("https://lv-back.online/proveedores");
      const proveedores = await response.json();
      setProveedoresList(proveedores);
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const newValue =
      name === "precio" ||
      name === "id_repuesto" ||
      name === "cantidad" ||
      name === "id_proveedor"
        ? Number(value)
        : value;

    setRepuesto((prevRepuesto) => ({
      ...prevRepuesto,
      [name]: newValue,
    }));

    if (name === "id_proveedor") {
      const proveedorSeleccionado = proveedoresList.find(
        (proveedor) => proveedor.id === parseInt(value)
      );
      if (proveedorSeleccionado) {
        const fechaActual = new Date().toISOString().split("T")[0];
        const lote = `${proveedorSeleccionado.nombre.toUpperCase()}${fechaActual}`;
        setRepuesto((prevRepuesto) => ({
          ...prevRepuesto,
          lote: lote,
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleGuardar = async (e) => {
    // e.preventDefault();

    try {
      const precioEnDolares = repuesto.precio / tasaDolarBlue;
      const repuestoConFecha = {
        ...repuesto,
        precio: parseFloat(precioEnDolares.toFixed(2)),
      };

      console.log(repuestoConFecha);
      const response = await fetch(
        "https://lv-back.online/stock/principal/guardar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(repuestoConFecha),
        }
      );

      if (response.ok) {
        alert("Repuesto agregado con éxito");
        setIsModalOpen(false);
        navigate(-1);
      } else {
        const errorData = await response.json();
        console.error("Error al agregar repuesto:", errorData);
        alert("Hubo un problema al agregar el repuesto.");
      }
    } catch (error) {
      console.error("Error de red o al agregar repuesto:", error);
    }
  };

  const handleRedirect = () => {
    setIsModalOpen(false);
    navigate("/addFactura");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Header text="Agregar un repuesto" />
      <div className="stockContainer">
        <h1 style={{ marginLeft: "5%" }}>Agregar un producto</h1>
        <div className="agregar-repuesto-formulario">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={repuesto.nombre}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="id_repuesto">ID Repuesto</label>
              <input
                type="number"
                id="id_repuesto"
                name="id_repuesto"
                value={repuesto.id_repuesto}
                onChange={handleChange}
              />
            </div>
            <div className="">
              <label htmlFor="id_proveedor">Proveedor</label>
              <select
                id="id_proveedor"
                name="id_proveedor"
                value={repuesto.id_proveedor}
                onChange={handleChange}
              >
                <option value="">Selecciona un proveedor</option>
                {proveedoresList.map((proveedor) => (
                  <option key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="precio">Precio</label>
              <input
                type="number"
                id="precio"
                name="precio"
                value={repuesto.precio}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="cantidad">Cantidad</label>
              <input
                type="number"
                id="cantidad"
                name="cantidad"
                value={repuesto.cantidad}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="lote">Lote</label>
              <input
                type="text"
                id="lote"
                name="lote"
                value={repuesto.lote}
                onChange={handleChange}
                disabled
              />
            </div>
            <button type="submit">Continuar</button>
          </form>
        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>¿Qué deseas hacer?</h2>
              <div className="modal-buttons">
                <button className="modal-btn" onClick={handleRedirect}>
                  Cargar factura y guardar
                </button>
                <button className="modal-btn" onClick={handleGuardar}>
                  Guardar sin factura
                </button>
              </div>
              <button className="modal-close" onClick={handleCloseModal}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgregarRepuesto;
