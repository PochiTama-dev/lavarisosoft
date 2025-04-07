import PropTypes from 'prop-types';

const Saldos = ({ saldos }) => {
  console.log(saldos);
  return (
    <>
      <h2>Proveedores</h2>
      <ul className='p-0'>
        {saldos.providers.map(
          (provider, index) =>
            provider.total - provider.monto_pagado !== 0 && (
              <div key={index} className={`d-flex align-items-center`}>
                <li className='col saldoItem'>Proveedor</li>
                <li className='col saldoItem'>{provider.descripcion}</li>
                <li className={`col saldoItem`}>DEBE</li>
                <li className='col saldoItem text-danger'>${provider.total - provider.monto_pagado}</li>
              </div>
            )
        )}
      </ul>

      <h2>Clientes</h2>
      <ul className='p-0'>
        {saldos.costumers.map((costumer, index) => (
          <div key={index} className={`d-flex align-items-center`}>
            <li className='col saldoItem'>{costumer.Ordene.id_cliente}</li>
            <li className='col saldoItem'>{costumer.Ordene.equipo}</li>
            <li className={`col saldoItem`}>DEBE</li>
            <li className={`col saldoItem ${costumer.saldo > 0 ? 'text-success' : costumer.saldo === 0 ? 'text-warning' : 'text-danger'}`}>${costumer.total - costumer.monto_pagado}</li>
          </div>
        ))}
      </ul>

      <h2>Empleados</h2>
      <ul className='p-0'>
        {saldos.employees.map((employee, index) => (
          <div key={index} className={`d-flex align-items-center`}>
            <li className='col saldoItem'>{employee.nombre}</li>
            <li className={`col saldoItem`}>LIQUIDAR</li>
            <li className={`col saldoItem ${employee.saldo > 0 ? 'text-success' : employee.saldo === 0 ? 'text-warning' : 'text-danger'}`}>
              ${employee.ordenes.reduce((acumulador, orden) => acumulador + parseFloat(orden.total - (orden.total - orden.dpg) * orden.Empleado.porcentaje_arreglo || 0), 0).toFixed(2)}
            </li>
          </div>
        ))}
      </ul>
    </>
  );
};

Saldos.propTypes = {
  saldos: PropTypes.shape({
    providers: PropTypes.array.isRequired,
    costumers: PropTypes.array.isRequired,
    employees: PropTypes.array.isRequired,
  }).isRequired,
};

export default Saldos;

/* 
 <ul className='p-0'>
        {saldos.map((saldo, index) => (
          <div
            key={index}
            className={`d-flex align-items-center ${index % 2 === 0 ? 'bg-light' : ''} ${
              saldo.estado === 'PAGO' ? 'borde-verde' : saldo.estado === 'PENDIENTE' ? 'borde-amarillo' : 'borde-rojo'
            }`}
          >
            <li className='col saldoItem'>{saldo.motivo}</li>
            <li className='col saldoItem'>{saldo.descripcion}</li>
            <li
              className={`col saldoItem ${saldo.estado === 'PAGO' ? 'text-success' : saldo.estado === 'PENDIENTE' ? 'text-warning' : 'text-danger'}`}
            >
              {saldo.estado}
            </li>

            {saldo.estado === 'PAGO' ? (
              <li className='text-success col saldoItem'>${saldo.saldo}</li>
            ) : saldo.estado === 'PENDIENTE' ? (
              <li className='text-warning col saldoItem'>+ ${saldo.saldo}</li>
            ) : (
              <li className='text-danger col saldoItem'>- ${saldo.saldo}</li>
            )}
            <li className='col saldoItem'>{saldo.caja}</li>
          </div>
        ))}
      </ul>
    </>
  );
};
 */
