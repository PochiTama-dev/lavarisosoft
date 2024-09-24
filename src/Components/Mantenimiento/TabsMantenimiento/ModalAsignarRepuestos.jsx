import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { obtenerRepuestosStock } from "../../../services/stockPrincipalService.jsx";
import "./ModalRepuestos.css";

const ModalAsignarRepuestos = ({
  showModal,
  handleClose,
  ordenSeleccionada,
  stockDataSeleccionada,
  tecnicoAsignado,
  repuestos,
  handleAsignarRepuestos,
}) => {
  const [filtroRepuestos, setFiltroRepuestos] = useState("");
  const [repuestosSeleccionados, setRepuestosSeleccionados] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [stocksDisponibles, setStocksDisponibles] = useState({});

  useEffect(() => {
    const cargarStocks = async () => {
      const stockPromises = repuestos.map(async (repuesto) => {
        const stockDisponible = await obtenerRepuestosStock(repuesto.id);

        if (stockDisponible && stockDisponible !== 0) {
          return { id: repuesto.id, stock: stockDisponible };
        }

        return null;
      });

      const resultados = await Promise.all(stockPromises);

      // Filtrar los resultados nulos o inválidos
      const stocksMap = resultados
        .filter(result => result !== null)
        .reduce((acc, { id, stock }) => {
          acc[id] = stock;
          return acc;
        }, {});

      setStocksDisponibles(stocksMap);
    };

    if (showModal) {
      cargarStocks();
    }
  }, [showModal, repuestos]);

  const handleFiltroChange = (e) => {
    setFiltroRepuestos(e.target.value);
  };

  const toggleRepuesto = (repuesto) => {
    setRepuestosSeleccionados((prev) =>
      prev.includes(repuesto)
        ? prev.filter((r) => r !== repuesto)
        : [...prev, repuesto]
    );
  };

  const handleCantidadChange = (repuestoId, cantidad) => {
    setCantidades((prev) => ({
      ...prev,
      [repuestoId]: cantidad,
    }));
  };

  const repuestosFiltradosUnicos = Array.from(
    new Map(
      Object.values(stocksDisponibles).flat().map((repuesto) => [repuesto.id_repuesto, repuesto])
    ).values()
  );


  const handleSubmit = () => {
    const repuestosConCantidad = repuestosSeleccionados.map((repuesto) => ({
      ...repuesto,
      cantidad: cantidades[repuesto.id_repuesto] || 1,
    }));

    console.log("Repuestos con cantidad asignada:", repuestosConCantidad);
    handleAsignarRepuestos(repuestosConCantidad);
    handleClose();
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Asignar repuestos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {ordenSeleccionada && (
            <h4>Orden seleccionada: {ordenSeleccionada.numero_orden}</h4>
          )}
          <p>
            Técnico asignado: {stockDataSeleccionada.Empleado ? stockDataSeleccionada.Empleado.nombre : ''} {stockDataSeleccionada.Empleado ? stockDataSeleccionada.Empleado.apellido : ''}
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
            {repuestosFiltradosUnicos.map((stockItem) => (
              <li key={stockItem.id}>
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
                    max={stockItem.cantidad} // Limita la cantidad según el stock disponible
                    value={cantidades[stockItem.id_repuesto] || ""}
                    onChange={(e) =>
                      handleCantidadChange(stockItem.id_repuesto, e.target.value)
                    }
                    placeholder="Cantidad"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
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
