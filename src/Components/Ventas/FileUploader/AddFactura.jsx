import React, { useState, useEffect } from 'react';
import FileUploader from './FileUploader';
import './addFactura.css';

const AddFactura = () => {
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    proveedor: '',
    repuesto: '',
    cantidad: '',
    importe: '',
    codigoImputacion: '',
    fechaIngreso: getCurrentDate(),
  });
  const [proveedoresList, setProveedoresList] = useState([]);
 
  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      const response = await fetch('https://lv-back.online/proveedores');
      const proveedores = await response.json();
      setProveedoresList(proveedores);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
    }
  };

  const handleFileUpload = (uploadedFile) => {
    setFile(uploadedFile);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const saveFactura = async () => {
    try {
      let imageBase64 = '';

      if (file) {
        imageBase64 = await convertToBase64(file);
      }

      const data = {
        id_proveedor: formData.proveedor,
        id_repuesto: formData.repuesto || '',
        cantidad: formData.cantidad,
        importe: formData.importe,
        codigo_imputacion: formData.codigoImputacion,
        fecha_ingreso: formData.fechaIngreso,
        imagen_comprobante: imageBase64,
      };

      const response = await fetch('https://lv-back.online/facturas/guardar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la factura');
      }

      const result = await response.json();
      console.log('Factura guardada exitosamente:', result);
    } catch (error) {
      console.error('Error al guardar la factura:', error);
    }
  };

  return (
    <div className="addFactura-ctn">
      <div className="file-uploader-with-form">
        <FileUploader onFileUpload={handleFileUpload} />

        <div className="form-group">
          <label htmlFor="fechaIngreso">Fecha de Ingreso</label>
          <input
            type="date"
            id="fechaIngreso"
            name="fechaIngreso"
            value={formData.fechaIngreso}
            onChange={handleInputChange}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="proveedor">Proveedor</label>
          <select
            id="proveedor"
            name="proveedor"
            value={formData.proveedor}
            onChange={handleInputChange}
          >
            <option value="">Selecciona un proveedor</option>
            {proveedoresList.map((proveedor) => (
              <option key={proveedor.id} value={proveedor.id}>
                {proveedor.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="repuesto">Repuesto</label>
          <input
            type="text"
            id="repuesto"
            name="repuesto"
            value={formData.repuesto}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="cantidad">Cantidad</label>
          <input
            type="number"
            id="cantidad"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="importe">Importe</label>
          <input
            type="number" 
            id="importe"
            name="importe"
            value={formData.importe}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="codigoImputacion">Código Imputación</label>
          <input
            type="text"
            id="codigoImputacion"
            name="codigoImputacion"
            value={formData.codigoImputacion}
            onChange={handleInputChange}
          />
        </div>

        <button onClick={saveFactura} className="submit-button">
          Enviar
        </button>
      </div>
    </div>
  );
};

export default AddFactura;
