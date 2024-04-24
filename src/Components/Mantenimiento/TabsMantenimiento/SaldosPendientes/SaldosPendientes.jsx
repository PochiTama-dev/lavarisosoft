import Saldos from './Saldos';

const SaldosPendiente = () => {
  const saldos = [
    { motivo: 'Proveedor', descripcion: 'SALAZAR', estado: 'PAGO', saldo: 0, caja: 'C1' },
    { motivo: 'Tecnico', descripcion: 'ALMENDRA', estado: 'PENDIENTE', saldo: 400, caja: 'C2' },
    { motivo: 'Proveedor', descripcion: 'NEWELL', estado: 'DEBE', saldo: 1264, caja: 'C1' },
    { motivo: 'Cliente', descripcion: 'Seña', estado: 'DEBE', saldo: 400, caja: 'C2' },
  ];
  return (
    <div className='bg-secondary-subtle saldosPendientes'>
      <div>
        <h1> Saldos Pendientes</h1>
        <div>
          <label htmlFor=''>Filtrar por fecha</label>
          <input type='date' name='' id='' />
        </div>

        <div>
          <ul className='row'>
            <li className='col saldosItems'>Motivo</li>
            <li className='col saldosItems'>Descripción</li>
            <li className='col saldosItems'>Estado</li>
            <li className='col saldosItems'>Saldo</li>
            <li className='col saldosItems'>Caja</li>
          </ul>
          <Saldos saldos={saldos} />
        </div>
      </div>
    </div>
  );
};

export default SaldosPendiente;
