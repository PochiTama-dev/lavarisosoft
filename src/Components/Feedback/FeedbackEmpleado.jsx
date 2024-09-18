import './Feedback.css';
import Header from '../Header/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useRef, useState } from 'react';
import { useCustomContext } from '../../hooks/context';

const FeedbackEmpleado = () => {
  const { getEmpleadosLista, ordenes, sendFeedback, user } = useCustomContext();
  const [showOrders, setShowOrders] = useState({});
  const [orderSelected, setOrderSelected] = useState();
  const [orderEmpleado, setOrderEmpleado] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [nombre, setNombre] = useState();
  const [activeIndex, setActiveIndex] = useState(null);
  const [userLogged, setUserLogged] = useState();

  const feedbackRef = useRef();

  useEffect(() => {
    getEmpleados();
  }, []);
  const getEmpleados = async () => {
    const empleados = await getEmpleadosLista();
    const getOrdenes = await ordenes();
    setShowOrders(getOrdenes);
    setEmpleados(empleados);
    const usuarioLocal = empleados.find((empleado) => empleado.email === user.email);
    setUserLogged(usuarioLocal);
  };

  const handleName = (nombre) => {
    setNombre(nombre);
    const employeeOrder = showOrders.filter((employee) => employee.Empleado.nombre === nombre);
    setOrderEmpleado(employeeOrder);
    setOrderSelected({ numero_orden: '' });
  };

  const handleSendFeedback = async () => {
    const feedbackValue = await feedbackRef.current.value;
    const feedbackToEmployee = empleados.find((empleado) => empleado.nombre === nombre);

    const nuevoFeedback = {
      feedback: feedbackValue,
      id_empleado: userLogged.id,
      id_orden: orderSelected?.id,
      to_id_employee: orderSelected.id === undefined ? feedbackToEmployee.id : null,
    };
    console.log(nuevoFeedback);
    await sendFeedback({ ...nuevoFeedback });
    return nuevoFeedback;
  };

  const handleSelectOrder = (orden) => {
    const newOrderSelected = showOrders.find((order) => order.numero_orden === orden);
    //console.log(newOrderSelected);
    setOrderSelected(newOrderSelected);
    setNombre(newOrderSelected.Empleado.nombre);
  };

  const handleShow = (index, nombre) => {
    setOrderSelected({ numero_orden: ' ' });
    setNombre(nombre);
    const employeeOrder = showOrders.filter((employee) => employee.Empleado.nombre === nombre);
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    setOrderEmpleado(employeeOrder);
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
                        {t.id_rol === 1 ? 'Atencion al cliente' : t.id_rol === 2 ? 'Contable administrativo' : t.id_rol === 3 ? 'Jefe de taller' : t.id_rol === 4 ? 'Administrador' : 'Tecnico'}
                      </span>
                      <h3 className='feedback-tecnicos-heading pointer' onClick={() => handleName(t.nombre)}>
                        {t.nombre}
                      </h3>
                    </div>
                    <ul className='feedback-tecnico'>
                      <li onClick={() => handleShow(i, t.nombre)}></li>
                    </ul>
                  </div>
                  {activeIndex === i && (
                    <ul className='feedback-ordenes'>
                      {orderEmpleado.map((orden, index) => (
                        <li key={index} onClick={() => handleSelectOrder(orden.numero_orden)}>
                          Orden # {`${orden.numero_orden} ${orden.Cliente.nombre} ${orden.Cliente.apellido}`}
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
            {nombre ? `${orderSelected.numero_orden && `Orden # ${orderSelected.numero_orden} de`} ${nombre}` : 'Seleccionar orden o empleado'}
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
