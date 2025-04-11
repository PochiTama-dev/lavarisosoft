import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import { useCustomContext } from '../../../hooks/context';
import { useState, useEffect } from 'react';

const Empleados = () => {
  const { getEmpleadosListaCompleta, getLiquidacionesHechas } = useCustomContext();
  const [empleados, setEmpleados] = useState([]);
  const [liquidaciones, setLiquidaciones] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empleadosData = await getEmpleadosListaCompleta();
        const liquidacionesData = await getLiquidacionesHechas();
        setEmpleados(empleadosData || []);
        setLiquidaciones(liquidacionesData || []);
     
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [getEmpleadosListaCompleta, getLiquidacionesHechas]);

  const calculateSaldo = (empleadoId) => {
    return liquidaciones
      .filter((liq) => liq.id_tecnico === empleadoId)
      .reduce((total, liq) => total + parseFloat(liq.monto || 0), 0);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmpleados = empleados.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(empleados.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className='empleados-ctn'>
      <Table striped hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Cuenta</th>
            <th>Saldo</th>
            {/* <th>Cuenta efectivo</th>
            <th>Saldo (CE)</th> */}
          </tr>
        </thead>
        <tbody>
          {currentEmpleados.map((empleado, index) => (
            <tr key={index}>
              <td>{empleado.nombre}</td>
              <td>{empleado.apellido}</td>
              <td>{empleado.cuenta}</td>
              <td>$ {calculateSaldo(empleado.id)}</td>
              {/* <td>{empleado.ctaEfectivo}</td>
              <td>{empleado.saldoCE}</td> */}
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="pagination-container">
        <Pagination>
          {[...Array(totalPages).keys()].map((page) => (
            <Pagination.Item
              key={page + 1}
              active={page + 1 === currentPage}
              onClick={() => handlePageChange(page + 1)}
            >
              {page + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </div>
  );
};

export default Empleados;
