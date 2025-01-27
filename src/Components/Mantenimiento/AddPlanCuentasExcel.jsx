import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import ExcelJS from "exceljs";
import Header from "../Header/Header";
import trash from "../../images/trash.webp";
import { guardarPlanCuentas } from "../../services/planCuentasService";
import "./AddPlanCuentasExcel.css";

const AddPlanCuentasExcel = ({
  columnas = ["Código", "Nombre", "Tipo", "Parent ID"],
}) => {
  const [items, setItems] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleDelete = (index) => {
    const nuevosItems = items.filter((_, i) => i !== index);
    setItems(nuevosItems);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const savePromises = items.map((cuenta) => guardarPlanCuentas(cuenta));
      await Promise.all(savePromises);
      alert("Todas las cuentas se han agregado con éxito");
      navigate("/mantenimiento");
    } catch (error) {
      console.error("Error al agregar cuentas:", error);
      alert("Hubo un problema al agregar las cuentas");
    }
  };

  const handleGuardar = () => {
    if (!uploadedFile) {
      console.log("No se ha subido ningún archivo.");
    } else {
      console.log("Guardando en la base de datos...");
      console.log("Archivo a guardar:", uploadedFile);
    }
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();

      reader.onload = async (e) => {
        const buffer = e.target.result;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        const worksheet = workbook.getWorksheet(1);
        const data = [];

        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber > 1) {
            const rowData = {
              codigo: row.getCell(1).value,
              nombre: row.getCell(2).value,
              tipo: row.getCell(3).value,
              parent_id: row.getCell(4).value || null,
            };
            data.push(rowData);
          }
        });

        setItems(data);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div>
      <Header text="Cargar plan de cuentas desde Excel" />
      <div className="agregar-plan-cuentas-excel-container">
        <div className="agregar-plan-cuentas-heading">
          <h1>Cargar archivo</h1>
          <input type="file" onChange={handleFileUpload} />
        </div>

        <div>
          <h2>Agregando las siguientes cuentas</h2>
          <ul className="row p-0 text-center">
            {columnas &&
              columnas.map((columna, index) => (
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
                    {Object.entries(item).map(([key, valor], i) => (
                      <li key={i} className="col text-center">
                        {valor}
                      </li>
                    ))}
                  </div>
                  <li className="d-flex justify-content-end position-relative ">
                    <div className="d-flex">
                      <img
                        src={trash}
                        onClick={() => handleDelete(index)}
                        alt="Eliminar"
                        className="imgEditar"
                      />
                    </div>
                  </li>
                </ul>
              </div>
            ))}
          </ul>

          <div className="d-flex justify-content-center">
            <button
              className="rounded-pill bg-info text-white boton-plan-cuentas-continuar"
              onClick={handleOpenModal}
            >
              Continuar
            </button>
          </div>

          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>¿Qué deseas hacer?</h2>
                <div className="modal-buttons">
                  <button className="modal-btn" onClick={handleSave}>
                    Guardar sin factura
                  </button>
                </div>
                <button className="modal-close" onClick={handleCloseModal}>
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

AddPlanCuentasExcel.propTypes = {
  columnas: PropTypes.array,
};

export default AddPlanCuentasExcel;
