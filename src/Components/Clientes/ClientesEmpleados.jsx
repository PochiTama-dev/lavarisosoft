 
import Tab from "../Tabs/Tab";
import Tabs from "../Tabs/Tabs";
import {  useState } from "react";
import {  Dropdown } from 'react-bootstrap'
 import Clientes from "./TabsClientesEmpleados/Clientes";
 import Empleados from "./TabsClientesEmpleados/Empleados";
 import 'bootstrap/dist/css/bootstrap.min.css';
 import "./clientesEmpleados.css"
 import { useNavigate } from 'react-router-dom'; 
 import Header from "../Header/Header";
 
const ClientesEmpleados = () => {
  const [active, setActive] = useState(0);
  const handleChange = (newActive) => setActive(newActive);
  const navigate = useNavigate();
  const handleNavigateToAddEmpleado = () => {
    navigate('/uploadEmpleado');  
  };
  
  return (
    <div className="vw-100 p-3 ">
      <Header text='Clientes y Empleados'></Header>
  
     <div className=" cye-ctn">
        <Tabs active={active} onChange={handleChange} className="client-tabs"  >
          <Tab title="Clientes">
         <Clientes/>
          </Tab>
          <Tab title="Empleados">
          <Empleados/>
          </Tab>
        </Tabs>
      </div>
      <Dropdown drop="up" className="btn-cye">
  <Dropdown.Toggle variant="light" id="dropdown-menu" className="rounded-circle custom-dropdown-toggle custom-dropdown-btn">
    <span className="dots">...</span>
  </Dropdown.Toggle>
  <Dropdown.Menu className="dropdown-menu-up">
    <Dropdown.Item>Descargar Excel</Dropdown.Item>
    <Dropdown.Item>Editar</Dropdown.Item>
    <Dropdown.Item>Cargar Excel</Dropdown.Item>
    <Dropdown.Item onClick={handleNavigateToAddEmpleado}>Agregar Empleado</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
    </div>
  );
}

export default ClientesEmpleados;