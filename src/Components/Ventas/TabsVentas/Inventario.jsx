import { useEffect, useState } from "react";
import Grilla from "../../Grilla/Grilla";
import "./Inventario.css";
import cargar from "../../../images/cargarExcel.webp";
import descargar from "../../../images/descargarExcel.webp";
import editar from "../../../images/editar.webp";
import { listaRepuestos } from "../../../services/repuestosService.jsx";
import { listaStockCamioneta } from "../../../services/stockCamionetaService.jsx";
import { modificarStockCamioneta } from "../../../services/stockCamionetaService.jsx";
import ModalAsignarRepuestos from "../../Mantenimiento/TabsMantenimiento/ModalAsignarRepuestos";
import { useCustomContext } from "../../../hooks/context.jsx";
import { Table } from "react-bootstrap";

const Inventario = () => {
  const { handleNavigate } = useCustomContext();
  const [pestaña, setPestaña] = useState("Stock");
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [stockData, setStockData] = useState([]);
  const [stockDataSeleccionada, setStockDataSeleccionada] = useState([]);
  const [repuestos, setRepuestos] = useState([]);
  const [camionetaData, setCamionetaData] = useState([]);
  const [reservaData, setReservaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [camionetaSeleccionada, setCamionetaSeleccionada] = useState(null);
  const [tecnicoAsignado, setTecnicoAsignado] = useState(null);
  const [tecnicos, setTecnicos] = useState([]);

  const handleShowRepuestos = (index) => {
    const selectedCamioneta = camionetaData[index];
    setStockDataSeleccionada(selectedCamioneta);
    setCamionetaSeleccionada(selectedCamioneta.id);

    if (selectedCamioneta.Empleado) {
      setTecnicoAsignado(selectedCamioneta.Empleado);
    } else {
      console.warn("No hay empleado asignado para esta camioneta");
      setTecnicoAsignado(null);
    }
    setShowModal(true);
  };

  const handleCloseRepuestos = () => setShowModal(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredStockData = stockData.filter((item) => {
    try {
      console.log("Datos solicitados:", item.Repuesto);
      if (item.Repuesto) {
        return item.Repuesto.descripcion
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      }
    } catch (error) {
      console.error("Error al acceder a item.Repuesto:", error);
      return false;
    }
  });

  // const filteredCamionetaData = camionetaData.filter((item) => {
  //   try {
  //     console.log("Datos solicitados camioneta:", item.Repuesto);
  //     return (
  //       item.Repuesto &&
  //       item.Repuesto.descripcion &&
  //       item.Repuesto.descripcion
  //         .toLowerCase()
  //         .includes(searchTerm.toLowerCase())
  //     );
  //   } catch (error) {
  //     console.error("Error al acceder a item.Repuesto:", error);
  //     return false;
  //   }
  // });

  const filteredReservaData = reservaData.filter((item) => {
    try {
      console.log("Datos solicitados:", item.id);
      return item.id.toString().includes(searchTerm.toLowerCase());
    } catch (error) {
      console.error("Error al acceder a item.id:", error);
      return false;
    }
  });

  const stockDb = async () => {
    try {
      const response = await fetch(
        "https://lv-back.online/stock/principal/lista"
      );
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const obtenerTecnicos = async () => {
    try {
      const response = await fetch("https://lv-back.online/empleados");
      const empleados = await response.json();
      const tecnicos = empleados.filter((empleado) => empleado.id_rol === 5);
      return tecnicos;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const camionetaDb = async () => {
    try {
      const response = await fetch(
        "https://lv-back.online/stock/camioneta/lista"
      );
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const reservaDb = async () => {
    try {
      const response = await fetch(
        "https://lv-back.online/stock/reserva/lista"
      );
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const fetchRepuestos = async () => {
    try {
      const repuestosData = await listaRepuestos();
      setRepuestos(repuestosData);
    } catch (error) {
      console.error("Error al obtener repuestos:", error);
    }
  };

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const data = await stockDb();
        setStockData(data);
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setStockData([]);
      } finally {
        setLoading(false);
      }
    };
    const fetchTecnico = async () => {
      try {
        const data = await obtenerTecnicos();
        setTecnicos(data);
      } catch (error) {
        console.log("Error obteniendo los tecnicos: ", error);
        setTecnicos([]);
      } finally {
        setLoading(false);
      }
    };
    const fetchCamionetaData = async () => {
      try {
        const data = await listaStockCamioneta(); //camionetaDb();
        setCamionetaData(data);
      } catch (error) {
        console.error("Error fetching camioneta data:", error);
        setCamionetaData([]);
      } finally {
        setLoading(false);
      }
    };
    const fetchReservaData = async () => {
      try {
        const data = await reservaDb();
        setReservaData(data);
      } catch (error) {
        console.error("Error fetching reserva data:", error);
        setReservaData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStockData();
    fetchTecnico();
    fetchCamionetaData();
    fetchReservaData();
    fetchRepuestos();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

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
    <div className="bg-secondary inventario-container">
      <h1 className="text-primary">Inventario</h1>
      <ul className="d-flex justify-content-around">
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
        {/* <input className="caja-input" type="text" placeholder="Buscar"  /> */}
        <input
          className="caja-input"
          type="text"
          placeholder="Buscar"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="caja-button-search">🔍︎</button>
      </div>
      {pestaña === "Stock" ? (
        <div className="grilla-inventario">
          <Table hover className="grilla-stock">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>ID</th>
                <th>Precio</th>
                <th>Disponibles</th>
              </tr>
            </thead>
            <tbody className="grilla-stock-body">
              {filteredStockData.map((stock, index) => (
                <tr key={index} className={index % 2 === 0 ? "" : "row-even"}>
                  <td>{stock.Repuesto.descripcion}</td>
                  <td>{stock.id}</td>
                  <td>${stock.precio}</td>
                  <td>{stock.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : pestaña === "Stock Camionetas" ? (
        <div className="grilla-inventario">
          <Table hover className="grilla-camioneta">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tecnico</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Patente</th>
              </tr>
            </thead>
            <tbody className="grilla-camioneta-body">
              {tecnicos.map((tec, index) => (
                <tr key={index} className={index % 2 === 0 ? "" : "row-even"}>
                  <td>{tec.id}</td>
                  <td>
                    {tec.nombre} {tec.apellido}
                  </td>
                  <td>{tec.Vehiculo?.marca}</td>
                  <td>{tec.Vehiculo?.modelo}</td>
                  <td>{tec.Vehiculo?.patente}</td>
                  <td>
                    <span
                      className="btnMas"
                      onClick={() => handleShowRepuestos(index)}
                    >
                      +
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : pestaña === "Reserva" ? (
        <div className="grilla-inventario">
          <Table hover className="grilla-reserva">
            <thead>
              <tr>
                <th>Nombre de repuesto</th>
                <th>ID</th>
                <th>ID de repuesto</th>
                <th>No. Orden</th>
                <th>Disponibles</th>
              </tr>
            </thead>
            <tbody className="grilla-reserva-body">
              {filteredReservaData.map((reserva, index) => (
                <tr key={index} className={index % 2 === 0 ? "" : "row-even"}>
                  <td>{reserva.Repuesto.descripcion}</td>
                  <td>{reserva.id}</td>
                  <td>{reserva.id_repuesto}</td>
                  <td>{reserva.Ordene.numero_orden}</td>
                  <td>{reserva.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <Grilla
          columnas={columnasReporteVentas}
          elementos={itemsReporteVentas}
        />
      )}
      <ul className="d-flex justify-content-left w-100 imagenes">
        <div className="text-end">
          <button className="boton3Puntos" onClick={handleShow}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        {show && (
          <div className="d-flex justify-content-around inventario-botones">
            <li>
              <img src={descargar} alt="Descargar el excel" />{" "}
              <span>Descargar Excel</span>
            </li>
            <li>
              <img
                src={editar}
                alt="editar"
                onClick={() => handleNavigate("editarStockRepuestos")}
              />
              <span>Editar</span>
            </li>
            <li onClick={() => handleNavigate("addLoteExcel")}>
              <img src={cargar} alt="Carga de excel" /> <span>Carga Excel</span>
            </li>
            <li
              className="d-flex"
              onClick={() => handleNavigate("addRespuestos")}
            >
              <div className="divMas">
                <span className="spanMas">+</span>
              </div>
              <span style={{ paddingLeft: "4%", minWidth: "160px" }}>
                Agregar repuestos
              </span>
            </li>
          </div>
        )}
      </ul>

      <ModalAsignarRepuestos
        showModal={showModal}
        handleClose={handleCloseRepuestos}
        ordenSeleccionada={false} // No se asigna orden en este caso
        stockDataSeleccionada={stockDataSeleccionada}
        tecnicoAsignado={tecnicoAsignado}
        repuestos={repuestos}
        handleAsignarRepuestos={async (repuestosSeleccionados) => {
          for (const repuesto of repuestosSeleccionados) {
            const repuestoData = {
              id_empleado: tecnicoAsignado.id,
              id_repuesto: repuesto.id,
              cantidad: repuesto.cantidad || 1,
              lote: stockDataSeleccionada.lote || "N/A",
            };

            console.log("RepuestoData: ", repuestoData);
            console.log("ID del repuesto:", repuesto.id);

            const success = await modificarStockCamioneta(
              camionetaSeleccionada,
              repuestoData
            );

            if (success) {
              console.log("Repuesto asignado correctamente");
            } else {
              console.log("Error al asignar el repuesto:", repuesto);
            }
          }
        }}
      />
    </div>
  );
};

export default Inventario;
