import { useState } from 'react';
import Header from '../Header/Header';
import editar from '../../assets/edit.png';
import cash from '../../assets/cash-circulo.png';
import './Presupuestos.css';

const LiquidacionPresupuestos = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLiquidate = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Header text="Liquidación" />
      <div className="liquidacion-presupuestos">
        <h2 className="feedback-containers-heading">Orden #25645</h2>
        <div className="liquidacion-presupuestos-form">
          <div className="span-form-liquida">
            <span>Total:</span>
            <span>Técnico domicilio:</span>
            <span>Técnico taller:</span>
            <span>Técnico entrega:</span>
          </div>
          <div className="inputs-form-liquida">
            <input type="text" />
            <input type="text" />
            <input type="text" />
            <input type="text" />
          </div>
          <div className="container-buttons-form-liquida">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="buttons-form-liquida">
                <img
                  src={editar}
                  alt="editar"
                  onClick={() => handleNavigate('editarStockRepuestos')}
                />
                <img
                  src={cash}
                  alt="cash"
                  onClick={() => handleNavigate('editarStockRepuestos')}
                />
              </div>
            ))}
          </div>
        </div>
        <button onClick={handleLiquidate}>Liquidar</button>
      </div>

      {isModalOpen && (
        <div className="liquidacion-modal-overlay">
          <div className="liquidacion-modal">
            <p>Se está liquidando al técnico a domicilio un monto de:</p>
            <h3>$100790</h3>
            <p>El total restante es de:</p>
            <h3>$5000</h3>
            <div className="liquidacion-modal-buttons">
              <button className="liquidacion-modal-confirm-button" onClick={closeModal}>Confirmar</button>
              <button className="liquidacion-modal-cancel-button" onClick={closeModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiquidacionPresupuestos;