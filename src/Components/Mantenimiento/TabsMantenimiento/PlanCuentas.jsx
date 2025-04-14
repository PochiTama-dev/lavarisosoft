import { useEffect, useState, useContext } from "react";
import {
  listaPlanCuentas,
  guardarPlanCuentas,
  modificarPlanCuentas,
  eliminarPlanCuentas,
} from "../../../services/planCuentasService";
import jsPDF from "jspdf";
import "jspdf-autotable";
import expandIcon from "../../../assets/expand_icon.png";
import collapseIcon from "../../../assets/collapse_icon.png";
import { useCustomContext } from "../../../hooks/context";
import Table from "react-bootstrap/Table";
import "./PlanCuentas.css";
import { listaFacturasVentas } from "../../../services/facturaVentasService";
import { listaFacturasCompras } from "../../../services/facturaComprasService";
import { obtenerLiquidaciones } from "../../../services/liquidacionesService";
import { listaCajas } from "../../../services/cajasService";

const PlanCuentas = () => {
  const { handleNavigate } = useCustomContext();
  const [data, setData] = useState([]);
  const [visibleNodes, setVisibleNodes] = useState({});
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [modalOperacionesVisible, setModalOperacionesVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [newChildCode, setNewChildCode] = useState("");
  const [parentForNewChild, setParentForNewChild] = useState(null);
  const [editNode, setEditNode] = useState(null);
  const [editNodeName, setEditNodeName] = useState("");
  const [allExpanded, setAllExpanded] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [facturasVenta, setFacturasVenta] = useState([]);
  const [facturasCompra, setFacturasCompra] = useState([]);
  const [liquidaciones, setLiquidaciones] = useState([]);
  const [cajas, setCajas] = useState([]);
  const [codigoImputacion, setCodigoImputacion] = useState("");
  const [operacionesFiltradas, setOperacionesFiltradas] = useState([]);

  const fetchData = async () => {
    try {
      const response = await listaPlanCuentas();
      setData(response);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ventas = await listaFacturasVentas();
        const compras = await listaFacturasCompras();
        const liquidacionesData = await obtenerLiquidaciones();
        const cajasData = await listaCajas();

        setFacturasVenta(ventas || []);
        setFacturasCompra(compras || []);
        setLiquidaciones(liquidacionesData || []);
        setCajas(cajasData || []);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    fetchData();
  }, []);

  const toggleVisibility = (nodeId) => {
    setVisibleNodes((prevState) => ({
      ...prevState,
      [nodeId]: !prevState[nodeId],
    }));
  };

  const toggleAllNodes = () => {
    const newVisibleNodes = {};
    data.forEach((node) => {
      newVisibleNodes[node.id] = !allExpanded;
    });
    setVisibleNodes(newVisibleNodes);
    setAllExpanded(!allExpanded);
  };

  const getRootNodes = () => data.filter((node) => !node.parent_id);

  const getChildrenNodes = (parentId) =>
    data.filter((node) => node.parent_id === parentId);

  const addChildNode = async () => {
    if (!newChildName.trim() || !newChildCode.trim()) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      const newNode = {
        nombre: newChildName,
        codigo: newChildCode,
        parent_id: parentForNewChild,
      };

      await guardarPlanCuentas(newNode);
      alert("Nuevo plan de cuentas agregado con éxito.");
      setModalAgregarVisible(false);
      setNewChildName("");
      setNewChildCode("");
      await fetchData();
    } catch (error) {
      console.error("Error al agregar el nuevo plan de cuentas:", error);
      alert("Hubo un error al agregar el nuevo plan de cuentas.");
    }
  };

  const handleEditNode = async () => {
    if (!editNodeName.trim()) {
      alert("El nombre del nodo no puede estar vacío.");
      return;
    }

    try {
      await modificarPlanCuentas(editNode.id, { nombre: editNodeName });
      setEditNode(null);
      setEditNodeName("");
      setModalEditarVisible(false);
      await fetchData();
    } catch (error) {
      console.error("Error al modificar el nodo:", error);
      alert("Hubo un error al modificar el nodo.");
    }
  };

  const handleDeleteNode = async (nodeId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este nodo?")) {
      try {
        await eliminarPlanCuentas(nodeId);
        await fetchData();
      } catch (error) {
        console.error("Error al eliminar el nodo:", error);
        alert("Hubo un error al eliminar el nodo.");
      }
    }
  };

  const getOrderedData = (nodes, level = 0) => {
    let orderedData = [];
    nodes.forEach((node) => {
      orderedData.push({
        codigo: node.codigo,
        nombre: node.nombre,
        tipo: node.parent_id ? "Subnivel" : "Nivel Principal",
      });
      if (node.children && node.children.length > 0) {
        orderedData = orderedData.concat(
          getOrderedData(node.children, level + 1)
        );
      }
    });
    return orderedData;
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const orderedData = getOrderedData(data);
    const tableData = orderedData.map((item) => [
      item.codigo,
      item.nombre,
      item.tipo,
    ]);

    doc.text("Plan de Cuentas", 14, 10);
    doc.text(
      `Fecha de generación: ${new Date().toLocaleDateString("es-ES")}`,
      14,
      20
    );

    doc.autoTable({
      startY: 30,
      head: [["Código", "Nombre", "Tipo"]],
      body: tableData,
      margin: { top: 30, left: 10, right: 10 },
      styles: { fontSize: 10 },
    });

    doc.save("plan_de_cuentas.pdf");
  };

  const ordenarPlanCuentas = async () => {
    setLoading(true);
    try {
      const cuentas = await listaPlanCuentas();

      const codigoToIdMap = {};
      cuentas.forEach((cuenta) => {
        codigoToIdMap[cuenta.codigo] = cuenta.id;
      });

      for (const cuenta of cuentas) {
        if (cuenta.parent_id !== null) {
          console.log(
            `El nodo con código ${cuenta.codigo} ya tiene un parent_id (${cuenta.parent_id}), no se modifica.`
          );
          continue;
        }

        let parentCodigo = null;

        if (cuenta.codigo.length === 5) {
          parentCodigo = cuenta.codigo.slice(0, 1) + "0000";
          if (!codigoToIdMap[parentCodigo]) {
            parentCodigo = cuenta.codigo.slice(0, 2) + "000";
          }
        } else if (cuenta.codigo.length > 5) {
          parentCodigo = cuenta.codigo.slice(0, 3) + "00";
        }

        const parent_id = parentCodigo
          ? codigoToIdMap[parentCodigo] || null
          : null;

        if (parent_id === cuenta.id) {
          console.error(
            `Error: El parent_id calculado (${parent_id}) es igual al id de la cuenta (${cuenta.id}).`
          );
          continue;
        }

        if (parent_id !== cuenta.parent_id) {
          console.log(
            `Actualizando cuenta: ${cuenta.codigo} con ParentID: ${parent_id}`
          );
          await modificarPlanCuentas(cuenta.id, { parent_id });
        }
      }

      alert("El plan de cuentas ha sido ordenado correctamente.");
      await fetchData();
    } catch (error) {
      console.error("Error al ordenar el plan de cuentas:", error);
      alert("Hubo un error al ordenar el plan de cuentas.");
    } finally {
      setLoading(false);
    }
  };

  const buscarOperaciones = () => {
    console.log("Función buscarOperaciones llamada");
    if (!codigoImputacion.trim()) {
      alert("Por favor, ingrese un código de imputación válido.");
      return;
    }

    const facturasVentaFiltradas = facturasVenta.filter(
      (factura) => factura.codigo_imputacion === codigoImputacion
    );
    const facturasCompraFiltradas = facturasCompra.filter(
      (factura) => factura.codigo_imputacion === codigoImputacion
    );
    const cajasFiltradas = cajas.filter(
      (caja) => caja.codigo_imputacion === codigoImputacion
    );
    const liquidacionesFiltradas = liquidaciones.filter(
      (liquidacion) => liquidacion.codigo_imputacion === codigoImputacion
    );

    const filtradas = [
      ...facturasVentaFiltradas,
      ...facturasCompraFiltradas,
      ...cajasFiltradas,
      ...liquidacionesFiltradas,
    ];

    console.log("Operaciones filtradas:", filtradas);

    setOperacionesFiltradas(filtradas);
    setModalOperacionesVisible(true);
  };

  const cerrarModal = () => {
    setModalOperacionesVisible(false);
  };

  const renderTree = (nodes, level = 0) => {
    return (
      <ul
        style={{
          listStyleType: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {nodes.map((node) => (
          <li key={node.id} style={{ paddingLeft: `${level * 20}px` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                onClick={() => toggleVisibility(node.id)}
                style={{
                  cursor: "pointer",
                  fontWeight: "500",
                  fontSize: "20px",
                  marginTop: "10px",
                }}
              >
                {node.codigo} - {node.nombre}
              </span>

              <button
                onClick={() => {
                  setParentForNewChild(node.id);
                  setModalAgregarVisible(true);
                }}
                style={{
                  backgroundColor: "transparent",
                  color: "#69688c",
                  border: "1px solid #69688c",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "30px",
                }}
              >
                +
              </button>

              <button
                onClick={() => {
                  setEditNode(node);
                  setEditNodeName(node.nombre);
                  setModalEditarVisible(true);
                }}
                style={{
                  backgroundColor: "transparent",
                  color: "#69688c",
                  border: "1px solid #69688c",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                ✎
              </button>

              <button
                onClick={() => handleDeleteNode(node.id)}
                style={{
                  backgroundColor: "transparent",
                  color: "red",
                  border: "1px solid red",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                🗑
              </button>
            </div>

            {visibleNodes[node.id] &&
              renderTree(getChildrenNodes(node.id), level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="plan-cuentas-ctn">
      <h1 style={{ marginTop: "40px", marginBottom: "40px" }}>
        Plan de Cuentas
      </h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={toggleAllNodes}
          style={{
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <img
            src={allExpanded ? collapseIcon : expandIcon}
            alt={allExpanded ? "Colapsar Todo" : "Desplegar Todo"}
            style={{ width: "30px", height: "30px" }}
          />
        </button>
        <button
          onClick={exportToPDF}
          style={{
            backgroundColor: "#69688c",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Exportar a PDF
        </button>
        <button
          onClick={() => handleNavigate("agregarPlanCuentasExcel")}
          style={{
            backgroundColor: "#69688c",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Agregar datos mediante Excel
        </button>
        <button
          onClick={ordenarPlanCuentas}
          disabled={isOrdering || loading}
          style={{
            backgroundColor: isOrdering || loading ? "gray" : "#69688c",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: isOrdering || loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Cargando..." : "Ordenar Plan de Cuentas"}
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Ingrese código de imputación"
          value={codigoImputacion}
          onChange={(e) => setCodigoImputacion(e.target.value)}
          style={{
            padding: "10px",
            marginRight: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={buscarOperaciones}
          style={{
            backgroundColor: "#69688c",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Ver Operaciones por Código
        </button>
      </div>

      {loading && <p>Cargando, por favor espere...</p>}

      {data.length > 0 ? (
        renderTree(getRootNodes())
      ) : (
        <p>No hay datos guardados.</p>
      )}

      <button
        onClick={() => {
          setParentForNewChild(null);
          setModalAgregarVisible(true);
        }}
        style={{
          backgroundColor: "#69688c",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Agregar Plan de Cuentas Principal
      </button>
      {modalAgregarVisible && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "20px",
            zIndex: 1000,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <h3>
            {parentForNewChild === null
              ? "Agregar Plan de Cuentas Principal"
              : "Agregar Nuevo Nivel"}
          </h3>
          <input
            type="text"
            placeholder="Código del nuevo nivel"
            value={newChildCode}
            onChange={(e) => setNewChildCode(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Nombre del nuevo nivel"
            value={newChildName}
            onChange={(e) => setNewChildName(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              onClick={addChildNode}
              style={{
                backgroundColor: "#69688c",
                color: "white",
                padding: "10px 10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Guardar
            </button>
            <button
              onClick={() => setModalAgregarVisible(false)}
              style={{
                backgroundColor: "gray",
                color: "white",
                padding: "10px 10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
      {modalOperacionesVisible && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "20px",
            zIndex: 1000,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            width: "80%",
          }}
        >
          <h3>Operaciones para el Código: {codigoImputacion}</h3>
          {operacionesFiltradas.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    ID
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Descripción
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Monto
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody>
                {operacionesFiltradas.map((operacion, index) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {operacion.id || "N/A"}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {operacion.descripcion || "Sin descripción"}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {operacion.monto || operacion.total || "N/A"}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {operacion.created_at
                        ? new Date(operacion.created_at).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No se encontraron operaciones para el código ingresado.</p>
          )}
          <button
            onClick={() => setModalOperacionesVisible(false)}
            style={{
              backgroundColor: "gray",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "20px",
            }}
          >
            Cerrar
          </button>
        </div>
      )}
      {modalEditarVisible && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            width: "30%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "20px",
            zIndex: 1000,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h3>Editar Nombre</h3>
          <input
            type="text"
            placeholder="Nombre del nodo"
            value={editNodeName}
            onChange={(e) => setEditNodeName(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              onClick={handleEditNode}
              style={{
                backgroundColor: "#69688c",
                color: "white",
                padding: "10px 10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Guardar
            </button>
            <button
              onClick={() => setModalEditarVisible(false)}
              style={{
                backgroundColor: "gray",
                color: "white",
                padding: "10px 10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanCuentas;
