import { useEffect, useState } from "react";
import {
  listaPlanCuentas,
  guardarPlanCuentas,
} from "../../../services/planCuentasService";

const PlanCuentas = () => {
  const [data, setData] = useState([]);
  const [visibleNodes, setVisibleNodes] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [parentForNewChild, setParentForNewChild] = useState(null);

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
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
            </div>

            {visibleNodes[node.id] &&
              renderTree(getChildrenNodes(node.id), level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <h1 style={{ marginTop: "40px", marginBottom: "40px" }}>
        Plan de Cuentas
      </h1>

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
    </div>
  );
};

export default PlanCuentas;
