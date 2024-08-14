import { useState, useEffect } from "react";
import Header from "../../Header/Header";
import "./EditarStockRepuestos.css";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const EditarProducto = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};

  const [nombre, setNombre] = useState(product?.nombre || "");
  const [proveedor, setProveedor] = useState(product?.proveedor || "");
  const [precio, setPrecio] = useState(product?.precio || "");
  const [cantidad, setCantidad] = useState(product?.cantidad || 0);
  const [orden, setOrden] = useState(product?.orden || "");
  const [fechaLote, setFechaLote] = useState(product?.fechaLote || "");
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch(
          "https://lv-back.online/stock/principal/lista"
        );
        const data = await response.json();
        const productoEncontrado = data.find(
          (item) => item.id === parseInt(id)
        );

        if (productoEncontrado) {
          setNombre(
            productoEncontrado.Repuesto?.descripcion || product?.nombre || ""
          );
          setProveedor(
            productoEncontrado.Proveedore?.nombre || product?.proveedor || ""
          );
          setPrecio(productoEncontrado.precio || product?.precio || "");
          setCantidad(productoEncontrado.cantidad || product?.cantidad || 0);
          setOrden(
            productoEncontrado.orden || product?.orden || "Sin orden asignada"
          );
          setFechaLote(
            productoEncontrado.fecha_ingreso || product?.fechaLote || ""
          );
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      }
    };
    const fetchProveedores = async () => {
      try {
        const response = await fetch("https://lv-back.online/proveedores");
        const data = await response.json();
        setProveedores(data);
      } catch (error) {
        console.error("Error al obtener los proveedores:", error);
      }
    };

    const fetchData = async () => {
      await fetchProducto();
      await fetchProveedores();
      setLoading(false);
    };

    fetchData();
  }, [id, product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productoActualizado = {
      nombre,
      id,
      proveedor,
      precio,
      cantidad,
      orden,
      fechaLote,
    };

    try {
      const response = await fetch(
        `https://lv-back.online/stock/principal/modificar/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productoActualizado),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el producto");
      }

      const data = await response.json();
      navigate(-1);
      console.log("Producto actualizado:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <Header text="Editar un producto" />

      <div className="stockContainer">
        <h1>Editar un producto</h1>
        <div className="editar-producto-formulario">
          <form onSubmit={handleSubmit}>
            <div>
              <h3>Nombre:</h3>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.90909 13.8182L6.09091 8.81818L1.86364 11.5L0.772727 9.59091L5.22727 7.27273L0.772727 4.95454L1.86364 3.04545L6.09091 5.72727L5.90909 0.727272H8.09091L7.90909 5.72727L12.1364 3.04545L13.2273 4.95454L8.77273 7.27273L13.2273 9.59091L12.1364 11.5L7.90909 8.81818L8.09091 13.8182H5.90909Z"
                  fill="#FF0000"
                />
              </svg>
            </div>
            <div>
              <h3>Proveedor:</h3>
              <select
                value={proveedor}
                onChange={(e) => setProveedor(e.target.value)}
                required
              >
                {proveedores.map((prov) => (
                  <option key={prov.id} value={prov.nombre}>
                    {prov.nombre}
                  </option>
                ))}
              </select>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.90909 13.8182L6.09091 8.81818L1.86364 11.5L0.772727 9.59091L5.22727 7.27273L0.772727 4.95454L1.86364 3.04545L6.09091 5.72727L5.90909 0.727272H8.09091L7.90909 5.72727L12.1364 3.04545L13.2273 4.95454L8.77273 7.27273L13.2273 9.59091L12.1364 11.5L7.90909 8.81818L8.09091 13.8182H5.90909Z"
                  fill="#FF0000"
                />
              </svg>
            </div>
            <div>
              <h3>Precio:</h3>
              <input
                type="string"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                required
              />
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.90909 13.8182L6.09091 8.81818L1.86364 11.5L0.772727 9.59091L5.22727 7.27273L0.772727 4.95454L1.86364 3.04545L6.09091 5.72727L5.90909 0.727272H8.09091L7.90909 5.72727L12.1364 3.04545L13.2273 4.95454L8.77273 7.27273L13.2273 9.59091L12.1364 11.5L7.90909 8.81818L8.09091 13.8182H5.90909Z"
                  fill="#FF0000"
                />
              </svg>
            </div>
            <div>
              <h3>Cantidad:</h3>
              <input
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                required
              />
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.90909 13.8182L6.09091 8.81818L1.86364 11.5L0.772727 9.59091L5.22727 7.27273L0.772727 4.95454L1.86364 3.04545L6.09091 5.72727L5.90909 0.727272H8.09091L7.90909 5.72727L12.1364 3.04545L13.2273 4.95454L8.77273 7.27273L13.2273 9.59091L12.1364 11.5L7.90909 8.81818L8.09091 13.8182H5.90909Z"
                  fill="#FF0000"
                />
              </svg>
            </div>
            <div>
              <h3>Orden:</h3>
              <input
                type="text"
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
              />
            </div>
            <div>
              <h3>Fecha lote:</h3>
              <input
                type="date"
                value={fechaLote}
                onChange={(e) => setFechaLote(e.target.value)}
                required
              />
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.90909 13.8182L6.09091 8.81818L1.86364 11.5L0.772727 9.59091L5.22727 7.27273L0.772727 4.95454L1.86364 3.04545L6.09091 5.72727L5.90909 0.727272H8.09091L7.90909 5.72727L12.1364 3.04545L13.2273 4.95454L8.77273 7.27273L13.2273 9.59091L12.1364 11.5L7.90909 8.81818L8.09091 13.8182H5.90909Z"
                  fill="#FF0000"
                />
              </svg>
            </div>
            <div>
              <button type="submit">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarProducto;
