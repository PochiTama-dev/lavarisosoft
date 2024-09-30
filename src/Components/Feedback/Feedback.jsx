import './Feedback.css';
import Header from '../Header/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useCustomContext } from '../../hooks/context';

const Feedback = () => {
  const { getFeedbacks, handleNavigate } = useCustomContext();
  const [showOrders, setShowOrders] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [feedbackEmpleados, setFeedbackEmpleados] = useState([]);
  const [allFeedbacks, setAllFeedbacks] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderSelected, setOrderSelected] = useState(null);
  const [nombre, setNombre] = useState('');
  const [selectedTab, setSelectedTab] = useState('orders');

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    const feedbacks = await getFeedbacks();
    setAllFeedbacks(feedbacks);

    // Filtrar empleados por correos únicos
    const uniqueEmails = new Set();
    const employees = feedbacks
      .map((feedback) => feedback.Empleado)
      .filter((empleado) => {
        if (uniqueEmails.has(empleado.email)) return false;
        uniqueEmails.add(empleado.email);
        return true;
      });

    // Filtrar órdenes por número único
    const uniqueOrders = new Set();
    const allOrders = feedbacks.map((feedback) => feedback.Ordene).filter((order) => order && !uniqueOrders.has(order.numero_orden) && uniqueOrders.add(order.numero_orden));

    setEmpleados(employees);
    setOrders(allOrders);
  };

  const handleShowOrder = (nombreEmpleado, index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));

    const employeeFeedbacks = allFeedbacks.filter((feedback) => feedback.Empleado.nombre === nombreEmpleado);
    const filteredOrders = employeeFeedbacks.map((feedback) => feedback.Ordene).filter((order) => order && !showOrders.some((o) => o.numero_orden === order.numero_orden));

    setShowOrders(filteredOrders);
  };

  const handleSelectOrder = async (empleado, numeroOrden) => {
    handleName(empleado);

    const selectedOrder = showOrders.find((order) => order.numero_orden === numeroOrden);
    setOrderSelected(selectedOrder);

    const orderFeedback = allFeedbacks.find((feedback) => feedback.id_orden === selectedOrder.id && feedback.id_empleado === empleado.id);
    setFeedback(orderFeedback);
  };

  const handleName = (empleado) => {
    setNombre(empleado.nombre);
    setOrderSelected(null);

    const employeeFeedbacks = allFeedbacks.filter((feedback) => feedback.to_id_employee === empleado.id && !feedback.id_orden);
    setFeedbackEmpleados(employeeFeedbacks);
    setFeedback('');
  };

  const handleTab = (tab, empleado) => {
    setSelectedTab(tab);
    if (tab === 'employees') {
      handleName(empleado);
    }
  };
  const handleEmployee = (employee) => {
    setFeedback(employee);
  };
  return (
    <div className='container-full-width'>
      <Header text='Feedback' />
      <div className='content-container'>
        <div className='left-containers'>
          <div>
            <h1 className='pointer' onClick={() => handleNavigate('feedback/empleado')}>
              Enviar feedback
            </h1>
          </div>
          <div className='left-container'>
            <h2 className='p-3 feedback-containers-heading'>Empleados</h2>
            <div className='scrollable-container-top'>
              {empleados.map((empleado, i) => (
                <div className='feedback-tecnicos-container' key={i}>
                  <h3 className='feedback-tecnicos-heading' onClick={() => handleName(empleado)}>
                    {empleado.nombre}
                  </h3>
                  <ul onClick={() => handleShowOrder(empleado.nombre, i)} className='feedback-tecnico'>
                    <li> </li>
                  </ul>
                  {activeIndex === i && (
                    <>
                      <ul className='d-flex justify-content-evenly'>
                        <li className={`pointer ${selectedTab === 'orders' ? 'active' : ''} mx-2`} onClick={() => handleTab('orders', empleado)}>
                          Órdenes
                        </li>
                        <li className={`pointer ${selectedTab === 'employees' ? 'active' : ''} mx-2`} onClick={() => handleTab('employees', empleado)}>
                          Empleados
                        </li>
                      </ul>
                      <ul className='feedback-ordenes'>
                        {selectedTab === 'orders' &&
                          showOrders.map((order, index) => (
                            <li key={index} onClick={() => handleSelectOrder(empleado, order.numero_orden)}>
                              Orden #{order.numero_orden} hecho por {empleado.nombre}
                            </li>
                          ))}
                        {selectedTab === 'employees' &&
                          feedbackEmpleados.map((employee, index) => (
                            <li key={index} onClick={() => handleEmployee(employee)}>
                              Feedback de {employee.Empleado.nombre}
                            </li>
                          ))}
                      </ul>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className='left-container'>
            <h2 className='p-3 feedback-containers-heading'>Por número de orden</h2>
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
          <h2 className='p-3 feedback-containers-heading'>
            {orderSelected || nombre
              ? `${orderSelected ? `Orden #${orderSelected.numero_orden} hecho por ${nombre}` : ''} ${!orderSelected && nombre ? 'Feedback a ' + nombre : ''}`
              : 'Seleccionar orden o empleado'}
          </h2>

          {nombre && !orderSelected && feedbackEmpleados.length > 0 && (
            <div className='d-flex justify-content-evenly'>
              <h3>hecho por </h3>
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
