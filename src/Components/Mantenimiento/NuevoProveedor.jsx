import { useEffect, useState } from "react";
import Header from "../Header/Header";
import "./NuevoProveedor.css";
import { useNavigate } from "react-router-dom";

const NuevoProveedor = () => {
  const [tiposProveedores, setTiposProveedores] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    id_tipo_proveedor: "",
    cuit: "",  
    fecha_ingreso: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerTiposProveedores = async () => {
      try {
        const response = await fetch("https://lv-back.online/opciones/tipos");
        if (!response.ok) {
          throw new Error("Error al obtener los tipos de proveedores");
        }
        const data = await response.json();
        setTiposProveedores(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    obtenerTiposProveedores();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  console.log("FORMDATA", formData);
    try {
      const response = await fetch(
        "https://lv-back.online/proveedores/guardar",
        {
          method: "POST",
      
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Hubo un error al guardar el proveedor");
      }

      alert("Proveedor guardado exitosamente");
      navigate("/mantenimiento");
    } catch (error) {
      console.error(error.message);
      alert("Error al guardar el proveedor");
    }
  };

  return (
    <div>
      <Header text="Nuevo proveedor" />
      <div className="nuevoProveedor-formulario">
        <h2>Nuevo proveedor</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <h3>Nombre:</h3>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <h3>Tipo de proveedor:</h3>
            <select
              name="id_tipo_proveedor"
              value={formData.id_tipo_proveedor}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un tipo</option>
              {tiposProveedores.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.tipo_proveedor}
                </option>
              ))}
            </select>
          </div>
          {/* Nuevo campo para CUIT */}
          <div>
            <h3>CUIT:</h3>
            <input
              type="text"
              name="cuit"
              value={formData.cuit}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <h3>Fecha de ingreso:</h3>
            <input
              type="date"
              name="fecha_ingreso"
              value={formData.fecha_ingreso}
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

export default NuevoProveedor;
