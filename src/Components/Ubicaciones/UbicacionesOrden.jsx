import { useEffect, useState } from 'react';
import Header from '../Header/Header';
import { useLocation } from 'react-router-dom';
import { ordenes, guardarOrden } from '../../services/ordenesService';

import './Ubicaciones.css';
import { useCustomContext } from '../../hooks/context';

const UbicacionesOrden = () => {
  const location = useLocation();
  const { selectedTechnician } = location.state || {};
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const { handleNavigate } = useCustomContext();

  /* const separarDireccion = (direccion) => {
    if (!direccion || typeof direccion !== 'string') {
      return { calle: '', altura: '' };
    }

    const regex = /(.*?)(\d+)\s*$/;
    const match = direccion.match(regex);

    if (match) {
      const calle = match[1].trim();
      const altura = match[2];
      return { calle, altura };
    }

    return { calle: direccion, altura: '' };
  };

  const { calle, altura } = separarDireccion(selectedClient.direccion); */

  const fetchOrdenes = async () => {
    try {
      const data = await ordenes();
      if (data.length > 0) {
        const ordersEmployee = data.filter((orden) => orden.Empleado.id === selectedTechnician.id);
        const ordersAproved = ordersEmployee.filter((order) => order.TiposEstado.id === 1);
        setOrders(ordersAproved); //Todas las ordenes del Tecnico que estan aprobadas
      } else {
        console.log('Aún no se registra ningúna orden...');
      }
    } catch (error) {
      console.error('Error, no se encontraron ordenes en la base de datos....', error);
    }
  };

  /* const handleSubmit = async () => {
    if (selectedClient) {
      const orden = {
        numero_orden: nroNuevaOrden,
        id_cliente: selectedClient.id,
        id_empleado: selectedTechnician.id,
        id_tipo_estado: 4,
        id_tipo_cierre_extendido: null,
        equipo: '',
        marca: '',
        modelo: '',
        antiguedad: 0,
        diagnostico: null,
        motivo: null,
      };
      const ordenGuardada = await guardarOrden(orden);
      console.log('ordenGuardada:', ordenGuardada);
      if (ordenGuardada) {
        alert('Orden guardada con éxito');
        console.log('Orden completa guardada con éxito!!!');
      } else {
        alert('Error al guardar orden');
        console.log('Error al guardar la orden completa...');
      }
    }
  }; */

  const handleSelectOrder = async (ordenId) => {
    const ordenToSelect = orders.find((orden) => orden.id === ordenId);
    setSelectedOrder(ordenToSelect);
  };
  const handleSocket = () => {
    handleNavigate('/location');
  };
  useEffect(() => {
    fetchOrdenes();
    console.log(selectedOrder);
  }, [selectedOrder]);

  return (
    <div className='ventas-container'>
      <Header text='Ubicaciones'></Header>
      <div className='row w-100 p-5 mt-5'>
        {/* <h2 className='pt-3 mb-5 mx-4 feedback-containers-heading'>Nueva orden no.#{nroNuevaOrden}</h2> */}
        <div className='row'>
          <h2 className='px-3 pt-3 feedback-containers-heading'>Seleccionar orden para trabajar</h2>
          {orders &&
            orders.map((orden) => (
              <div key={orden.id} className={`container-lists col ${selectedOrder.id === orden.id ? 'bg-primary-subtle' : ''}`} onClick={() => handleSelectOrder(orden.id)}>
                <div className='scrollable-container-topLocation'>
                  <div className='feedback-tecnicos-container align-items-center'>
                    <h4 className='feedback-tecnicos-heading'>
                      {orden.Cliente.nombre} {orden.Cliente.apellido}
                    </h4>
                  </div>
                  <div className='feedback-tecnicos-container align-items-center'>
                    <h4 className='feedback-tecnicos-heading'>Teléfono: {orden.Cliente.telefono}</h4>
                  </div>
                  <div className='feedback-tecnicos-container align-items-center'>
                    <h4 className='feedback-tecnicos-heading'>Direccion: {orden.Cliente.direccion}</h4>
                  </div>
                  <div className='feedback-tecnicos-container align-items-center'>
                    <h4 className='feedback-tecnicos-heading'>Localidad: {orden.Cliente.ubicacion}</h4>
                  </div>
                  <div className='feedback-tecnicos-container align-items-center'>
                    <h4 className='feedback-tecnicos-heading'>Diagnostico: {orden.diagnostico}</h4>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className='col-7'>
          <div className='container-lists w-100'>
            <h2 className='px-3 pt-3 feedback-containers-heading'>Técnico a cargo</h2>
            <div className='caja-excel'>
              <div className='caja-excel-wrapper px-5'>
                <table className='table'>
                  <tbody>
                    <tr className='row-even'>
                      <td>
                        {selectedTechnician.nombre} {selectedTechnician.apellido}
                      </td>
                      <td>Legajo: {selectedTechnician.legajo}</td>
                      <td>Técnico a domicilio</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className='d-flex justify-content-center'>
          <button className='bg-info rounded-pill text-white' onClick={handleSocket}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UbicacionesOrden;
