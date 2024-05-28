import React, { useState } from 'react';
import DatosCliente from './DatosCliente';
import DatosIncidente from './DatosIncidente';
import DatosTecnico from './DatosTecnico';
import './OrdenDetalle.css';
import caja from '../../../images/caja.webp';
import nuevaOrden from '../../../images/nuevaOrdenTrabajo.webp';
import dolar from '../../../images/signoDolar.webp';
import { Link } from 'react-router-dom';
const OrdenDetalle = () => {
  const tecnico = {
    nombre: 'Alan',
    apellido: 'Almendra',
    legajo: 'TC-9987654',
  };
  const [show, setShow] = useState(false);
  return (
    <div className='contentDetail'>
      <div>
        <h1>Orden #25645</h1>
        <span>Estado: Pendiente de aprobacion</span>
      </div>
      <DatosTecnico nombre={tecnico.nombre} apellido={tecnico.apellido} legajo={tecnico.legajo} />
      <DatosCliente nombre='Martin' apellido='Inchiausti' legajo='CL-0123456' telefono='112345678' direccion='Corrientes 654' localidad='CABA' />
      <DatosIncidente equipo='lavarropa' modelo='1234' antiguedad='4 años' diagnostico='jabonitis aguda' />
      <div className='d-flex justify-content-evenly position-relative'>
        <div className='orders-btn'>
          <button className='bg-primary rounded-pill text-white'>Declinar</button>
          <button className='bg-primary rounded-pill text-white'>Aprobar</button>
        </div>
        <aside className={`d-flex flex-column ${show ? 'asideButtons' : 'positionButton'} justify-content-end`}>
          {show && (
            <>
              <Link to='/ordenes/ordenGlobal' className='text-decoration-none'>
                <center className='imageContainer bg-info rounded-circle position-relative'>
                  <img className='iconsOptions position-absolute iconDolar' src={dolar} alt='' />
                  <span className='black-text' style={{ fontSize: '14px' }}>
                    Aumento Global
                  </span>
                </center>
              </Link>
              <Link to='/ordenes/cobrarCaja' className='text-decoration-none'>
                <center className='imageContainer bg-info rounded-circle position-relative'>
                  <img className='iconsOptions' src={caja} alt='' />
                  <span className='black-text' style={{ fontSize: '14px' }}>
                    Cobrar en caja
                  </span>
                </center>
              </Link>
              <Link to='/ordenes/nuevaOrden' className='text-decoration-none'>
                <center className='imageContainer bg-info rounded-circle position-relative'>
                  <img className='iconsOptions' src={nuevaOrden} alt='' />
                  <span className='black-text' style={{ fontSize: '14px' }}>
                    Nueva orden de trabajo
                  </span>
                </center>
              </Link>
            </>
          )}
          <h2 className='bg-info text-white text-center rounded-pill agregarRepuesto' onClick={() => setShow(!show)}>
            +
          </h2>
        </aside>
      </div>
    </div>
  );
};

export default OrdenDetalle;
