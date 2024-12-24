import { useState } from "react";
import { jsPDF } from "jspdf";
import cargar from "../../../images/cargarExcel.webp";
import descargar from "../../../images/descargarExcel.webp";
import editar from "../../../images/editar.webp";

const PlanCuentas = () => {
  const [data, setData] = useState([
    { id: "1", name: "Activo", children: [] },
    { id: "2", name: "Pasivo", children: [] },
  ]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [editingNode, setEditingNode] = useState(null);
  const [newName, setNewName] = useState("");
  const [visibleNodes, setVisibleNodes] = useState({});
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(!show);

  const toggleVisibility = (nodeId) => {
    setVisibleNodes((prevState) => ({
      ...prevState,
      [nodeId]: !prevState[nodeId],
    }));
  };

  const addNode = (parentId, name) => {
    const addToTree = (nodes) => {
      return nodes.map((node) => {
        if (node.id === parentId) {
          const newId = `${parentId}.${node.children.length + 1}`;
          return {
            ...node,
            children: [...node.children, { id: newId, name, children: [] }],
          };
        }
        if (node.children) {
          return { ...node, children: addToTree(node.children) };
        }
        return node;
      });
    };

    setData(addToTree(data));
    setVisibleNodes((prevState) => ({
      ...prevState,
      [parentId]: true,
    }));
  };

  const updateNodeName = (nodeId, name) => {
    const updateTree = (nodes) => {
      return nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, name };
        }
        if (node.children) {
          return { ...node, children: updateTree(node.children) };
        }
        return node;
      });
    };

    setData(updateTree(data));
    setEditingNode(null);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    const traverseTree = (nodes, level = 0) => {
      nodes.forEach((node) => {
        doc.text(
          `${"  ".repeat(level)}${node.id} - ${node.name}`,
          10,
          doc.autoTableEndPosY() + 10
        );
        if (node.children.length > 0) {
          traverseTree(node.children, level + 1);
        }
      });
    };

    doc.text("Plan de Cuentas", 10, 10);
    traverseTree(data);
    doc.save("PlanDeCuentas.pdf");
  };

  const renderTree = (nodes) => {
    return (
      <ul>
        {nodes.map((node) => (
          <li
            key={node.id}
            style={{ marginLeft: `${node.id.split(".").length * 10}px` }}
          >
            {editingNode === node.id ? (
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={() => updateNodeName(node.id, newName)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateNodeName(node.id, newName);
                  }
                }}
                autoFocus
              />
            ) : (
              <span
                onClick={() => {
                  setSelectedNode(node);
                  toggleVisibility(node.id);
                }}
                style={{
                  cursor: "pointer",
                  fontWeight: selectedNode === node ? "bold" : "normal",
                }}
              >
                {node.id} - {node.name}
              </span>
            )}
            <button
              onClick={() => {
                setEditingNode(node.id);
                setNewName(node.name);
              }}
              style={{
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                marginLeft: "10px",
                margin: "2px",
                width: "25px",
                backgroundColor: "transparent",
              }}
            >
              <img
                src={editar}
                alt="editar"
                style={{
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  justifyContent: "center",
                }}
              />
            </button>
            {visibleNodes[node.id] &&
              node.children.length > 0 &&
              renderTree(node.children)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ display: "flex", width: "70vw", height: "82vh" }}>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <h1 style={{ color: "#283959", fontWeight: "bold", paddingTop: "3%" }}>
          Plan de Cuentas
        </h1>
        {renderTree(data)}
        {selectedNode && (
          <div>
            <h3>Gestionar: {selectedNode.name}</h3>
            <button
              onClick={() =>
                addNode(
                  selectedNode.id,
                  `Nuevo Nivel ${selectedNode.children.length + 1}`
                )
              }
              style={{
                borderRadius: "5px",
                backgroundColor: "#69688c",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold",
                marginBottom: "2%",
                padding: "5px 10px",
              }}
            >
              Agregar Nivel
            </button>
          </div>
        )}
        <ul className="d-flex justify-content-left imagenes">
          <div className="text-end">
            <button className="boton3Puntos" onClick={handleShow}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
          {show && (
            <div className="d-flex inventario-botones">
              <li>
                <img src={editar} alt="editar" />
                <span>Editar</span>
              </li>
              <li onClick={exportToPDF}>
                <img src={descargar} alt="Descargar el excel" />
                <span>Descargar PDF</span>
              </li>
              <li>
                <img src={cargar} alt="Carga de excel" />
                <span>Descarga de Excel</span>
              </li>
              <li className="d-flex">
                <div className="divMas">
                  <span className="spanMas">+</span>
                </div>
                <span style={{ paddingLeft: "4%", minWidth: "160px" }}>
                  Carga de Excel
                </span>
              </li>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PlanCuentas;
