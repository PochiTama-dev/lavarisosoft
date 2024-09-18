import "../../Grilla/Grilla.css";
import PropTypes from "prop-types";
import editar from "../../../images/editar2.webp";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Alert } from "react-bootstrap";

const GrillaEditStock = ({ columnas, elementos }) => {
  const navigate = useNavigate();
  const [checkboxStates, setCheckboxStates] = useState(
    elementos.map(() => false)
  );
  const [items, setItems] = useState(elementos);
  const [orderBy, setOrderBy] = useState(null);
  const [orderAsc, setOrderAsc] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const handleEditClick = (item) => {
    navigate(`editarProducto/${item.id}`, {
      state: { product: item },
    });
  };

  const handleDelete = async (item) => {
    try {
      const response = await fetch(
        `https://lv-back.online/stock/principal/eliminar/${item.id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Error al eliminar el elemento");
      }
      const nuevosElementos = items.filter(
        (item) => !itemsToDelete.includes(item)
      );
      setItems(nuevosElementos);
      setCheckboxStates(items.map(() => false));
      setShowModal(false);
    } catch (error) {
      console.error("Error al eliminar elementos:", error);
    }
  };

  const handleDeleteClick = () => {
    const selectedItems = items.filter((_, index) => checkboxStates[index]);
    if (selectedItems.length === 0) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 4000);
      return;
    }
    setItemsToDelete(selectedItems);
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleChecked = (index) => {
    const newCheckboxStates = [...checkboxStates];
    newCheckboxStates[index] = !newCheckboxStates[index];
    setCheckboxStates(newCheckboxStates);
  };

  const handleSort = (columnName) => {
    if (orderBy === columnName) {
      setOrderAsc((prevOrderAsc) => !prevOrderAsc);
    } else {
      setOrderBy(columnName);
      setOrderAsc(true);
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    if (!orderBy) return 0;
    if (orderAsc) {
      return a[orderBy] > b[orderBy] ? 1 : -1;
    } else {
      return a[orderBy] < b[orderBy] ? 1 : -1;
    }
  });

  return (
    <div>
      <ul className="row p-0 text-center">
        {columnas.map((columna, index) => (
          <li
            key={index}
            className="col"
            onClick={() => handleSort(columna.toLowerCase())}
            style={{
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "large",
              marginTop: "2.5%",
            }}
          >
            {columna}{" "}
            {orderBy === columna.toLowerCase() && (orderAsc ? "▲" : "▼")}
          </li>
        ))}
      </ul>
      <ul className="grilla">
        {sortedItems.map((item, index) => (
          <div key={index} className="itemContainer aling-items-center">
            <ul
              style={{ fontWeight: "500", height: "7vh" }}
              className={`ulFlecha row p-0 ${
                index % 2 === 0 ? "bg-light" : ""
              }`}
            >
              {Object.entries(item).map(([, valor], index) => (
                <li key={index} className={`col text-center`}>
                  {valor}
                </li>
              ))}
              <li className="col">
                <div className="d-flex align-items-center">
                  <img
                    src={editar}
                    alt="editar"
                    className="imgEditar"
                    onClick={() => handleEditClick(item)}
                    style={{ cursor: "pointer" }}
                  />
                  <span className="borrar signo" onClick={handleDeleteClick}>
                    +
                  </span>
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    checked={checkboxStates[index]}
                    onChange={() => handleChecked(index)}
                  />
                  <span className="signo">+</span>
                </div>
              </li>
            </ul>
          </div>
        ))}
      </ul>
      <div className="d-flex justify-content-end">
        <button
          className="rounded-pill bg-info text-white botonEliminar"
          onClick={handleDeleteClick}
        >
          Eliminar
        </button>
      </div>
      {showAlert && (
        <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
          No hay elementos seleccionados para eliminar.
        </Alert>
      )}
      <Modal
        show={showModal}
        onHide={handleCancel}
        style={{ width: "40%", marginLeft: "30%" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmación de Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <h4 style={{ fontWeight: "500", marginBottom: "20px" }}>
            Los siguientes productos:
          </h4>
          <ul>
            {itemsToDelete.map((item) => (
              <li
                key={item.id}
                style={{ fontWeight: "500", fontSize: "larger" }}
              >
                {item.nombre}
              </li>
            ))}
          </ul>
          <h5 style={{ fontWeight: "bold", marginTop: "20px" }}>
            Serán eliminados
          </h5>
          <h5 style={{ fontWeight: "bold", marginTop: "20px" }}>
            ¿Desea continuar?
          </h5>
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "center" }}>
          <Button
            style={{ backgroundColor: "#69688C", border: "none" }}
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button
            style={{ backgroundColor: "#69688C", border: "none" }}
            onClick={handleDelete}
          >
            Continuar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

GrillaEditStock.propTypes = {
  columnas: PropTypes.array.isRequired,
  elementos: PropTypes.array.isRequired,
};

export default GrillaEditStock;
