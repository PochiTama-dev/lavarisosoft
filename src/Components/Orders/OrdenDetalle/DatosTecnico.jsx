import React from 'react';
import PropTypes from 'prop-types';

const DatosTecnico = ({ nombre, apellido, legajo }) => {
  return (
    <div>
      <h3 className='ms-5 mt-3'>Datos del técnico</h3>
      <div >
        <div className='row'>
          <div className='col-md-4'>
            <div className='mb-3 row align-items-center'>
              <label htmlFor='nombreTecnico' className='col-sm-3 col-form-label'>Nombre:</label>
              <div className='col-sm-8'>
                <input type='text' id='nombreTecnico' value={nombre} disabled className='form-control' />
              </div>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='mb-3 row align-items-center'>
              <label htmlFor='apellidoTecnico' className='col-sm-3 col-form-label'>Apellido:</label>
              <div className='col-sm-8'>
                <input type='text' id='apellidoTecnico' value={apellido} disabled className='form-control' />
              </div>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='mb-3 row align-items-center'>
              <label htmlFor='legajoTecnico' className='col-sm-3 col-form-label'>Legajo:</label>
              <div className='col-sm-8'>
                <input type='text' id='legajoTecnico' value={legajo} disabled className='form-control' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

DatosTecnico.propTypes = {
  nombre: PropTypes.string.isRequired,
  apellido: PropTypes.string.isRequired,
  legajo: PropTypes.string.isRequired,
};

export default DatosTecnico;
