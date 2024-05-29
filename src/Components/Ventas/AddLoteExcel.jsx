import PropTypes from "prop-types";
import Header from "../Header/Header";
import trash from "../../images/trash.webp";
import { useState } from "react";
import "./AddLoteExcel.css";

const AddLoteExcel = ({ columnas, elementos }) => {
  elementos = [
    {
      nombre: "NombreAbc123",
      id: 4366,
      precio: 2330,
      disponibles: 2,
    },
    {
      nombre: "NombreAbc456",
      id: 43365,
      precio: 2330,
      disponibles: 2,
    },
    {
      nombre: "NombreAbc789",
      id: 435,
      precio: 2330,
      disponibles: 2,
    },
    {
      nombre: "NombreAbc159",
      id: 3165,
      precio: 2330,
      disponibles: 2,
    },
    {
      nombre: "NombreAbc987",
      id: 9894,
      precio: 2330,
      disponibles: 2,
    },
  ];
  columnas = ["Nombre", "ID", "Precio", "Disponibles"];
  const [items, setItems] = useState(elementos);
  const [itemsToDelete, setItemsToDelete] = useState([]);
  const handleDelete = (index) => {
    if (items[index]) {
      const nuevosItems = items.filter((elemento) => elemento !== items[index]);
      setItems(nuevosItems);
    } else {
      setItemsToDelete(items[index]);
      console.log(itemsToDelete);
    }
  };
  return (
    <div>
      <Header text="Cargar lote desde Excel" />
      <div className="agregar-lote-excel-container">
        <div className="agregar-lote-heading">
          <h1>Cargar archivo</h1>
          <input type="file" name="" id="" />
        </div>
        <div>
          <div>
            <h2>Agregando los siguientes repuestos</h2>
            <ul className="row p-0 text-center">
              {columnas.map((columna, index) => (
                <li key={index} className="col">
                  {columna} <span></span>
                </li>
              ))}
            </ul>
            <ul className="grilla">
              {items.map((item, index) => (
                <div key={index} className="itemContainer">
                  <ul
                    className={`ulItem row mb-1 p-0 ${
                      index % 2 === 0 ? "bg-light" : ""
                    }`}
                  >
                    <div className="d-flex itemsExcel">
                      {Object.entries(item).map(([, valor], index) => (
                        <li key={index} className={`col text-center`}>
                          {valor}
                        </li>
                      ))}
                    </div>
                    <li className="d-flex justify-content-end position-relative trash ">
                      <div className="d-flex">
                        <h1
                          className="borrar signo"
                          onClick={() => handleDelete(index)}
                        >
                          +
                        </h1>
                        <h1 className="signo">+</h1>
                        <img src={trash} alt="editar" className="imgEditar" />
                      </div>
                    </li>
                  </ul>
                </div>
              ))}
            </ul>
            <div className="d-flex justify-content-center">
              <button
                className="rounded-pill bg-info text-white boton-lote-guardar"
                onClick={handleDelete}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLoteExcel;

AddLoteExcel.propTypes = {
  columnas: PropTypes.array,
  elementos: PropTypes.array,
};
