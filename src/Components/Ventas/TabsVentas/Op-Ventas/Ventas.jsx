import { Suspense, useState } from 'react';
import './OpVentas.css';
import PropTypes from 'prop-types';
const Ventas = ({ data }) => {
  const [orderBy, setOrderBy] = useState(null);
  const [orderAsc, setOrderAsc] = useState(true);
  const mediosPagos = (num) => {
    if (num === 1) return 'Echeq';
    else if (num === 2) return 'Efectivo en dólares';
    else if (num === 3) return 'Efectivo en pesos';
    else if (num === 4) return 'Transferencia en dólares';
    else if (num === 5) return 'Transferencia en pesos';
  };

  const handleSort = (columnName) => {
    if (orderBy === columnName) {
      setOrderAsc((prevOrderAsc) => !prevOrderAsc);
    } else {
      setOrderBy(columnName);
      setOrderAsc(true);
    }
  };

  const sortedData = orderBy
    ? [...data].sort((a, b) => {
        const valA = a[orderBy];
        const valB = b[orderBy];
        if (valA === undefined || valB === undefined) return 0;
        if (orderAsc) {
          return valA < valB ? -1 : valA > valB ? 1 : 0;
        } else {
          return valA > valB ? -1 : valA < valB ? 1 : 0;
        }
      })
    : data;

  return (
    <div className='opventas-tab-container'>
      <div>
        <div className='opventas-excel'>
          <h2 className='opventas-excel-heading'>CONSULTAR TipoOperacion</h2>
          <div className='opventas-excel-wrapper'>
            <table className='table'>
              <thead>
                <tr>
                  <th onClick={() => handleSort('created_at')}>Fecha {orderBy === 'created_at' ? orderAsc ? '▲' : '▼' : <span>▼</span>}</th>
                  <th onClick={() => handleSort('operacion')}>Tipo-Operación {orderBy === 'operacion' ? orderAsc ? '▲' : '▼' : <span>▼</span>}</th>
                  <th onClick={() => handleSort('numero_orden')}>N° de orden {orderBy === 'numero_orden' ? orderAsc ? '▲' : '▼' : <span>▼</span>}</th>
                  <th onClick={() => handleSort('Empleado.legajo')}>Legajo-Técnico {orderBy === 'Empleado.legajo' ? orderAsc ? '▲' : '▼' : <span>▼</span>}</th>
                  <th onClick={() => handleSort('Cliente.cuil')}>CUIL-Cliente {orderBy === 'Cliente.cuil' ? orderAsc ? '▲' : '▼' : <span>▼</span>}</th>
                  <th onClick={() => handleSort('Presupuesto.total')}>Monto {orderBy === 'Presupuesto.total' ? orderAsc ? '▲' : '▼' : <span>▼</span>}</th>
                  <th onClick={() => handleSort('Presupuesto.id_medio_de_Pago')}>Medio de pago {orderBy === 'Presupuesto.id_medio_de_Pago' ? orderAsc ? '▲' : '▼' : <span>▼</span>}</th>
                </tr>
              </thead>
              <tbody>
                <Suspense fallback={<h1>Cargando...</h1>}>
                  {sortedData &&
                    sortedData.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? '' : 'row-even'}>
                        <td>{new Date(item.created_at).toLocaleDateString()}</td>
                        <td>{'Aca va algo'}</td>
                        <td>{item.numero_orden}</td>
                        <td>{item.Empleado?.legajo}</td>
                        <td>{item.Cliente?.cuil}</td>
                        <td>{item.Presupuesto?.total}</td>
                        <td>{mediosPagos(item.Presupuesto?.id_medio_de_pago)}</td>
                      </tr>
                    ))}
                </Suspense>
              </tbody>
            </table>
          </div>
          <div className='opventas-export-button-container'>
            <button className='opventas-export-button' type='submit'>
              <svg width='34' height='41' viewBox='0 0 34 41' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M1.22266 27.8945C2.15322 31.3676 4.20378 34.4365 7.05632 36.6254C9.90885 38.8142 13.4039 40.0007 16.9995 40.0007C20.595 40.0007 24.0901 38.8142 26.9427 36.6254C29.7952 34.4365 31.8458 31.3676 32.7763 27.8945'
                  stroke='white'
                  strokeWidth='2'
                />
                <path
                  d='M16.9983 23.6663L15.54 25.4863L16.9983 26.653L18.4566 25.4863L16.9983 23.6663ZM19.3316 2.66634C19.3316 2.04751 19.0858 1.45401 18.6482 1.01643C18.2106 0.578843 17.6171 0.33301 16.9983 0.33301C16.3795 0.33301 15.786 0.578842 15.3484 1.01643C14.9108 1.45401 14.665 2.0475 14.665 2.66634L19.3316 2.66634ZM3.87329 16.153L15.54 25.4863L18.4566 21.8463L6.78996 12.513L3.87329 16.153ZM18.4566 25.4863L30.1233 16.153L27.2066 12.513L15.54 21.8463L18.4566 25.4863ZM19.3316 23.6663L19.3316 2.66634L14.665 2.66634L14.665 23.6663L19.3316 23.6663Z'
                  fill='white'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Ventas.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Ventas;
