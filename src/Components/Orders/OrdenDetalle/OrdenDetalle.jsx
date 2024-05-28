import DatosCliente from './DatosCliente';
import DatosIncidente from './DatosIncidente';
import DatosTecnico from './DatosTecnico';
import './OrdenDetalle.css';
import caja from '../../../images/caja.webp';
import nuevaOrden from '../../../images/nuevaOrdenTrabajo.webp';
import dolar from '../../../images/signoDolar.webp';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const OrdenDetalle = () => {
  const navigate = useNavigate();
  const tecnico = {
    nombre: 'Alan',
    apellido: 'Almendra',
    legajo: 'TC-9987654',
  };
  const [show, setShow] = useState(false);

  const handleNavigate = (text) => {
    navigate(text);
  };
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
        <button className='bg-primary rounded-pill text-white'>Declinar</button>
        <button className='bg-primary rounded-pill text-white'>Aprobar</button>
        <aside className={`d-flex flex-column ${show ? 'asideButtons' : 'positionButton'} justify-content-end`}>
          {show && (
            <>
              <center className='imageContainer bg-info rounded-circle position-relative' onClick={() => handleNavigate('/ordenes/ordenGlobal')}>
                <img className='iconsOptions position-absolute iconDolar' src={dolar} alt='' />
                <span className='text-black'>Aumento Global</span>
              </center>
              <center className='imageContainer bg-info rounded-circle position-relative' onClick={() => handleNavigate('/ordenes/cobrarCaja')}>
                <img className='iconsOptions' src={caja} alt='' />
                <span className='text-black'>Cobrar en caja</span>
              </center>
              <center className='imageContainer bg-info rounded-circle position-relative' onClick={() => handleNavigate('/ordenes/nuevaOrden')}>
                <img className='iconsOptions' src={nuevaOrden} alt='' />
                <span className='text-black'>Nueva orden de trabajo</span>
              </center>
            </>
          )}
          <h2 className='bg-info  text-white text-center rounded-pill agregarRepuesto' onClick={() => setShow(!show)}>
            +
          </h2>
        </aside>
      </div>
    </div>
  );
};
export default OrdenDetalle;
