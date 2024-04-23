 
import React, { useState } from 'react';
import './mantenimiento.css'
import cash from '../../assets/cash-circulo.png'
import edit from '../../assets/edit.png'
const Liquidacion = () => {
  const [total, setTotal] = useState( );
  const [tecnicoHome, setTecnicoHome] = useState( );
  const [tecnicoTaller, setTecnicoTaller] = useState( );
  const [tecnicoEntrega, setTecnicoEntrega] = useState( );

  // Funciones para manejar la edición y eliminación aquí

  const handleLiquidate = () => {
    // Lógica para manejar la liquidación
  };

  return (
    <div className='liquidacion'>
      <h1>Liquidación Alan Almendra</h1>
      <div className='liq-table'>

     
      <div>
        <span>Total:</span>
        <span>Técnico domicilio:</span>
        <span>Técnico taller:</span>
        <span>Técnico entrega:</span>
 
      </div>
      <div>
      <input type="text" /> 
      <input type="text" />
      <input type="text" />
      <input type="text" />
      </div>
      </div>
      <button  onClick={handleLiquidate}>
        Liquidar
      </button>
    </div>
  );
};

export default Liquidacion;