import { useEffect, useState } from "react";
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
import "./PlanCuentas.css";

const PlanCuentas = () => {
  const { handleNavigate } = useCustomContext();
  const [data, setData] = useState([]);
  const [visibleNodes, setVisibleNodes] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [parentForNewChild, setParentForNewChild] = useState(null);
  const [editNode, setEditNode] = useState(null);
  const [editNodeName, setEditNodeName] = useState("");
  const [allExpanded, setAllExpanded] = useState(false);

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
    if (!newChildName.trim()) {
      alert("El nombre del nuevo nodo no puede estar vacío.");
      return;
    }

    try {
      let newCode;
      if (parentForNewChild === null) {
        const rootNodes = getRootNodes();
        if (rootNodes.length > 0) {
          const lastRootCode = rootNodes
            .map((node) => node.codigo)
            .sort()
            .pop();

          newCode = (parseInt(lastRootCode, 10) + 1).toString();
        } else {
          newCode = "1";
        }
      } else {
        const parentChildren = getChildrenNodes(parentForNewChild);
        const parentNode = data.find((node) => node.id === parentForNewChild);
        const parentCode = parentNode?.codigo || "";

        if (parentChildren.length > 0) {
          const lastChildCode = parentChildren
            .map((child) => child.codigo)
            .sort()
            .pop();

          const parts = lastChildCode.split(".");
          parts[parts.length - 1] = parseInt(parts[parts.length - 1], 10) + 1;
          newCode = parts.join(".");
        } else {
          newCode = `${parentCode}.1`;
        }
      }

      await guardarPlanCuentas({
        parent_id: parentForNewChild,
        nombre: newChildName,
        codigo: newCode,
      });

      setModalVisible(false);
      setNewChildName("");

      await fetchData();
    } catch (error) {
      console.error("Error al guardar el nuevo nodo:", error);
      alert("Hubo un error al guardar el nuevo nodo.");
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
      const children = getChildrenNodes(node.id);
      if (children.length > 0) {
        orderedData = orderedData.concat(getOrderedData(children, level + 1));
      }
    });
    return orderedData;
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const orderedData = getOrderedData(getRootNodes());
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

  const renderTree = (nodes, level = 0) => {
    return (
      <ul
        style={{
          listStyleType: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        {nodes.map((node) => (
          <li key={node.id} style={{ paddingLeft: `${level * 20}px` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}  >
              <span
                onClick={() => toggleVisibility(node.id)}
                style={{
                  cursor: "pointer",
                  fontWeight: "500",
                  fontSize: "20px",
                }}
              >
                {node.codigo} - {node.nombre}
              </span>

              <button
                onClick={() => {
                  setParentForNewChild(node.id);
                  setModalVisible(true);
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
    <div className="plan-cuentas-ctn" >
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
          Agregar datos mediante PDF
        </button>
      </div>

      {data.length > 0 ? renderTree(getRootNodes()) : <p>Cargando datos...</p>}

      <button
        onClick={() => {
          setParentForNewChild(null);
          setModalVisible(true);
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
      {modalVisible && (
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
              onClick={() => setModalVisible(false)}
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
      {modalVisible && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            zIndex: 999,
          }}
          onClick={() => setModalVisible(false)}
        ></div>
      )}
      {editNode && (
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
              onClick={() => setEditNode(null)}
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
