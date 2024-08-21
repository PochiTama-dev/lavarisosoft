import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import '../clientesEmpleados.css';
import clientesDb from './clientesData';

const Clientes = () => {
  const [clientesData, setClientesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState();

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

  const handleShowOrders = (index) => {
    console.log(clientesData[index].Ordenes);
    console.log(index);
    setActive(active === index ? null : index);
  };
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
            <>
              <tr key={index}>
                <td>{cliente.nombre}</td>
                <td>{cliente.apellido}</td>
                <td>CL-{cliente.numero_cliente}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.direccion}</td>
                <td className='flecha' onClick={() => handleShowOrders(index)}>
                  {cliente.Ordenes && `${cliente.Ordenes.length} ${active === index ? '▲' : '▼'}`}
                </td>
                {/* <td>{cliente.datoB}</td>
              <td>{cliente.datoC}</td>
              <td>{cliente.whatsapp}</td> */}
              </tr>
              {active === index && (
                <>
                  <tr key={index} onClick={() => handleShowOrders(index)} className='bg-primary-subtle flecha'>
                    <th className='text-nowrap'>Antiguedad</th>
                    <th className='text-nowrap'>Equipo</th>
                    <th className='text-nowrap'>Marca</th>
                    <th className='text-nowrap'>Modelo</th>
                    <th className='text-nowrap'>Diagnostico</th>
                    <th className='text-nowrap'></th>
                  </tr>
                  {cliente.Ordenes.map((orden, orderIndex) => (
                    <tr key={orderIndex} onClick={() => handleShowOrders(index)} className='bg-primary-subtle flecha'>
                      <td>{orden.antiguedad}</td>
                      <td>{orden.equipo}</td>
                      <td>{orden.marca}</td>
                      <td>{orden.modelo}</td>
                      <td>{orden.diagnostico}</td>
                      <td></td>
                    </tr>
                  ))}
                </>
              )}
            </>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Clientes;
