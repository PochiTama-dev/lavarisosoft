import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FileUploader.css';  

const FileUploader = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);

 
      if (uploadedFile.type.startsWith("image/")) {
        setFilePreview(URL.createObjectURL(uploadedFile));
      } else if (uploadedFile.type === "application/pdf") {
        setFilePreview(URL.createObjectURL(uploadedFile));
      }

 
      setIsModalOpen(true);

 
      onFileUpload(uploadedFile);
    }
  };

  const handleDeleteFile = () => {
 
    setFile(null);
    setFilePreview(null);
    onFileUpload(null);  

 
    if (isModalOpen) {
      setIsModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);  
  };

  return (
    <div className="file-uploader">
 
      <input 
        type="file" 
        accept="image/*,.pdf" 
        onChange={handleFileChange} 
        style={{ display: "none" }} 
        id="fileInput"
      />

    
      <button 
        className="btn-cargar-factura" 
        onClick={() => document.getElementById('fileInput').click()}
      >
        Cargar archivo
      </button>

 
      {file && (
        <div className="file-info">
          <p>Archivo subido: {file.name}</p>

  
          <button className="btn-delete" onClick={handleDeleteFile}>
            Eliminar archivo
          </button>
        </div>
      )}

 
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Vista previa del archivo</h2>
            {filePreview && (
              <>
                {file.type.startsWith("image/") ? (
                  <img src={filePreview} alt="Vista previa" width="400" />
                ) : (
                  <iframe
                    src={filePreview}
                    width="600"
                    height="400"
                    title="Vista previa PDF"
                  ></iframe>
                )}
              </>
            )}
            <button className="close-modal" onClick={handleCloseModal}>
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

FileUploader.propTypes = {
  onFileUpload: PropTypes.func.isRequired,
};

export default FileUploader;
