import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import DatosCliente from './DatosCliente';
import DatosIncidente from './DatosIncidente';
import DatosTecnico from './DatosTecnico';
import { modificarOrden } from '../../../services/ordenesService';
import './OrdenDetalle.css';

const OrdenDetalle = ({ orden, onUpdateOrden }) => {
  const navigate = useNavigate();

  if (!orden) {
    return <div>Selecciona una orden para ver los detalles</div>;
  }

  const { numero_orden, equipo, modelo, antiguedad, diagnostico, Cliente, Empleado, TiposEstado } = orden;

  const handleAprobar = async () => {
    try {
      const ordenActualizada = { ...orden, id_tipo_estado: 1 };
      const resultado = await modificarOrden(orden.id, ordenActualizada);
      if (resultado) {
        console.log('Orden aprobada con éxito.');
        onUpdateOrden();
      } else {
        console.log('Error al aprobar la orden.');
      }
    } catch (error) {
      console.error('Error al aprobar la orden:', error);
    }
  };

  const handlePreliminar = async () => {
    try {
      const ordenActualizada = { ...orden, id_tipo_estado: 4 };
      const resultado = await modificarOrden(orden.id, ordenActualizada);
      if (resultado) {
        console.log('Orden preliminar con éxito.');
        onUpdateOrden();
      } else {
        console.log('Error al cambiar estado de la orden.');
      }
    } catch (error) {
      console.error('Error al cambiar estado de la orden:', error);
    }
  };

  const handleDeclinar = async () => {
    try {
      const ordenActualizada = { ...orden, id_tipo_estado: 2 };
      const resultado = await modificarOrden(orden.id, ordenActualizada);
      if (resultado) {
        console.log('Orden declinada con éxito.');
        onUpdateOrden();
      } else {
        console.log('Error al declinar la orden.');
      }
    } catch (error) {
      console.error('Error al declinar la orden:', error);
    }
  };

  const handleRedirect = () => {
    navigate('/remitoOrden', { state: { orden } });
  };

  return (
    <div className='contentDetail'>
      <div>
        <h1>Orden #{numero_orden}</h1>
        <span>Estado: {TiposEstado.tipo_estado}</span>
      </div>
      <DatosTecnico nombre={Empleado.nombre} apellido={Empleado.apellido} legajo={Empleado.legajo} />
      <DatosCliente
        nombre={Cliente.nombre}
        apellido={Cliente.apellido}
        legajo={`CL-${Cliente.id}`}
        telefono={Cliente.telefono}
        direccion={Cliente.direccion}
        localidad={Cliente.ubicacion}
      />
      <DatosIncidente equipo={equipo} modelo={modelo} antiguedad={`${antiguedad} años`} diagnostico={diagnostico} estado={TiposEstado.tipo_estado} />
      <div className='d-flex justify-content-evenly position-relative'>
        {TiposEstado.tipo_estado === 'Pendiente' && (
          <div className='orders-btn'>
            <button className='bg-info rounded-pill text-white' onClick={handleDeclinar}>
              Declinar
            </button>
            <button className='bg-info rounded-pill text-white' onClick={handleAprobar}>
              Aprobar
            </button>
          </div>
        )}
        {TiposEstado.tipo_estado === 'Cancelada' && (
          <div className='orders-btn'>
            <button className='bg-info rounded-pill text-white' onClick={handlePreliminar}>
              Preliminar
            </button>
          </div>
        )}
        {TiposEstado.tipo_estado === 'Aprobada' && (
          <div className='orders-btn'>
            <button className='bg-info rounded-pill text-white' onClick={handleDeclinar}>
              Declinar
            </button>
          </div>
        )}
        {TiposEstado.tipo_estado === 'Cerrada' && (
          <div className='orders-btn'>
            <button className='bg-success rounded-pill text-white' onClick={handleRedirect}>
              Remito
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

OrdenDetalle.propTypes = {
  orden: PropTypes.shape({
    numero_orden: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    id_tipo_estado: PropTypes.number.isRequired,
    equipo: PropTypes.string.isRequired,
    modelo: PropTypes.string.isRequired,
    antiguedad: PropTypes.number.isRequired,
    diagnostico: PropTypes.string.isRequired,
    Cliente: PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      apellido: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      telefono: PropTypes.string.isRequired,
      direccion: PropTypes.string.isRequired,
      ubicacion: PropTypes.string.isRequired,
    }).isRequired,
    Empleado: PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      apellido: PropTypes.string.isRequired,
      legajo: PropTypes.string,
    }).isRequired,
    TiposEstado: PropTypes.shape({
      tipo_estado: PropTypes.string.isRequired,
    }).isRequired,
  }),
  onUpdateOrden: PropTypes.func,
};

export default OrdenDetalle;
