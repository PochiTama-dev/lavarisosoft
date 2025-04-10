import { useEffect, useState } from 'react';
import './Inventario.css';
import cargar from '../../../images/cargarExcel.webp';
import descargar from '../../../images/descargarExcel.webp';
import editar from '../../../images/editar.webp';
import { useCustomContext } from '../../../hooks/context.jsx';
import { Table } from 'react-bootstrap';
import fetchDolarBlue from '../../../services/ApiDolarService.jsx';
import Header from '../../Header/Header.jsx';
const Inventario = () => {
  const { handleNavigate } = useCustomContext();
  const [pestaña, setPestaña] = useState('Stock');
  const [show, setShow] = useState(false);
  const [stockData, setStockData] = useState([]);
  const [reservaData, setReservaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tecnicos, setTecnicos] = useState([]);
  const [tasaDolarBlue, setTasaDolarBlue] = useState(null);

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  // eslint-disable-next-line no-unused-vars
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

  const fetchStockData = async () => {
    try {
      const response = await fetch('https://lv-back.online/stock/principal/lista');
      return await response.json();
    } catch (error) {
      console.error('Error fetching stock data:', error);
      return [];
    }
  };

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

  const fetchReservaData = async () => {
    try {
      const response = await fetch('https://lv-back.online/stock/reserva/lista');
      return await response.json();
    } catch (error) {
      console.error('Error fetching reserva data:', error);
      return [];
    }
  };

  useEffect(() => {
    const obtenerTasaDolar = async () => {
      const tasa = await fetchDolarBlue();
      setTasaDolarBlue(tasa);
    };
    obtenerTasaDolar();
  }, []);

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
  }, []);
  const mergedReservaData = reservaData.map((reserva) => {
    const repuesto = stockData.find((stock) => stock.id_repuesto === reserva.id_repuesto);
    return {
      ...reserva,
      cantidad: reserva.cantidad,
      Repuesto: repuesto ? repuesto : null,
    };
  });
  //console.log(mergedReservaData);
  if (loading) {
    return <div>Loading...</div>;
  }

  const totalVisitas = 31;
  const visitasRealizadas = 25;
  const porcentaje = (visitasRealizadas / totalVisitas) * 100;

  const tecnicoss = [
    { nombre: 'Alejandro Pilone', visitas: 0, total: 1 },
    { nombre: 'Enzo Gastón Mondolo', visitas: 2, total: 4 },
    { nombre: 'Roberto Barrionuevo', visitas: 5, total: 5 },
    { nombre: 'Martín Perrone', visitas: 8, total: 10 },
    { nombre: 'Sergio Narballo', visitas: 10, total: 11 },
  ];

  const handleShow = () => setShow(!show);

  return (
    <div className=' inventario-container'>
         <Header text='Inventario' />
  
      <ul className='d-flex justify-content-around'>
        {['Stock', 'Stock Camionetas', 'Reserva', /* 'Reporte de ventas' */].map((name) => (
          <li key={name} onClick={() => setPestaña(name)} className={`pestañasInventario ${pestaña === name ? 'pestañasInventarioActive' : ''}`}>
            {name}
          </li>
        ))}
      </ul>
      {pestaña === 'Reporte de ventas' ? (
        ''
      ) : (
        <div>
          <h2 className='caja-input-text'>Buscar piezas</h2>
          <input className='caja-input' type='text' placeholder='Buscar' value={searchTerm} onChange={handleSearchChange} />
 
        </div>
      )}
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
              {stockData.map((stock, index) => (
                <tr key={index} className={index % 2 === 0 ? '' : 'row-even'}>
                  <td>{stock.nombre}</td>
                  <td>{stock.id}</td>
                  <td>${stock.precio * tasaDolarBlue}</td>
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
                <th>Solicitados</th>
              </tr>
            </thead>
            <tbody className='grilla-reserva-body'>
              {mergedReservaData.map((reserva, index) => (
                <tr key={index} className={index % 2 === 0 ? '' : 'row-even'}>
                  <td>
                    {reserva.Empleado.nombre} {reserva.Empleado.apellido}
                  </td>
                  <td>{reserva.Repuesto ? reserva.Repuesto?.nombre : reserva.StockPrincipal?.nombre}</td>
                  <td>{reserva.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
 {/*      {pestaña === 'Reporte de ventas' && (
        <div className='reporte-diario'>
          <div className='header'>
            <h2>Reporte de Actividad</h2>
            <input type='date' value='2024-09-25' className='fecha' />
          </div>
          <div className='contenido'>
            <div className='panel-izquierdo'>
              <div className='ordenes-trabajo'>
                <p>31 Órdenes de Trabajo del día</p>
                <p>5 Técnicos en calle</p>
                <p>13h. Tiempo de trabajo en campo</p>
              </div>
              <div className='visitas-realizadas'>
                <h3>Visitas realizadas</h3>
                <div className='grafico-circular'>
                  <div className='circular'>
                    <div
                      className='mask full'
                      style={{
                        transform: `rotate(${(porcentaje / 100) * 180}deg)`,
                      }}
                    ></div>
                    <div className='mask half'></div>
                    <div className='inside-circle'>
                      <p>{porcentaje.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
                <p>
                  {visitasRealizadas} de {totalVisitas}
                </p>
              </div>
            </div>

            <div className='panel-derecho'>
              <div className='estadisticas-ordenes'>
                <div className='estadistica ok'>
                  <h4>Cerradas OK</h4>
                  <p>7/31</p>
                  <span className='porcentaje ok'>22.6%</span>
                </div>
                <div className='estadistica desvio'>
                  <h4>Cerradas con Desvío</h4>
                  <p>0/31</p>
                  <span className='porcentaje desvio'>0.0%</span>
                </div>
                <div className='estadistica no-cumplidas'>
                  <h4>Cerradas No Cumplidas</h4>
                  <p>0/31</p>
                  <span className='porcentaje no-cumplidas'>0.0%</span>
                </div>
              </div>

              <div className='visitas-por-tecnico'>
                <h3>Visitas por técnico</h3>
                <ul>
                  {tecnicoss.map((tecnico, index) => (
                    <li key={index}>
                      <span>{tecnico.nombre}</span>
                      <div className='barra-contenedor'>
                        <div
                          className='barra'
                          style={{
                            width: `${(tecnico.visitas / tecnico.total) * 100}%`,
                          }}
                        ></div>
                        <span className='total'>
                          {' '}
                          {tecnico.visitas}/{tecnico.total}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )} */}
      {pestaña === 'Reporte de ventas' ? (
        ''
      ) : (
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
      )}
    </div>
  );
};

export default Inventario;
