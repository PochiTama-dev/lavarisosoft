import Tab from '../Tabs/Tab';
import Tabs from '../Tabs/Tabs';
import { useRef, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import Clientes from './TabsClientesEmpleados/Clientes';
import Empleados from './TabsClientesEmpleados/Empleados';
import 'bootstrap/dist/css/bootstrap.min.css';
import './clientesEmpleados.css';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import { uploadExcelEmpleados } from '../../hooks/excel';
import { useCustomContext } from '../../hooks/context';

const ClientesEmpleados = () => {
  const { uploadEmpleadosExcel } = useCustomContext();
  const fileInputRef = useRef();
  const [active, setActive] = useState(0);
  const handleChange = (newActive) => setActive(newActive);
  const navigate = useNavigate();
  const handleNavigateToAddEmpleado = () => {
    navigate('/uploadEmpleado');
  };
  const handleUpload = () => {
    fileInputRef.current.click();
  };
  const handleUploadEmpleadosExcel = async (event) => {
    try {
      const data = await uploadExcelEmpleados(event);
      const datosString = data.map((datos) => ({
        ...datos,
        cuil: String(datos.cuil),
        legajo: String(datos.legajo),
        telefono: String(datos.telefono),
      }));
      console.log('Datos del Excel:', datosString);
      uploadEmpleadosExcel(datosString);
    } catch (error) {
      console.error('Error al procesar el archivo Excel:', error);
    }
  };
  const handleUploadClientesExcel = () => {
    console.log('Carga de clientes EXCEL');
  };

  const getUploadButtonText = () => {
    return active === 0 ? 'Cargar Excel Clientes' : 'Cargar Excel Empleados';
  };
  return (
    <div className='vw-100 p-3 '>
      <Header text='Clientes y Empleados'></Header>

      <div className=' cye-ctn'>
        <Tabs active={active} onChange={handleChange} className='client-tabs'>
          <Tab title='Clientes'>
            <Clientes />
          </Tab>
          <Tab title='Empleados'>
            <Empleados />
          </Tab>
        </Tabs>
      </div>
      <Dropdown drop='up' className='btn-cye'>
        <Dropdown.Toggle variant='light' id='dropdown-menu' className='rounded-circle custom-dropdown-toggle custom-dropdown-btn'>
          <span className='dots'>...</span>
        </Dropdown.Toggle>
        <Dropdown.Menu className='dropdown-menu-up'>
          <Dropdown.Item>Descargar Excel</Dropdown.Item>
          <Dropdown.Item>Editar</Dropdown.Item>
          <div onClick={handleUpload}>
            <Dropdown.Item>{getUploadButtonText()}</Dropdown.Item>
            {getUploadButtonText() === 'Cargar Excel Empleados' ? (
              <input type='file' name='' id='' ref={fileInputRef} style={{ display: 'none' }} onChange={handleUploadEmpleadosExcel} />
            ) : (
              <input type='file' name='' id='' ref={fileInputRef} style={{ display: 'none' }} onChange={handleUploadClientesExcel} />
            )}
          </div>
          <Dropdown.Item onClick={handleNavigateToAddEmpleado}>Agregar Empleado</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default ClientesEmpleados;
