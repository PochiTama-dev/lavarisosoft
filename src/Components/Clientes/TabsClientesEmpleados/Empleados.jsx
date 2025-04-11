import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import EditEmpleado from './EditEmpleado';
import editar from '../../../images/editar.webp';
const Empleados = () => {
  const [empleadosData, setEmpleadosData] = useState([]);
  const [modal, setModal] = useState(false);
  const [empleadoSelected, setEmpleadoSelected] = useState({});

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const response = await fetch('https://lv-back.online/empleados');
        const data = await response.json();
        setEmpleadosData(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmpleados();
  }, [modal]);
  const handleEditEmpleado = (empleado) => {
    setEmpleadoSelected(empleado);
    setModal(!modal);
  };
  return (
    <div className='clientes-ctn'>
      <Table striped hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Legajo</th>
            <th>Rol</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>CUIL</th>
            <th>Automóvil</th>
            <th>Porcentaje de arreglo</th>
          </tr>
        </thead>
        <tbody>
          {empleadosData.map((empleado, index) => (
            <tr key={index}>
              <td>{empleado.nombre}</td>
              <td>{empleado.legajo}</td>
              <td>{empleado.TiposRole.tipo_rol}</td>
              <td>{empleado.telefono}</td>
              <td>{empleado.email}</td>
              <td>{empleado.cuil}</td>
              <td>{empleado.automovil}</td>
              <td>{empleado.TiposRole.tipo_rol === 'Técnico' ? `${empleado.porcentaje_arreglo * 100}%` : ''}</td>
              {empleado.TiposRole.tipo_rol === 'Técnico' && <img className='rounded pointer editButton' onClick={() => handleEditEmpleado(empleado)} src={editar} />}
            </tr>
          ))}
          {modal && empleadoSelected && (
            <div className='modal'>
              <EditEmpleado empleado={empleadoSelected} setModal={setModal} setEmpleado={setEmpleadoSelected} />
            </div>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default Empleados;
