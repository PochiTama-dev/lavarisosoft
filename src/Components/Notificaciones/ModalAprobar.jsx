import { useCustomContext } from '../../hooks/context';
import DatosTecnico from '../Orders/OrdenDetalle/DatosTecnico';

const ModalAprobar = ({ orden, handleClose }) => {
  const { handleNavigate, handleAprobar } = useCustomContext();
  const handleAprove = async () => {
    //await handleAprobar(orden)
  };
  console.log(orden);
  return (
    <div className='modal-overlay'>
      <div className='modal'>
        <div className='modal-content '>
          <div className='modal-body'>
            <div className='modal-header'>
              <h2>Orden # {orden.numero_orden}</h2>
              <aside className='btn-close' onClick={handleClose}></aside>
            </div>
            <DatosTecnico nombre={orden.Empleado.nombre} apellido={orden.Empleado.apellido} />
            <div className='modal-footer'>
              <h5 className='bg-info rounded-pill text-white' onClick={() => handleNavigate('ordenes')}>
                ir a ordenes
              </h5>
              <h5 className='bg-info rounded-pill text-white' onClick={handleAprove}>
                Aprobar
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ModalAprobar;
