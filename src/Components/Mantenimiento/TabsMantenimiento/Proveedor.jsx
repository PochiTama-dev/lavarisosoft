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
    ojo: (
      <svg
        width="30"
        height="51"
        viewBox="0 0 51 51"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M25.5 19.125C23.8092 19.125 22.1877 19.7966 20.9922 20.9922C19.7966 22.1877 19.125 23.8092 19.125 25.5C19.125 27.1908 19.7966 28.8123 20.9922 30.0078C22.1877 31.2034 23.8092 31.875 25.5 31.875C27.1908 31.875 28.8123 31.2034 30.0078 30.0078C31.2034 28.8123 31.875 27.1908 31.875 25.5C31.875 23.8092 31.2034 22.1877 30.0078 20.9922C28.8123 19.7966 27.1908 19.125 25.5 19.125ZM25.5 36.125C22.6821 36.125 19.9796 35.0056 17.987 33.013C15.9944 31.0204 14.875 28.3179 14.875 25.5C14.875 22.6821 15.9944 19.9796 17.987 17.987C19.9796 15.9944 22.6821 14.875 25.5 14.875C28.3179 14.875 31.0204 15.9944 33.013 17.987C35.0056 19.9796 36.125 22.6821 36.125 25.5C36.125 28.3179 35.0056 31.0204 33.013 33.013C31.0204 35.0056 28.3179 36.125 25.5 36.125ZM25.5 9.5625C14.875 9.5625 5.80125 16.1713 2.125 25.5C5.80125 34.8288 14.875 41.4375 25.5 41.4375C36.125 41.4375 45.1987 34.8288 48.875 25.5C45.1987 16.1713 36.125 9.5625 25.5 9.5625Z"
          fill="#69688C"
        />
      </svg>
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
