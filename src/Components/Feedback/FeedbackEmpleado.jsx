import './Feedback.css';
import Header from '../Header/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useRef, useState } from 'react';
import { useCustomContext } from '../../hooks/context';

const FeedbackEmpleado = () => {
  const { getEmpleadosLista, ordenes, sendFeedback } = useCustomContext();
  const [showOrders, setShowOrders] = useState({});
  const [orderSelected, setOrderSelected] = useState();

  const [empleados, setEmpleados] = useState([]);
  const [nombre, setNombre] = useState();

  const feedbackRef = useRef();

  useEffect(() => {
    getEmpleados();
  }, []);
  const getEmpleados = async () => {
    const empleados = await getEmpleadosLista();
    const getOrdenes = await ordenes();
    setShowOrders(getOrdenes);
    setEmpleados(empleados);
    //console.log(showOrders);
  };

  const handleName = (nombre) => {
    setNombre(nombre);
    setOrderSelected({ numero_orden: 'Sin seleccionar' });
  };

  const handleSendFeedback = async (event) => {
    event.preventDefault();
    const feedbackValue = feedbackRef.current.value;
    //console.log(orderSelected);
    if (orderSelected.numero_orden !== 'Sin seleccionar') {
      const nuevoFeedback = {
        feedback: feedbackValue,
        id_empleado: orderSelected.Empleado.id,
        id_orden: orderSelected.id,
      };

      await sendFeedback({ ...nuevoFeedback });
    } else alert('Debes seleccionar una orden');
  };

  const handleSelectOrder = (orden) => {
    const newOrderSelected = showOrders.find((order) => order.numero_orden === orden);
    //console.log(newOrderSelected);
    setOrderSelected(newOrderSelected);
    setNombre(newOrderSelected.Empleado.nombre);
  };
  return (
    <div className='container-full-width'>
      <Header text='Feedback' />
      <div className='content-container'>
        <div className='left-containers'>
          <div className='left-container'>
            {/* Lista de elementos por número técnico */}
            <div className='scrollable-container-top'>
              {empleados?.map((t, i) => (
                <>
                  <div className='feedback-tecnicos-container' key={i}>
                    <div className='d-flex flex-column mb-1'>
                      <span>
                        {t.id_rol === 1
                          ? 'Atencion al cliente'
                          : t.id_rol === 2
                          ? 'Contable administrativo'
                          : t.id_rol === 3
                          ? 'Jefe de taller'
                          : t.id_rol === 4
                          ? 'Administrador'
                          : 'Tecnico'}
                      </span>
                      <h3 className='feedback-tecnicos-heading pointer' onClick={() => handleName(t.nombre)}>
                        {t.nombre}
                      </h3>
                    </div>
                    <ul className='feedback-tecnico'>
                      <li></li>
                    </ul>
                  </div>
                  {t.Ordenes && (
                    <ul className='feedback-ordenes'>
                      {t.Ordenes.map((orden, index) => (
                        <li key={index}>
                          Orden #25645 <a href='#'>ver detalles</a>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ))}
            </div>
          </div>
          <div className='left-container'>
            {/* Contenedor izquierdo inferior */}
            <h2 className='p-3 feedback-containers-heading'>Por número de orden</h2>
            {/* Lista de elementos por número de orden */}
            <ul className='scrollable-container-bottom'>
              {showOrders.length > 0 &&
                showOrders.map((order) => (
                  <li key={order.number} className='scrollable-container-bottom-item' onClick={() => handleSelectOrder(order.numero_orden)}>
                    <h5>#{order.numero_orden}</h5>
                    <h5 className={order.TiposEstado.tipo_estado === 'Aprobada' ? 'green-text' : 'orange-text'}>{order.TiposEstado.tipo_estado}</h5>
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <div className='right-container'>
          {/* Contenedor derecho */}
          <h2
            className='p-3
           feedback-containers-heading'
          >
            {nombre || orderSelected ? `Orden #${orderSelected.numero_orden} de ${nombre}` : 'Seleccionar orden o empleado'}
          </h2>
          <div className='feedback-form'>
            <h6 className='p-3 feedback-form-charge'>Cargar feedback</h6>
            <textarea className='feedback-textarea' ref={feedbackRef}></textarea>
          </div>
          <div className='feedback-form-edit'>
            <button className='feedback-form-button' onClick={handleSendFeedback}>
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackEmpleado;
