import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import '../clientesEmpleados.css';
import clientesDb from './clientesData';

const Clientes = () => {
  const [clientesData, setClientesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientesData = async () => {
      try {
        const data = await clientesDb();
        setClientesData(data);
      } catch (error) {
        console.error('Error fetching clientes data:', error);
        setClientesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClientesData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='clientes-ctn'>
      <Table striped hover>
        <thead>
          <tr>
            <th className='text-nowrap'>Nombre</th>
            <th className='text-nowrap'>Apellido</th>
            <th className='text-nowrap'>Numero de cliente</th>
            <th className='text-nowrap'>Telefono</th>
            <th className='text-nowrap'>Direccion</th>
            <th className='text-nowrap'>Orden Asignada</th>
            {/* <th className='text-nowrap'>Dato B</th>
            <th className='text-nowrap'>Dato C</th>
            <th className='text-nowrap'>WhatsApp</th> */}
          </tr>
        </thead>
        <tbody>
          {clientesData.map((cliente, index) => (
            <tr key={index}>
              <td>{cliente.nombre}</td>
              <td>{cliente.apellido}</td>
              <td>CL-{cliente.numero_cliente}</td>
              <td>{cliente.telefono}</td>
              <td>{cliente.direccion}</td>
              <td>{cliente.ordenAsignada}</td>
              {/* <td>{cliente.datoB}</td>
              <td>{cliente.datoC}</td>
              <td>{cliente.whatsapp}</td> */}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Clientes;
