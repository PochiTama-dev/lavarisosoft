import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

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

  const repuestosFiltrados = repuestos.filter((repuesto) =>
    repuesto.descripcion.toLowerCase().includes(filtroRepuestos.toLowerCase())
  );

  const handleSubmit = () => {
    handleAsignarRepuestos(repuestosSeleccionados);
    handleClose();
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Asignar repuestos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Si se proporciona una orden seleccionada, se muestra */}
        {ordenSeleccionada && (
          <div>
            <h4>Orden seleccionada: {ordenSeleccionada.numero_orden}</h4>
            <p>Técnico asignado: {tecnicoAsignado.nombre} {tecnicoAsignado.apellido}</p>
          </div>
        )}

        <div>
          <h4>Repuestos</h4>
          <input
            type="text"
            placeholder="Buscar repuesto..."
            value={filtroRepuestos}
            onChange={handleFiltroChange}
          />
          <ul>
            {repuestosFiltrados.map((repuesto) => (
              <li key={repuesto.id}>
                <input
                  type="checkbox"
                  checked={repuestosSeleccionados.includes(repuesto)}
                  onChange={() => toggleRepuesto(repuesto)}
                />
                 {repuesto.descripcion}
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
