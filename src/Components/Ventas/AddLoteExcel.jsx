import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';  
import ExcelJS from 'exceljs';  // Importa ExcelJS
import Header from '../Header/Header';
import trash from '../../images/trash.webp';
import './AddLoteExcel.css';

const AddLoteExcel = ({ columnas = ["Nombre", "ID Repuesto", "Precio", "Cantidad", "Proveedor", "Lote", "Fecha"] }) => {
  const [items, setItems] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proveedoresList, setProveedoresList] = useState([]);
  const [selectedProveedor, setSelectedProveedor] = useState('');  
  const navigate = useNavigate();  
  const getProveedorNombre = (id) => {
    const proveedor = proveedoresList.find(p => p.id == id);
  
    return proveedor ? proveedor.nombre : 'Desconocido';
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  useEffect(() => {
    if (selectedProveedor) {
      
      const proveedorNombre = getProveedorNombre(selectedProveedor);

      setItems(prevItems => prevItems.map(item => ({
        ...item,
        id_proveedor: selectedProveedor,  
        lote: `${proveedorNombre}${new Date().toISOString().split('T')[0].replace(/-/g, '')}`  
      })));
    }
  }, [selectedProveedor]);

  const fetchProveedores = async () => {
    try {
      const response = await fetch('https://lv-back.online/proveedores');
      const proveedores = await response.json();
   
      setProveedoresList(proveedores);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
    }
  };

  const handleDelete = (index) => {
    console.log('Índice de eliminación:', index);
    console.log('Items antes de la eliminación:', items);
    
    const nuevosItems = items.filter((_, i) => i !== index);
    console.log('Items después de la eliminación:', nuevosItems);
    setItems(nuevosItems);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const fechaActual = new Date().toISOString().split('T')[0].split('-').reverse().join('');  

      for (const repuesto of items) {
        if (!repuesto.id_proveedor) {
          alert(`Falta ID de proveedor para el repuesto: ${repuesto.nombre}`);
          continue;
        }

        const repuestoConFecha = {
          ...repuesto,
          fecha_ingreso: fechaActual,
        };

        const response = await fetch('https://lv-back.online/stock/principal/guardar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(repuestoConFecha),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error al agregar repuesto:', errorData);
          alert(`Hubo un problema al agregar el repuesto: ${repuesto.nombre}`);
          continue;
        }
      }

      alert('Todos los repuestos se han agregado con éxito');
    } catch (error) {
      console.error('Error de red o al agregar repuestos:', error);
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

  const handleRedirect = () => {
    navigate('/addFactura');  
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
          if (rowNumber > 1) {  // Saltar la primera fila (encabezados)
            const rowData = {
              nombre: row.getCell(1).value,
              id_repuesto: row.getCell(2).value,
              precio: row.getCell(3).value,
              cantidad: row.getCell(4).value,
              id_proveedor: selectedProveedor || '',
              lote: `${selectedProveedor || ''}${new Date().toISOString().split('T')[0].replace(/-/g, '')}`,
              fecha: new Date().toLocaleDateString('es-ES').split('/').reverse().join('/')
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
      <Header text="Cargar lote desde Excel" />
      <div className="agregar-lote-excel-container">
        <div className="agregar-lote-heading">
          <h1>Cargar archivo</h1>
          <input type="file" onChange={handleFileUpload} />
        </div>

        <div>
          <h2>Selecciona el proveedor</h2>
          <select 
            value={selectedProveedor}
            onChange={(e) => setSelectedProveedor(e.target.value)}
          >
            <option value="">Selecciona un proveedor</option>
            {proveedoresList.map((proveedor) => (
              <option key={proveedor.id} value={proveedor.id}>
                {proveedor.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h2>Agregando los siguientes repuestos</h2>
          <ul className="row p-0 text-center">
            {columnas && columnas.map((columna, index) => (
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
                        {key === 'id_proveedor' ? getProveedorNombre(valor) :
                          key === 'fecha' ? valor.split('/').reverse().join('/') : valor}
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
              className="rounded-pill bg-info text-white boton-lote-continuar"
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
                  <button className="modal-btn" onClick={handleRedirect}>
                    Cargar factura y guardar
                  </button>
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

AddLoteExcel.propTypes = {
  columnas: PropTypes.array,
};

export default AddLoteExcel;
