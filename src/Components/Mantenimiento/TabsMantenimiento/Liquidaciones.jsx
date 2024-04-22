import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';
import { datosLiquidaciones } from './DatosFacturas';
import '../mantenimiento.css';

const Liquidaciones = () => {
  const navigate = useNavigate();
  const [expandedRow, setExpandedRow] = useState(null); // Estado para controlar la fila expandida

  const handleLiquidarClick = () => {
    navigate('/liquidacion');
  };

  const handleExpandClick = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <div className='liquidaciones-ctn'>
      <h1>Técnicos a liquidar</h1>
      <Table hover  > 
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cuenta virtual</th>
            <th>Saldo (CV)</th>
            <th>Cuenta Efectivo</th>
            <th>Saldo (CE)</th>
          </tr>
        </thead>
        <tbody>
          {datosLiquidaciones.map((liquidacion, index) => (
            < >
              <tr className={expandedRow === index ? 'expanded-row' : ''} onClick={() => handleExpandClick(index)}> 
                <td>{liquidacion.operacion}</td>
                <td>{liquidacion.numeroOrden}</td>
                <td>{liquidacion.tecnicoD}</td>
                <td>{liquidacion.tecnicoT}</td>
                <td>{liquidacion.cliente}</td>
                <td> 
                    {expandedRow === index ? '\u25B2' : '\u25BC'}
                  </td>
              </tr>
              {expandedRow === index && (
                <tr>
                  <td colSpan="5">
                    Contenido adicional aquí...
                  </td>
                </tr>
              )}
         
            </>
          ))}
        </tbody>
      </Table>
      <button onClick={handleLiquidarClick}>Liquidar</button>
    </div>
  );
};

export default Liquidaciones;