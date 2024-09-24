import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {
  listaStockPrincipal,
  modificarStockPrincipal,
} from "../../../services/stockPrincipalService.jsx";
import {
  listaStockCamioneta,
  modificarStockCamioneta,
} from "../../../services/stockCamionetaService.jsx";
import "./ModalRepuestos.css";

const ModalAsignarRepuestos = ({
  showModal,
  handleClose,
  ordenSeleccionada,
  stockDataSeleccionada,
  repuestos,
  handleAsignarRepuestos,
}) => {
  const [filtroRepuestos, setFiltroRepuestos] = useState("");
  const [repuestosSeleccionados, setRepuestosSeleccionados] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [stocksDisponibles, setStocksDisponibles] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const cargarStocks = async () => {
      try {
        console.log("Cargando todos los repuestos disponibles en stock...");
        const stockDisponible = await listaStockPrincipal();

        if (stockDisponible && stockDisponible.length > 0) {
          setStocksDisponibles(stockDisponible);
          console.log("Stocks cargados:", stockDisponible);
        } else {
          console.log("No se encontraron repuestos disponibles en stock.");
        }
      } catch (error) {
        console.error("Error al cargar stocks:", error);
        alert("Hubo un problema al cargar los stocks.");
      }
    };

    if (showModal) {
      cargarStocks();
    }
  }, [showModal]);

  const handleFiltroChange = (e) => {
    setFiltroRepuestos(e.target.value);
  };

  const toggleRepuesto = (repuesto) => {
    setRepuestosSeleccionados((prev) => {
      const newSelection = prev.includes(repuesto)
        ? prev.filter((r) => r !== repuesto)
        : [...prev, repuesto];

      // Actualizar cantidades al seleccionar/deseleccionar repuestos
      setCantidades((prev) => {
        const newCantidades = { ...prev };
        if (newSelection.includes(repuesto)) {
          // Si se selecciona, inicializa la cantidad
          newCantidades[repuesto.id_repuesto] = 1;
        } else {
          // Si se deselecciona, elimina la cantidad
          delete newCantidades[repuesto.id_repuesto];
        }
        return newCantidades;
      });

      return newSelection;
    });
  };

  const handleCantidadChange = (repuestoId, cantidad) => {
    const stockDisponible = stocksDisponibles.find(
      (item) => item.id_repuesto === repuestoId
    )?.cantidad;

    if (isNaN(cantidad) || cantidad <= 0) {
      alert("La cantidad debe ser un número mayor que 0.");
      return;
    }

    if (cantidad > stockDisponible) {
      alert("La cantidad no puede ser mayor que el stock disponible.");
      return;
    }

    setCantidades((prev) => ({
      ...prev,
      [repuestoId]: cantidad,
    }));
  };

  const actualizarStocks = async (repuestosConCantidad) => {
    try {
      const stockPrincipal = await listaStockPrincipal();
      const stockCamioneta = await listaStockCamioneta();

      for (const repuesto of repuestosConCantidad) {
        const idStockPrincipal = stockPrincipal.find(
          (item) => item.id_repuesto === repuesto.id_repuesto
        )?.id;
        const idStockCamioneta = stockCamioneta.find(
          (item) => item.id_repuesto === repuesto.id_repuesto
        )?.id;

        if (!idStockPrincipal || !idStockCamioneta) {
          console.error(
            `No se encontró el id para el repuesto: ${repuesto.id_repuesto}`
          );
          setMensaje(`Error: Repuesto ${repuesto.id_repuesto} no encontrado.`);
          continue; // Continúa con el siguiente repuesto
        }

        const stockActualPrincipal = stockPrincipal.find(
          (item) => item.id_repuesto === repuesto.id_repuesto
        )?.cantidad;

        const cantidadAsignada = repuesto.cantidad;

        if (cantidadAsignada > stockActualPrincipal) {
          console.error(
            `Cantidad asignada mayor que el stock actual para el repuesto: ${repuesto.id_repuesto}`
          );
          setMensaje(
            `Error: Cantidad asignada mayor que el stock actual para el repuesto ${repuesto.id_repuesto}.`
          );
          continue;
        }

        const exitoPrincipal = await modificarStockPrincipal(idStockPrincipal, {
          cantidad: stockActualPrincipal - cantidadAsignada,
        });

        const exitoCamioneta = await modificarStockCamioneta(idStockCamioneta, {
          cantidad: cantidadAsignada,
        });

        if (!exitoPrincipal || !exitoCamioneta) {
          console.error(
            `Error al actualizar los stocks del repuesto ${repuesto.id_repuesto}`
          );
          setMensaje(
            `Error al actualizar los stocks del repuesto ${repuesto.id_repuesto}.`
          );
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error("Error al actualizar stocks:", error);
      setMensaje("Hubo un problema al actualizar los stocks.");
      return false;
    }
  };

  const handleSubmit = async () => {
    const repuestosConCantidad = repuestosSeleccionados.map((repuesto) => ({
      id_repuesto: repuesto.id_repuesto, // ID del repuesto
      cantidad: cantidades[repuesto.id_repuesto] || 1,
    }));

    console.log("Repuestos con cantidad asignada:", repuestosConCantidad);

    const exito = await actualizarStocks(repuestosConCantidad);

    if (exito) {
      setMensaje("Repuestos asignados correctamente.");
      handleAsignarRepuestos(repuestosConCantidad);
      handleClose();
    } else {
      setMensaje("Hubo un problema al actualizar los stocks.");
    }
  };

  const repuestosFiltrados = stocksDisponibles
    .filter((repuesto) =>
      repuesto.nombre.toLowerCase().includes(filtroRepuestos.toLowerCase())
    )
    .filter((repuesto) => repuesto.cantidad > 0);

  const resetStates = () => {
    setFiltroRepuestos("");
    setRepuestosSeleccionados([]);
    setCantidades({});
    setStocksDisponibles([]);
    setMensaje("");
  };

  const handleModalClose = () => {
    resetStates();
    handleClose();
  };

  return (
    <Modal show={showModal} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Asignar repuestos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {ordenSeleccionada && (
            <h4>Orden seleccionada: {ordenSeleccionada.numero_orden}</h4>
          )}
          <p>
            Técnico asignado:{" "}
            {stockDataSeleccionada.Empleado
              ? `${stockDataSeleccionada.Empleado.nombre} ${stockDataSeleccionada.Empleado.apellido}`
              : ""}
          </p>
        </div>
        <div>
          <h4>Repuestos</h4>
          <input
            type="text"
            placeholder="Buscar repuesto..."
            value={filtroRepuestos}
            onChange={handleFiltroChange}
          />
          <ul className="ul-modal">
            {repuestosFiltrados.map((stockItem) => (
              <li key={stockItem.id_repuesto}>
                <input
                  type="checkbox"
                  checked={repuestosSeleccionados.includes(stockItem)}
                  className="input-modal"
                  onChange={() => toggleRepuesto(stockItem)}
                />
                {stockItem.nombre} - Stock disponible: {stockItem.cantidad}
                {repuestosSeleccionados.includes(stockItem) && (
                  <input
                    type="number"
                    min="1"
                    max={stockItem.cantidad}
                    step="1"
                    value={cantidades[stockItem.id_repuesto] || ""}
                    onChange={(e) =>
                      handleCantidadChange(
                        stockItem.id_repuesto,
                        Number(e.target.value)
                      )
                    }
                    placeholder="Cantidad"
                  />
                )}
              </li>
            ))}
          </ul>
          {/* {mensaje && <p>{mensaje}</p>} */}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Asignar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAsignarRepuestos;
