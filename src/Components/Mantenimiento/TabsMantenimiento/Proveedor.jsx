import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Grilla from "../../Grilla/Grilla";
import "./Proveedor.css";

const Proveedor = () => {
  const [proveedores, setProveedores] = useState([]);
  const navigate = useNavigate();
  const columnasStock = ["Nombre", "Tipo de proveedor", "Fecha de ingreso"];

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await fetch("https://lv-back.online/proveedores");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProveedores(data);
      } catch (error) {
        console.error("Error fetching proveedores:", error);
      }
    };

    fetchProveedores();
  }, []);

  const itemsStock = proveedores.map((proveedor) => ({
    nombre: proveedor.nombre,
    tipoProveedor: proveedor.TiposProveedore.tipo_proveedor,
    fecha: proveedor.fecha_ingreso,
    editar: (
      <Link to={`/proveedorEdit/${proveedor.id}`}>
        <svg
          width="20"
          height="33"
          viewBox="0 0 33 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M32.4638 7.41022C33.1787 6.69532 33.1787 5.50382 32.4638 4.82558L28.1744 0.536175C27.4962 -0.178725 26.3047 -0.178725 25.5898 0.536175L22.2169 3.89071L29.091 10.7648M0 26.126V33H6.87405L27.1479 12.7078L20.2739 5.83377L0 26.126Z"
            fill="#69688C"
          />
        </svg>
      </Link>
    ),
 
  }));

  return (
    <div className="proveedor-container">
      <div>
        <div className="proveedor-heading">
          <h1>Detalle de proveedores</h1>
        </div>
      </div>
      <div className="proveedor-table-container">
        <Grilla columnas={columnasStock} elementos={itemsStock} />
      </div>
      <div className="add-proveedor-button-container">
        <span
          className="add-proveedor-button"
          onClick={() => navigate("/proveedor")}
        >
          +
        </span>
      </div>
    </div>
  );
};

export default Proveedor;
