import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Table from 'react-bootstrap/Table';
import '../clientesEmpleados.css'
 
const Clientes = () => {
    const clientesData = [
  {   "nombre": "Juan",
  "apellido": "Perez",
  "legajo": 123,
  "ordenAsignada": "A001",
  "telefono": "123-456-789",
  "direccion": "Calle Principal 123",
  "altura": 1.75,
  "datoB": "Valor B",
  "datoC": "Valor C",
  "whatsapp": 2996666666 },
  {  "nombre": "María",
  "apellido": "García",
  "legajo": 456,
  "ordenAsignada": "A002",
  "telefono": "987-654-321",
  "direccion": "Avenida Secundaria 456",
  "altura": 1.65,
  "datoB": "Otro Valor B",
  "datoC": "Otro Valor C",
  "whatsapp": 2996666666},
 
];

  return (
    <div className='clientes-ctn'>

    <Table striped  hover>
      <thead>
        <tr>
        <th className="text-nowrap">Nombre</th>
          <th className="text-nowrap">Apellido</th>
          <th className="text-nowrap">Legajo</th>
          <th className="text-nowrap">Orden Asignada</th>
          <th className="text-nowrap">Telefono</th>
          <th className="text-nowrap">Direccion</th>
          <th className="text-nowrap">Dato B</th>
          <th className="text-nowrap">Dato C</th>
          <th className="text-nowrap">WhatsApp</th>
        </tr>
      </thead>
      <tbody>
        {clientesData.map((cliente, index) => (
          <tr key={index}>
            <td>{cliente.nombre}</td>
            <td>{cliente.apellido}</td>
            <td>{cliente.legajo}</td>
            <td>{cliente.ordenAsignada}</td>
            <td>{cliente.telefono}</td>
            <td>{cliente.direccion}</td>
            <td>{cliente.datoB}</td>
            <td>{cliente.datoC}</td>
            <td>{cliente.whatsapp}</td>
          </tr>
        ))}
      </tbody>
    </Table>
    </div>
  );
};

export default Clientes;