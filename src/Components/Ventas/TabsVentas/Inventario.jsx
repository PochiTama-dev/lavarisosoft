import { useEffect, useState } from 'react';
import Grilla from '../../Grilla/Grilla';
import './Inventario.css';
import cargar from '../../../images/cargarExcel.webp';
import descargar from '../../../images/descargarExcel.webp';
import editar from '../../../images/editar.webp';
import { useCustomContext } from '../../../hooks/context.jsx';
import { Table } from 'react-bootstrap';
// import { listaRepuestos } from '../../../services/repuestosService.jsx';
// import { listaStockCamioneta } from '../../../services/stockCamionetaService.jsx';
// import { modificarStockCamioneta } from '../../../services/stockCamionetaService.jsx';
// import ModalAsignarRepuestos from '../../Mantenimiento/TabsMantenimiento/ModalAsignarRepuestos';

const Inventario = () => {
  const { handleNavigate } = useCustomContext();
  const [pestaña, setPestaña] = useState('Stock');
  const [show, setShow] = useState(false);
  const [stockData, setStockData] = useState([]);
  const [reservaData, setReservaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tecnicos, setTecnicos] = useState([]);

  // Manejador de búsqueda
  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  // Filtrar datos de stock según el término de búsqueda
  const filteredStockData = stockData.filter((item) => {
    try {
      if (item.Repuesto) {
        return item.Repuesto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      }
    } catch (error) {
      console.error('Error al acceder a item.Repuesto:', error);
    }
    return false;
  });

  // Obtener datos de stock desde la API
  const fetchStockData = async () => {
    try {
      const response = await fetch('https://lv-back.online/stock/principal/lista');
      return await response.json();
    } catch (error) {
      console.error('Error fetching stock data:', error);
      return [];
    }
  };

  // Obtener datos de técnicos desde la API
  const fetchTecnicos = async () => {
    try {
      const response = await fetch('https://lv-back.online/empleados');
      const empleados = await response.json();
      return empleados.filter((empleado) => empleado.id_rol === 5);
    } catch (error) {
      console.error('Error obteniendo los tecnicos: ', error);
      return [];
    }
  };

  // Obtener datos de reserva desde la API
  const fetchReservaData = async () => {
    try {
      const response = await fetch('https://lv-back.online/stock/reserva/lista');
      return await response.json();
    } catch (error) {
      console.error('Error fetching reserva data:', error);
      return [];
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [stock, tecnicos, reservas] = await Promise.all([fetchStockData(), fetchTecnicos(), fetchReservaData()]);
        setStockData(stock);
        setTecnicos(tecnicos);
        setReservaData(reservas);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    // fetchCamionetaData();
    // fetchRepuestos();
  }, []);
  const mergedReservaData = reservaData.map((reserva) => {
    // Buscar el objeto correspondiente en stockData que coincida con el id_repuesto
    const repuesto = stockData.find((stock) => stock.id_repuesto === reserva.id_repuesto);

    // Devolver un nuevo objeto que combine la data original de reserva y agregue el objeto Repuesto si existe
    return {
      ...reserva,
      Repuesto: repuesto ? repuesto.Repuesto : null,
    };
  });
  /* console.log(stockData);
  console.log(reservaData);
  console.log(mergedReservaData); */

  if (loading) {
    return <div>Loading...</div>;
  }

  const columnasReporteVentas = ['Nombre', 'ID', 'Precio', 'No.Orden'];
  const itemsReporteVentas = [
    { nombre: 'Reporte 1', id: 1, precio: 1000, nOrden: 10000 },
    { nombre: 'Reporte 2', id: 2, precio: 2000, nOrden: 20000 },
    { nombre: 'Reporte 3', id: 3, precio: 3000, nOrden: 30000 },
  ];

  const handleShow = () => setShow(!show);

  return (
    <div className='bg-secondary inventario-container'>
      <h1 className='text-primary'>Inventario</h1>
      <ul className='d-flex justify-content-around'>
        {['Stock', 'Stock Camionetas', 'Reserva', 'Reporte de ventas'].map((name) => (
          <li key={name} onClick={() => setPestaña(name)} className={`pestañasInventario ${pestaña === name ? 'pestañasInventarioActive' : ''}`}>
            {name}
          </li>
        ))}
      </ul>
      <div>
        <h2 className='caja-input-text'>Buscar piezas</h2>
        <input className='caja-input' type='text' placeholder='Buscar' value={searchTerm} onChange={handleSearchChange} />
        <button className='caja-button-search'>🔍︎</button>
      </div>
      {pestaña === 'Stock' && (
        <div className='grilla-inventario'>
          <Table hover className='grilla-stock'>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>ID</th>
                <th>Precio</th>
                <th>Disponibles</th>
              </tr>
            </thead>
            <tbody className='grilla-stock-body'>
              {filteredStockData.map((stock, index) => (
                <tr key={index} className={index % 2 === 0 ? '' : 'row-even'}>
                  <td>{stock.Repuesto.descripcion}</td>
                  <td>{stock.id}</td>
                  <td>${stock.precio}</td>
                  <td>{stock.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {pestaña === 'Stock Camionetas' && (
        <div className='grilla-inventario'>
          <Table hover className='grilla-camioneta'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Técnico</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Patente</th>
              </tr>
            </thead>
            <tbody className='grilla-camioneta-body'>
              {tecnicos.map((tec, index) => (
                <tr key={index} className={index % 2 === 0 ? '' : 'row-even'}>
                  <td>{tec.id}</td>
                  <td>
                    {tec.nombre} {tec.apellido}
                  </td>
                  <td>{tec.Vehiculo?.marca}</td>
                  <td>{tec.Vehiculo?.modelo}</td>
                  <td>{tec.Vehiculo?.patente}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {pestaña === 'Reserva' && (
        <div className='grilla-inventario'>
          <Table hover className='grilla-reserva'>
            <thead>
              <tr>
                <th>Técnico</th>
                <th>Repuesto</th>
                <th>Disponibles</th>
              </tr>
            </thead>
            <tbody className='grilla-reserva-body'>
              {mergedReservaData.map((reserva, index) => (
                <tr key={index} className={index % 2 === 0 ? '' : 'row-even'}>
                  <td>
                    {reserva.Empleado.nombre} {reserva.Empleado.apellido}
                  </td>
                  <td>{reserva.Repuesto ? reserva.Repuesto.descripcion : 'null'}</td>
                  <td>{reserva.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {pestaña === 'Reporte de ventas' && <Grilla columnas={columnasReporteVentas} elementos={itemsReporteVentas} />}
      <ul className='d-flex justify-content-left w-100 imagenes'>
        <div className='text-end'>
          <button className='boton3Puntos' onClick={handleShow}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        {show && (
          <div className='d-flex justify-content-around inventario-botones'>
            <li>
              <img src={descargar} alt='Descargar el excel' />
              <span>Descargar Excel</span>
            </li>
            <li>
              <img src={editar} alt='editar' onClick={() => handleNavigate('editarStockRepuestos')} />
              <span>Editar</span>
            </li>
            <li onClick={() => handleNavigate('addLoteExcel')}>
              <img src={cargar} alt='Carga de excel' />
              <span>Carga Excel</span>
            </li>
            <li className='d-flex' onClick={() => handleNavigate('addRespuestos')}>
              <div className='divMas'>
                <span className='spanMas'>+</span>
              </div>
              <span style={{ paddingLeft: '4%', minWidth: '160px' }}>Agregar repuestos</span>
            </li>
          </div>
        )}
      </ul>
    </div>
  );
};

export default Inventario;
