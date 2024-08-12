import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';

const Empleados = () => {
  const [empleadosData, setEmpleadosData] = useState([]);

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
  }, []); // Empty dependency array means this effect runs once on mount
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
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Empleados;
