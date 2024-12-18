import { useState, useEffect } from "react";
import "./nuevaOrden.css";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeClock } from "@mui/x-date-pickers/TimeClock";
import { Modal, Button } from "@mui/material";
const NuevosDatosIncidente = ({ setIncidente }) => {
  const [repuestos, setRepuestos] = useState([]);
  const [nuevoRepuesto, setNuevoRepuesto] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [estados, setEstados] = useState([]);
  const [selectedEstado, setSelectedEstado] = useState(1);
  const [numeroOrden, setNumeroOrden] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [fechaVisita, setFechaVisita] = useState("");
  const [horaInicioVisita, setHoraInicioVisita] = useState(dayjs());
  const [horaFinVisita, setHoraFinVisita] = useState(dayjs());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectingStartTime, setIsSelectingStartTime] = useState(true);
  const [timeClockKey, setTimeClockKey] = useState(0); // New state to control the key
  const handleShowMore = () => {
    setShowMore(!showMore);
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsSelectingStartTime(true); // Start with selecting the start time
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const listadoOrdenes = async () => {
    try {
      const response = await fetch("https://lv-back.online/ordenes/listado");
      const ordenes = await response.json();
      if (ordenes[0] !== undefined) {
        //console.log(`Se encontró un listado con ${ordenes.length} ordenes!!`);
        return ordenes;
      } else {
        console.log("Aún no se registra ninguna orden...");
        return [];
      }
    } catch (error) {
      console.error(
        "Error, no se encontraron ordenes en la base de datos....",
        error
      );
      return [];
    }
  };

  const tiposEstados = async () => {
    try {
      const response = await fetch("https://lv-back.online/opciones/estado");
      const estados = await response.json();
      if (estados[0] !== undefined) {
        //console.log(`Se encontró un listado con ${estados.length} tipos de estados!!`);
        //console.log(estados);
        return estados;
      } else {
        console.log("Aún no se registra ningún tipo de estado...");
        return [];
      }
    } catch (error) {
      console.error(
        "Error, no se encontraron tipos de estados en la base de datos....",
        error
      );
      return [];
    }
  };

  useEffect(() => {
    const fetchEstados = async () => {
      const estadosList = await tiposEstados();
      setEstados(estadosList);
    };

    const fetchNumeroOrden = async () => {
      const ordenesList = await listadoOrdenes();
      if (ordenesList.length > 0) {
        const maxNumeroOrden = Math.max(
          ...ordenesList.map((o) => o.numero_orden)
        );
        setNumeroOrden(maxNumeroOrden + 1);
        setIncidente((prevState) => ({
          ...prevState,
          numero_orden: maxNumeroOrden + 1,
        }));
      } else {
        setNumeroOrden(1);
        setIncidente((prevState) => ({ ...prevState, numero_orden: 1 }));
      }
    };

    fetchEstados();
    fetchNumeroOrden();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setIncidente((prevState) => ({
      ...prevState,
      [id]: value,
      repuestos,
      id_tipo_estado: selectedEstado,
    }));
  };

  const handleEstadoChange = (e) => {
    setSelectedEstado(1);
    setIncidente((prevState) => ({
      ...prevState,
      id_tipo_estado: e.target.value,
    }));
  };

  const handleAdd = () => {
    if (nuevoRepuesto.trim() !== "") {
      const updatedRepuestos = [...repuestos, nuevoRepuesto];
      setRepuestos(updatedRepuestos);
      setIncidente((prevState) => ({
        ...prevState,
        repuestos: updatedRepuestos,
      }));
      setNuevoRepuesto("");
      handleShow();
    }
  };

  const handleShow = () => {
    setShowInput(!showInput);
  };

  const handleFechaVisitaChange = (e) => {
    setFechaVisita(e.target.value);
    setIncidente((prevState) => ({
      ...prevState,
      fecha_visita: e.target.value,
    }));
  };
  const handleHoraInicioVisitaChange = (newValue) => {
    if (newValue?.isValid()) {
      setHoraInicioVisita(newValue);
      setIncidente((prevState) => ({
        ...prevState,
        hora_inicio_visita: newValue.format("HH:mm"),
      }));

      if (newValue.minute() !== horaInicioVisita.minute()) {
        setIsSelectingStartTime(false);
        setTimeClockKey((prevKey) => prevKey + 1);
      }
    }
  };

  const handleHoraFinVisitaChange = (newValue) => {
    if (newValue?.isValid()) {
      setHoraFinVisita(newValue);
      setIncidente((prevState) => ({
        ...prevState,
        hora_fin_visita: newValue.format("HH:mm"),
      }));
    }
  };

  return (
    <div style={{ width: "40vw", marginLeft: "2%", marginTop: "3%" }}>
      <div>
        <div className="col-md-6">
          <h3 className="m-4">Datos del incidente</h3>
          <div className="mb-3 row align-items-center">
            <label htmlFor="numero_orden" className="col-sm-3 text-left">
              N° Orden:
            </label>
            <div className="col-sm-8">
              <input
                type="text"
                id="numero_orden"
                className="form-control input-small"
                value={numeroOrden}
                onChange={handleInputChange}
                readOnly
                required
              />
            </div>
          </div>
          <div className="mb-3 row align-items-center">
            <label htmlFor="equipo" className="col-sm-3 text-left">
              Equipo:
            </label>
            <div className="col-sm-8">
              <input
                type="text"
                id="equipo"
                className="form-control input-small"
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {showMore && (
            <>
              <div className="mb-3 row align-items-center">
                <label htmlFor="marca" className="col-sm-3 text-left">
                  Marca:
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    id="marca"
                    className="form-control input-small"
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="mb-3 row align-items-center">
                <label htmlFor="modelo" className="col-sm-3 text-left">
                  Modelo:
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    id="modelo"
                    className="form-control input-small"
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="mb-3 row align-items-center">
                <label htmlFor="diagnostico" className="col-sm-4 text-left">
                  Diagnóstico:
                </label>
                <div className="col-sm-8">
                  <textarea
                    id="diagnostico"
                    className="form-control input-small"
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
              </div>
              <div className="mb-3 row align-items-center">
                <label htmlFor="fecha_visita" className="col-sm-4 text-left">
                  Fecha de Visita:
                </label>
                <div className="col-sm-8">
                  <input
                    type="date"
                    id="fechaVisita"
                    className="form-control input-small"
                    value={fechaVisita}
                    onChange={handleFechaVisitaChange}
                  />
                </div>
              </div>
              <div className="mb-3 row">
                <div className="col-sm-10 offset-sm-2">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenModal}
                  >
                    Seleccionar Horario de Visita
                  </Button>
                  <p>
                    Intervalo Seleccionado: {horaInicioVisita.format("HH:mm")} -{" "}
                    {horaFinVisita.format("HH:mm")}
                  </p>
                </div>
              </div>
              <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                className="modal"
                style={{}}
              >
                <div
                  className="modal-content"
                  style={{
                    width: "30%",
                    height: "50%",
                    overflowY: "hidden",
                  }}
                >
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {isSelectingStartTime
                        ? "Selecciona la Hora de Inicio"
                        : "Selecciona la Hora de Fin"}
                    </h5>
                  </div>
                  <div className="modal-body">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      {isSelectingStartTime ? (
                        <TimeClock
                          ampm={false}
                          key={timeClockKey}
                          value={horaInicioVisita}
                          onChange={handleHoraInicioVisitaChange}
                        />
                      ) : (
                        <TimeClock
                          ampm={false}
                          key={timeClockKey}
                          value={horaFinVisita}
                          onChange={handleHoraFinVisitaChange}
                        />
                      )}
                    </LocalizationProvider>
                    <div className="selected-times mt-3">
                      {!isSelectingStartTime &&
                        horaInicioVisita &&
                        horaFinVisita && (
                          <p>
                            Intervalo Seleccionado:{" "}
                            {horaInicioVisita.format("HH:mm")} -{" "}
                            {horaFinVisita.format("HH:mm")}
                          </p>
                        )}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <Button
                      variant="contained"
                      color="inherit"
                      onClick={() => {
                        setHoraInicioVisita(dayjs()); // Reset start time
                        setHoraFinVisita(dayjs()); // Reset end time
                        setIsSelectingStartTime(true); // Go back to start time selection
                        setTimeClockKey((prevKey) => prevKey + 1); // Force TimeClock reset
                      }}
                    >
                      Borrar
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleCloseModal}
                    >
                      Aceptar
                    </Button>
                  </div>
                </div>
              </Modal>
            </>
          )}

          {/* Botón 'Ver más' */}
          <div className="mb-3 row">
            <div className="col-sm-10 offset-sm-2">
              <button
                className="bg-primary rounded-pill text-white papelitoButton"
                onClick={handleShowMore}
              >
                {showMore ? "Ver menos" : "Ver más"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NuevosDatosIncidente;
