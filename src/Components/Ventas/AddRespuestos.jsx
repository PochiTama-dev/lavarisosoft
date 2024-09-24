import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import './AddRepuestos.css';
import { useState, useEffect } from 'react';

const AgregarRepuesto = () => {
  const [repuesto, setRepuesto] = useState({
    nombre: '',
    id_repuesto: 0,
    id_proveedor: '',
    precio: 0,
    cantidad: 0,
  
    lote: '',
    fecha_ingreso: '',
  });
  const [proveedoresList, setProveedoresList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRepuesto((prevRepuesto) => ({
      ...prevRepuesto,
      [name]: value,
    }));

    if (name === 'id_proveedor') {
      const proveedorSeleccionado = proveedoresList.find(proveedor => proveedor.id === parseInt(value));
      if (proveedorSeleccionado) {
        const fechaActual = new Date().toISOString().split('T')[0].split('-').reverse().join('');  
        const lote = `${proveedorSeleccionado.nombre.toUpperCase()}${fechaActual}`;
        setRepuesto((prevRepuesto) => ({
          ...prevRepuesto,
          lote: lote,
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    try {
      const fechaActual = new Date().toISOString().split('T')[0].split('-').reverse().join(''); // Convertir la fecha al formato ddmmyyyy

      // Actualizar repuesto con la fecha actual
      const repuestoConFecha = {
        ...repuesto,
        fecha_ingreso: fechaActual,
      };

      // Enviar los datos completos incluyendo los campos obligatorios
      const response = await fetch('https://lv-back.online/stock/principal/guardar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(repuestoConFecha),  // Usar el objeto con la fecha actualizada
      });

      if (response.ok) {
        alert('Repuesto agregado con éxito');
      } else {
        const errorData = await response.json();
        console.error('Error al agregar repuesto:', errorData);
        alert('Hubo un problema al agregar el repuesto.');
      }
    } catch (error) {
      console.error('Error de red o al agregar repuesto:', error);
    }
  };

  const handleRedirect = () => {
    navigate('/addFactura');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Header text="Agregar un repuesto" />
      <div className="stockContainer">
        <h1 style={{ marginLeft: '5%' }}>Agregar un producto</h1>
        <div className="agregar-repuesto-formulario">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={repuesto.nombre}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="id_repuesto">ID Repuesto</label>
              <input
                type="number"
                id="id_repuesto"
                name="id_repuesto"
                value={repuesto.id_repuesto}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="id_proveedor">Proveedor</label>
              <select
                id="id_proveedor"
                name="id_proveedor"
                value={repuesto.id_proveedor}
                onChange={handleChange}
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
              <label htmlFor="precio">Precio</label>
              <input
                type="number"
                id="precio"
                name="precio"
                value={repuesto.precio}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="cantidad">Cantidad</label>
              <input
                type="number"
                id="cantidad"
                name="cantidad"
                value={repuesto.cantidad}
                onChange={handleChange}
              />
            </div>
          
            <div>
              <label htmlFor="lote">Lote</label>
              <input
                type="text"
                id="lote"
                name="lote"
                value={repuesto.lote}
                onChange={handleChange}
                disabled 
              />
            </div>
            <button type="submit">Continuar</button>
          </form>
        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>¿Qué deseas hacer?</h2>
              <div className="modal-buttons">
                <button className="modal-btn" onClick={handleRedirect}>
                  Cargar factura y guardar
                </button>
                <button className="modal-btn" onClick={handleGuardar}>
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
  );
};

export default AgregarRepuesto;
