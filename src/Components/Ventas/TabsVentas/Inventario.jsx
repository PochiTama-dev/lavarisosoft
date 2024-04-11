import { useState } from "react";
import Grilla from "../../Grilla/Grilla";
import "./Inventario.css";
import cargar from "../../../images/cargarExcel.webp";
import descargar from "../../../images/descargarExcel.webp";
import editar from "../../../images/editar.webp";

const Inventario = () => {
  const [pestaña, setPestaña] = useState("Stock");
  const [show, setShow] = useState(false);

  const columnasStock = ["Nombre", "ID", "Precio", "Disponibles"];
  const itemsStock = [
    {
      nombre: "NombreAbc123",
      id: 4366,
      precio: 2330,
      disponibles: 2,
      lotes: [
        {
          proveedor: "Proveedor",
          nombre: <strong>SALAZAR</strong>,
          lote: "| Lote:",
          loteNum: <strong>17/1/2-SALAZAR1234</strong>,
          orden: "| Orden N/A | ",
          unidadRestante: <strong>1</strong>,
          unidad: "unidad restante",
        },
        {
          proveedor: "Proveedor",
          nombre: <strong>SALAZAR</strong>,
          lote: "| Lote:",
          loteNum: <strong>17/1/2-SALAZAR1234</strong>,
          orden: "| Orden N/A | ",
          unidadRestante: <strong>1</strong>,
          unidad: "unidad restante",
        },
      ],
    },
    {
      nombre: "NombreAbc456",
      id: 43365,
      precio: 2330,
      disponibles: 2,
      lotes: [
        {
          proveedor: "Proveedor",
          nombre: <strong>SALAZAR</strong>,
          lote: "| Lote:",
          loteNum: <strong>17/1/2-SALAZAR1234</strong>,
          orden: "| Orden N/A | ",
          unidadRestante: <strong>1</strong>,
          unidad: "unidad restante",
        },
      ],
    },
    {
      nombre: "NombreAbc789",
      id: 435,
      precio: 2330,
      disponibles: 2,
      lotes: [
        {
          proveedor: "Proveedor",
          nombre: <strong>SALAZAR</strong>,
          lote: "| Lote:",
          loteNum: <strong>17/1/2-SALAZAR1234</strong>,
          orden: "| Orden N/A | ",
          unidadRestante: <strong>1</strong>,
          unidad: "unidad restante",
        },
      ],
    },
    {
      nombre: "NombreAbc159",
      id: 3165,
      precio: 2330,
      disponibles: 2,
      lotes: [
        {
          proveedor: "Proveedor",
          nombre: <strong>SALAZAR</strong>,
          lote: "| Lote:",
          loteNum: <strong>17/1/2-SALAZAR1234</strong>,
          orden: "| Orden N/A | ",
          unidadRestante: <strong>1</strong>,
          unidad: "unidad restante",
        },
      ],
    },
    {
      nombre: "NombreAbc987",
      id: 9894,
      precio: 2330,
      disponibles: 2,
      lotes: [
        {
          proveedor: "Proveedor",
          nombre: <strong>SALAZAR</strong>,
          lote: "| Lote:",
          loteNum: <strong>17/1/2-SALAZAR1234</strong>,
          orden: "| Orden N/A | ",
          unidadRestante: <strong>1</strong>,
          unidad: "unidad restante",
        },
      ],
    },
  ];
  const columnasStockCamionetas = [
    "Nombre",
    "Técnico",
    "ID",
    "Precio",
    "Disponibles",
  ];
  const itemsStockCamionetas = [
    {
      nombre: "camioneta 1",
      tecnico: "tecnico1",
      ID: 1,
      precio: 1234,
      disponibles: 2,
    },
    {
      nombre: "camioneta 2",
      tecnico: "tecnico2",
      ID: 2,
      precio: 2234,
      disponibles: 1,
    },
    {
      nombre: "camioneta 3",
      tecnico: "tecnico3",
      ID: 3,
      precio: 3234,
      disponibles: 0,
    },
  ];
  const columnasReserva = ["Nombre", "ID", "Precio", "No.Orden"];
  const itemsReserva = [
    {
      nombre: "reserva 1",
      ID: 1,
      precio: 1234,
      nOrden: 1234,
    },
    {
      nombre: "reserva 2",
      ID: 2,
      precio: 2234,
      nOrden: 1234,
    },
    {
      nombre: "reserva 3",
      ID: 3,
      precio: 3234,
      nOrden: 1234,
    },
  ];

  const columnasReporteVentas = ["Nombre", "ID", "Precio", "No.Orden"];
  const itemsReporteVentas = [
    {
      nombre: "Reporte 1",
      id: 1,
      precio: 1000,
      nOrden: 10000,
    },
    {
      nombre: "Reporte 2",
      id: 2,
      precio: 2000,
      nOrden: 20000,
    },
    {
      nombre: "Reporte 3",
      id: 3,
      precio: 3000,
      nOrden: 30000,
    },
  ];

  const handleShow = () => {
    setShow(!show);
  };
  return (
    <div className="bg-secondary">
      <h1 className="text-primary">Inventario</h1>
      <ul className="d-flex justify-content-between">
        <li
          onClick={() => setPestaña("Stock")}
          className={`pestañasInventario ${
            pestaña === "Stock" ? "pestañasInventarioActive" : ""
          }`}
        >
          Stock
        </li>
        <li
          onClick={() => setPestaña("Stock Camionetas")}
          className={`pestañasInventario ${
            pestaña === "Stock Camionetas" ? "pestañasInventarioActive" : ""
          }`}
        >
          Stock Camionetas
        </li>
        <li
          onClick={() => setPestaña("Reserva")}
          className={`pestañasInventario ${
            pestaña === "Reserva" ? "pestañasInventarioActive" : ""
          }`}
        >
          Reserva
        </li>
        <li
          onClick={() => setPestaña("Reporte de ventas")}
          className={`pestañasInventario ${
            pestaña === "Reporte de ventas" ? "pestañasInventarioActive" : ""
          }`}
        >
          Reporte de ventas
        </li>
      </ul>
      <div>
        <h2 className="caja-input-text">Buscar piezas</h2>
        <input className="caja-input" type="text" placeholder="Buscar" />
        <button className="caja-button-search">🔍︎</button>
      </div>
      {pestaña === "Stock" ? (
        <Grilla columnas={columnasStock} elementos={itemsStock} />
      ) : pestaña === "Stock Camionetas" ? (
        <Grilla
          columnas={columnasStockCamionetas}
          elementos={itemsStockCamionetas}
        />
      ) : pestaña === "Reserva" ? (
        <Grilla columnas={columnasReserva} elementos={itemsReserva} />
      ) : (
        <Grilla
          columnas={columnasReporteVentas}
          elementos={itemsReporteVentas}
        />
      )}
      <ul className="d-flex justify-content-between imagenes">
        <div className="text-end">
          <button className="boton3Puntos" onClick={handleShow}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        {show && (
          <>
            <li>
              <img src={descargar} alt="Descargar el excel" />{" "}
              <span>Descargar Excel</span>
            </li>
            <li>
              <img src={editar} alt="editar" /> <span>Editar</span>
            </li>
            <li>
              <img src={cargar} alt="Carga de excel" /> <span>Carga Excel</span>
            </li>
            <li className="d-flex">
              <div className="divMas">
                <span className="spanMas">+</span>
              </div>
              <span>Agregar repuestos</span>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Inventario;
