import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ordenes, modificarOrden } from "../../../services/ordenesService";
import { listadoEmpleados } from "../../../services/empleadoService";
import { listaRepuestos } from "../../../services/repuestosService";
import { guardarOrdenRepuesto } from "../../../services/ordenesRepuestosService";
import ModalAsignarRepuestos from "./ModalAsignarRepuestos";
import editar from "../../../images/editar.webp";

const Taller = () => {
  const [listaOrdenes, setOrdenes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [estados, setEstados] = useState([]);
  const [repuestos, setRepuestos] = useState([]);
  const [selectedTecnico, setSelectedTecnico] = useState(null);
  const [selectedEstado, setSelectedEstado] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [orderBy, setOrderBy] = useState(null);
  const [orderAsc, setOrderAsc] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleShow = (index) => {
    setOrdenSeleccionada(listaOrdenes[index]);
    setTecnicoAsignado(listaOrdenes[index].Empleado);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const fetchEmpleados = async () => {
    try {
      const empleadosData = await listadoEmpleados();
      const empleadosFiltrados = empleadosData.filter((tecnico) => {
        if (tecnico.estado == 0) {
          return tecnico;
        }
        return false;
      });
      setEmpleados(empleadosFiltrados);
    } catch (error) {
      console.error("Error al obtener empleados:", error);
    }
  };

  const fetchRepuestos = async () => {
    try {
      const repuestosData = await listaRepuestos();
      console.log(repuestosData);
      setRepuestos(repuestosData);
    } catch (error) {
      console.error("Error al obtener repuestos:", error);
    }
  };

  const fetchTiposEstados = async () => {
    try {
      const response = await fetch("https://lv-back.online/opciones/estado");
      const estados = await response.json();
      if (estados[0] !== undefined) {
        setEstados(estados);
      } else {
        console.log('Aún no se registra ningún tipo de estado...');
        return [];
      }
    } catch (error) {
      console.error("Error, no se encontraron tipos de estados en la base de datos....", error);
      return [];
    }
  };

  const obtenerOrdenesFiltradas = async (ordenes, id_estado_presupuesto) => {
    console.log("ordenes ", ordenes);
    try {
      const ordenesFiltradas = ordenes.filter((orden) => {
        if (orden.Presupuesto.id_estado_presupuesto == id_estado_presupuesto) {
          return orden;
        }
        return false;
      });
      return ordenesFiltradas;
    } catch (error) {
      console.error("Error al filtrar las órdenes:", error);
      throw error;
    }
  };

  const fetchOrdenes = async () => {
    try {
      const data = await ordenes();
      const presupuestos = data.filter((presup) => presup.Presupuesto);
      if (data.length > 0) {
        const ordenesFiltradas = await obtenerOrdenesFiltradas(presupuestos, 2);
        console.log("ordenesFiltradas ", ordenesFiltradas);

        if (ordenesFiltradas.length > 0) {
          setOrdenes(ordenesFiltradas);
        } else {
          console.log("No se encontraron órdenes en taller...");
        }
      } else {
        console.log("Aún no se registra ninguna orden...");
      }
    } catch (error) {
      console.error(
        "Error, no se encontraron ordenes en la base de datos....",
        error
      );
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setSelectedTecnico(listaOrdenes[index].Empleado.id);
    setSelectedEstado(listaOrdenes[index].id_tipo_estado);
  };

  const handleTecnicoChange = (event) => {
    setSelectedTecnico(event.target.value);
  };

  const handleEstadoChange = (event) => {
    setSelectedEstado(event.target.value);
  };

  const handleSave = async (index) => {
    try {
      const tecnicoSeleccionado = empleados.find(
        (empleado) => empleado.id == selectedTecnico
      );

      if (!tecnicoSeleccionado) {
        throw new Error("Técnico no encontrado");
      }

      const estadoSeleccionado = estados.find(
        (estado) => estado.id == selectedEstado
      );

      if (!estadoSeleccionado) {
        throw new Error("Estado no encontrado");
      }

      const updatedOrden = {
        ...listaOrdenes[index],
        id_empleado: tecnicoSeleccionado.id,
        id_tipo_estado: estadoSeleccionado.id,
        Empleado: { ...tecnicoSeleccionado },
        TiposEstado: {
          id: estadoSeleccionado.id,
          tipo_estado: estadoSeleccionado.tipo_estado
        }
      };

      const success = await modificarOrden(updatedOrden.id, updatedOrden);

      if (success) {
        const newOrdenes = [...listaOrdenes];
        newOrdenes[index] = updatedOrden;
        setOrdenes(newOrdenes);
        setEditIndex(null);
        console.log("Orden actualizada correctamente:", updatedOrden);
      } else {
        console.error("Error al actualizar la orden.");
      }
    } catch (error) {
      console.error("Error al guardar el técnico asignado:", error);
    }
  };

  const handleSort = (column) => {
    if (orderBy === column) {
      setOrderAsc(!orderAsc);
    } else {
      setOrderBy(column);
      setOrderAsc(true);
    }
  };

  const sortedData = [...listaOrdenes].sort(async (a, b) => {
    if (orderBy) {
      if (a[orderBy] < b[orderBy]) {
        return orderAsc ? -1 : 1;
      }
      if (a[orderBy] > b[orderBy]) {
        return orderAsc ? 1 : -1;
      }
      return 0;
    } else {
      return 0;
    }
  });

  useEffect(() => {
    fetchOrdenes();
    fetchEmpleados();
    fetchTiposEstados();
    fetchRepuestos();
  }, []);

  /* datos form */
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [tecnicoAsignado, setTecnicoAsignado] = useState(null);

  const tiposDeProveedores = [
    { id: 1, tipo_proveedor: "Tipo 1" },
    { id: 2, tipo_proveedor: "Tipo 2" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar el envío del formulario
    console.log({ nombre, tipo, fechaIngreso });
  };

  /* end datos form */

  return (
    <div className="taller-ctn">
      <div className="taller-title-search">
        <h1>Entrada y Salida de equipos</h1>
        <div
          className="search"
          style={{ display: "flex", alignItems: "center" }}
        >
          <h4
            className="caja-input-text"
            style={{
              marginTop: "5px",
              marginLeft: "50px",
              marginRight: "25px",
            }}
          >
            Filtrar por fecha{" "}
          </h4>
          <input
            className="caja-input"
            type="text"
            placeholder="dd/mm/aaaa"
            style={{ marginRight: "-1px" }}
          />
          <button className="caja-button-search">🔍︎</button>
        </div>
      </div>

      <Table striped hover>
        <thead>
          <tr>
            <th onClick={() => handleSort("equipo")}>
              Producto{" "}
              {orderBy === "equipo" ? orderAsc ? "▲" : "▼" : <span>▼</span>}
            </th>
            <th onClick={() => handleSort("marca")}>
              Marca{" "}
              {orderBy === "marca" ? orderAsc ? "▲" : "▼" : <span>▼</span>}
            </th>
            <th onClick={() => handleSort("modelo")}>
              Modelo{" "}
              {orderBy === "modelo" ? orderAsc ? "▲" : "▼" : <span>▼</span>}
            </th>
            <th onClick={() => handleSort("created_at")}>
              Fecha{" "}
              {orderBy === "created_at" ? orderAsc ? "▲" : "▼" : <span>▼</span>}
            </th>
            <th onClick={() => handleSort("tecD")}>
              Técnico D.{" "}
              {orderBy === "tecD" ? orderAsc ? "▲" : "▼" : <span>▼</span>}
            </th>
            <th onClick={() => handleSort("tecT")}>
              Técnico T.{" "}
              {orderBy === "tecT" ? orderAsc ? "▲" : "▼" : <span>▼</span>}
            </th>
            <th onClick={() => handleSort("numero_orden")}>
              N° Orden{" "}
              {orderBy === "numero_orden" ? (
                orderAsc ? (
                  "▲"
                ) : (
                  "▼"
                )
              ) : (
                <span>▼</span>
              )}
            </th>
            <th onClick={() => handleSort("cliente")}>
              N° Cliente{" "}
              {orderBy === "cliente" ? orderAsc ? "▲" : "▼" : <span>▼</span>}
            </th>
            <th onClick={() => handleSort("estado")}>
              Estado{" "}
              {orderBy === "estado" ? orderAsc ? "▲" : "▼" : <span>▼</span>}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((factura, index) => (
            <tr key={index}>
              <td>{factura.equipo}</td>
              <td>{factura.marca}</td>
              <td>{factura.modelo}</td>
              <td>
                {format(new Date(factura.created_at), "dd/MM/yyyy", {
                  locale: es,
                })}
              </td>
              <td>{factura.Empleado.direccion}</td>
              <td>
                {editIndex === index ? (
                  <select
                    className="form-select"
                    value={selectedTecnico}
                    onChange={handleTecnicoChange}
                  >
                    {empleados.map((empleado) => (
                      <option key={empleado.id} value={empleado.id}>
                        {empleado.nombre} {empleado.apellido}
                      </option>
                    ))}
                  </select>
                ) : (
                  `${factura.Empleado.nombre} ${factura.Empleado.apellido}`
                )}
              </td>
              <td>{factura.numero_orden}</td>
              <td>{factura.Cliente.numero_cliente}</td>
              <td>
                {editIndex === index ? (
                  <select
                    className="form-select"
                    value={selectedEstado}
                    onChange={handleEstadoChange}
                  >
                    {estados.map((estado) => (
                      <option key={estado.id} value={estado.id}>
                        {estado.tipo_estado}
                      </option>
                    ))}
                  </select>
                ) : (
                  `${factura.TiposEstado.tipo_estado}`
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="imgEditar"
                      onClick={() => handleSave(index)}
                      style={{ cursor: "pointer" }}
                    >
                      <circle cx="12" cy="12" r="12" fill="#6A678D" />
                      <path
                        d="M9 12.2l2.2 2.2L15.5 9"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    &nbsp;&nbsp;&nbsp;
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="imgEditar"
                      onClick={() => setEditIndex(null)}
                      style={{ cursor: "pointer" }}
                    >
                      <circle cx="12" cy="12" r="12" fill="#6A678D" />
                      <path
                        d="M15 9L9 15"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 9l6 6"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                ) : (
                  <>
                    <div className="d-flex">
                      <img
                        src={editar}
                        alt="editar"
                        className="imgEditar"
                        onClick={() => handleEdit(index)}
                      />
                      <div className="divMas" onClick={() => handleShow(index)}>
                        <span className="spanMas">+</span>
                      </div>
                    </div>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* ModalAsignarRepuestos */}
      <ModalAsignarRepuestos
        showModal={showModal}
        handleClose={handleClose}
        ordenSeleccionada={ordenSeleccionada}
        stockDataSeleccionada={false}
        tecnicoAsignado={tecnicoAsignado}
        repuestos={repuestos}
        handleAsignarRepuestos={async (repuestosSeleccionados) => {
          console.log("Repuestos asignados:", repuestosSeleccionados);
          for (const repuesto of repuestosSeleccionados) {
            const repuestoData = {
              ordenId: ordenSeleccionada.id,
              tecnicoId: tecnicoAsignado.id,
              repuestoId: repuesto.id,
              cantidad: repuesto.cantidad,
            };

            const success = await guardarOrdenRepuesto(repuestoData);

            if (success) {
              alert("Repuesto asignado correctamente");
              console.log("Repuesto asignado correctamente");
            }

            if (!success) {
              console.log("Error al asignar el repuesto:", repuesto);
            }
          }
        }}
      />
    </div>
  );
};

export default Taller;