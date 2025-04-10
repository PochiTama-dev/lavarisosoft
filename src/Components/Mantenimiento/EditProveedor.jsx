import { useNavigate, useParams } from "react-router-dom";
import Header from "../Header/Header";
import "./EditProveedor.css";
import { useEffect, useState } from "react";

const EditProveedor = () => {
  const { id } = useParams();
  const { product } = location.state || {};
  const navigate = useNavigate();
  const [nombre, setNombre] = useState(product?.nombre || "");
  const [tipo, setTipo] = useState(product?.tipo || "");
  const [fechaIngreso, setFechaIngreso] = useState(
    product?.fecha_ingreso || ""
  );
  const [tiposDeProveedores, setTiposDeProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cuit, setCuit] = useState(product?.cuit || "");

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await fetch("https://lv-back.online/proveedores");
        const data = await response.json();
        const proveedorEncontrado = data.find(
          (item) => item.id === parseInt(id)
        );

        if (proveedorEncontrado) {
          setCuit((proveedorEncontrado.cuit || product?.cuit) || "");
          setNombre(proveedorEncontrado.nombre || product?.nombre || "");
          setTipo(
            proveedorEncontrado.TiposProveedore?.tipo_proveedor ||
              product?.tipo ||
              ""
          );
          setFechaIngreso(
            proveedorEncontrado.fecha_ingreso || product?.fechaIngreso || ""
          );
        }
      } catch (error) {
        console.error("Error al obtener el proveedor:", error);
      }
    };
    const fetchTipoProveedores = async () => {
      try {
        const response = await fetch("https://lv-back.online/opciones/tipos");
        const data = await response.json();
        setTiposDeProveedores(data);
      } catch (error) {
        console.error("Error al obtener los tipos de proveedores:", error);
      }
    };

    const fetchData = async () => {
      await fetchProveedores();
      await fetchTipoProveedores();
      setLoading(false);
    };

    fetchData();
  }, [id, product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tipoId = tiposDeProveedores.find(
      (t) => t.tipo_proveedor === tipo
    )?.id;

    const proveedorActualizado = {
      nombre,
      id_tipo_proveedor: tipoId,
      fecha_ingreso: fechaIngreso,
      cuit: cuit,
    };

    try {
      const response = await fetch(
        `https://lv-back.online/proveedores/modificar/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(proveedorActualizado),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el proveedor");
      }

      const data = await response.json();
      alert("Proveedor actualizado");
      console.log("Proveedor actualizado:", data);
      navigate(-1);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <Header text="Editar proveedor" />
      <div className="editProveedor-formulario">
        <h2>Editar proveedor</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <h3>Nombre:</h3>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          {/* <div>
            <h3>Motivo:</h3>
            <input type="text" />
          </div> */}
          <div>
            <h3>Tipo de Proveedores</h3>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
            >
              {tiposDeProveedores?.map((tipos) => (
                <option key={tipos.id} value={tipos.tipo_proveedor}>
                  {tipos.tipo_proveedor}
                </option>
              ))}
            </select>
          </div>
          <div>
            <h3>Fecha de ingreso:</h3>
            <input
              type="text"
              value={fechaIngreso}
              onChange={(e) => setFechaIngreso(e.target.value)}
              disabled
            />
          </div>
          <div>
            <h3>CUIT:</h3>
            <input
              type="text"
              name="cuit"
              value={cuit}
              onChange={(e) => setCuit(e.target.value)}
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

export default EditProveedor;
