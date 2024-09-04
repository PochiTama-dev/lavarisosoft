import './Feedback.css';
import Header from '../Header/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useCustomContext } from '../../hooks/context';

const Feedback = () => {
  const { getFeedbacks } = useCustomContext();
  const [showOrders, setShowOrders] = useState({});
  const [empleados, setEmpleados] = useState([]);
  const [feedbackEmpleados, setFeedbackEmpleados] = useState();
  const [allFeedbacks, setAllFeedbacks] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [activeIndex, setActiveIndex] = useState();
  const [orders, setOrders] = useState([]);
  const [orderSelected, setOrderSelected] = useState();
  const [nombre, setNombre] = useState();

  useEffect(() => {
    feedbacks();
  }, []);
  const feedbacks = async () => {
    const feedbacks = await getFeedbacks();
    setAllFeedbacks(feedbacks);
    // Utilizamos un Set para almacenar los correos electrónicos únicos
    const uniqueEmails = new Set();
    // Filtramos empleados con correos repetidos
    const employees = feedbacks
      .map((feedback) => feedback.Empleado)
      .filter((empleado) => {
        // Verificamos si el correo ya existe en el Set
        if (uniqueEmails.has(empleado.email)) {
          return false; // Si ya existe, lo excluimos
        } else {
          // Si no existe, lo agregamos al Set y lo incluimos en el array filtrado
          uniqueEmails.add(empleado.email);
          return true;
        }
      });
    const uniqueOrder = new Set();
    const allOrders = feedbacks
      .map((feedback) => feedback.Ordene)
      .filter((numOrder) => {
        if (numOrder === null) {
          return false; // Excluimos si order o numero_orden es null o undefined
        }
        if (uniqueOrder.has(numOrder.numero_orden)) {
          return false;
        } else {
          uniqueOrder.add(numOrder.numero_orden);
          return true;
        }
      });
    setEmpleados(employees);
    setOrders(allOrders);
  };
  const handleShowOrder = (nombre, index) => {
    /*
    console.log('Empleados', employees); */
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    const uniqueNumOrder = new Set();
    const feedbackEmployee = allFeedbacks.filter((feedback) => feedback.Empleado.nombre === nombre);
    const feedback = feedbackEmployee
      .map((feedback) => feedback.Ordene)
      .filter((order) => {
        if (!order || !order.numero_orden) {
          return false; // Excluimos si order o numero_orden es null o undefined
        }
        // Verificamos si el correo ya existe en el Set
        if (uniqueNumOrder.has(order.numero_orden)) {
          return false; // Si ya existe, lo excluimos
        } else {
          // Si no existe, lo agregamos al Set y lo incluimos en el array filtrado
          uniqueNumOrder.add(order.numero_orden);
          return true;
        }
      });
    setShowOrders(feedback);
  };

  const handleSelectOrder = async (empleado, orden) => {
    const newOrderSelected = await showOrders.filter((order) => order.numero_orden === orden);
    setOrderSelected(newOrderSelected);
    setNombre();
    setOrderSelected(newOrderSelected[0]);
    const getFeedback = allFeedbacks.find((feedback) => feedback.id_orden === newOrderSelected[0].id && feedback.id_empleado === empleado.id);
    setFeedback(getFeedback);
    //console.log("Feedback de orden ",feedback);
  };

  const handleName = (empleado) => {
    setNombre(empleado.nombre);
    setOrderSelected();
    const getEmployees = allFeedbacks.filter((feedback) => feedback.to_id_employee === empleado.id && feedback.id_orden === null);
    setFeedbackEmpleados(getEmployees);
    setFeedback({ feedback: '' });
  };

  const handleEmployee = (employee) => {
    setFeedback(employee);
  };

  return (
    <div className='container-full-width'>
      <Header text='Feedback' />
      <div className='content-container'>
        <div className='left-containers'>
          <div className='left-container'>
            {/* Contenedor izquierdo superior */}
            <h2 className='p-3 feedback-containers-heading'>Empleados</h2>
            {/* Lista de elementos por número técnico */}
            <div className='scrollable-container-top'>
              {empleados?.map((t, i) => (
                <>
                  <div className='feedback-tecnicos-container' key={i}>
                    <h3 className='feedback-tecnicos-heading' onClick={() => handleName(t)}>
                      {t.nombre}
                    </h3>
                    <ul onClick={() => handleShowOrder(t.nombre, i)} className='feedback-tecnico'>
                      <li></li>
                    </ul>
                  </div>
                  {activeIndex === i && (
                    <ul className='feedback-ordenes'>
                      {showOrders.map((order, index) => (
                        <li key={index} onClick={() => handleSelectOrder(t, order.numero_orden)}>
                          Orden #{order.numero_orden}
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
              {orders.map((order, index) => (
                <li key={index} className='scrollable-container-bottom-item'>
                  <h5>#{order.numero_orden}</h5>
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
            {orderSelected || nombre ? `${orderSelected ? `Orden #${orderSelected.numero_orden}` : ''} ${(nombre && 'Feedback a ' + nombre) || ''}` : 'Seleccionar orden o empleado'}
          </h2>
          {!orderSelected && nombre ? (
            <div className='d-flex justify-content-evenly'>
              <h3>hecho por</h3>
              <select>
                <option value='' disabled selected>
                  Seleccione un empleado
                </option>
                {feedbackEmpleados.map((employee, index) => (
                  <option key={index} value={index} onClick={() => handleEmployee(employee)}>
                    {employee.Empleado.nombre}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            ''
          )}

          <div className='feedback-form'>
            <h6 className='p-3 feedback-form-charge'></h6>
            <textarea className='feedback-textarea' value={feedback.feedback}></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
