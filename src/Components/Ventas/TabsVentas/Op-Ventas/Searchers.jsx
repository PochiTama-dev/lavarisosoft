// Searchers.jsx
import { useEffect, useRef, useState } from 'react';
import { func, number } from 'prop-types';
const filterConfig = {
  0: [
    { label: 'Cliente', field: 'Cliente.cuil', placeholder: 'Buscar Cliente' },
    { label: 'Técnico', field: 'Empleado.legajo', placeholder: 'Buscar Técnico' },
    { label: 'Medio de pago', field: 'Presupuesto.id_medio_de_pago', placeholder: 'Buscar Medio de Pago' },
    { label: 'Operación', field: 'operacion', placeholder: 'Buscar Operación' },
  ],
  1: [
    { label: 'Técnico', field: 'tecnico', placeholder: 'Buscar Técnico' },
    { label: 'Ocupación', field: 'ocupacion', placeholder: 'Domicilio/Taller' },
    { label: 'Operación', field: 'operacion', placeholder: 'Buscar Operación' },
  ],
  2: [
    { label: 'Técnico', field: 'tecnico', placeholder: 'Buscar Técnico' },
    { label: 'Repuesto', field: 'repuesto', placeholder: 'Buscar Repuesto' },
  ],
};

const Searchers = ({ activeTab, onFilterChange }) => {
  const [filterValues, setFilterValues] = useState({});
  const dateRef = useRef();
  useEffect(() => {
    // Reinicia los valores de los filtros cuando cambia la tab
    const initialFilters = filterConfig[activeTab].reduce((acc, filter) => {
      acc[filter.field] = ''; // Inicializa cada campo con un string vacío
      return acc;
    }, {});
    setFilterValues(initialFilters);
  }, [activeTab]);

  const handleInputChange = (field, value) => {
    setFilterValues((prev) => ({ ...prev, [field]: value }));
    onFilterChange(field, value);
  };
  const handlePay = (num) => {
    onFilterChange('Presupuesto.id_medio_de_pago', num);
  };

  const handleDate = (date) => {
    onFilterChange('created_at', new Date(date.current.value));
  };
  return (
    <div className='caja-input-bottom' style={{ marginLeft: '20px' }}>
      {activeTab !== 2 && (
        <div>
          <h4 className='caja-input-text'>Fecha</h4>
          <input type='date' onChange={() => handleDate(dateRef)} ref={dateRef} />
        </div>
      )}
      {filterConfig[activeTab].map((filter) => (
        <div key={filter.field}>
          <h4 className='caja-input-text'>{filter.label}</h4>
          {filter.field !== 'Presupuesto.id_medio_de_pago' ? (
            <>
              <input className='caja-input' type='text' placeholder={filter.placeholder} value={filterValues[filter.field] || ''} onChange={(e) => handleInputChange(filter.field, e.target.value)} />
              <span className='caja-button-search'>🔍︎</span>
            </>
          ) : (
            <select name='' id=''>
              <option selected disabled>
                Seleccionar medio de pago
              </option>
              <option onClick={() => handlePay('1')}>Echeq</option>
              <option onClick={() => handlePay('2')}>Efectivo en dólares</option>
              <option onClick={() => handlePay('3')}>Efectivo en pesos</option>
              <option onClick={() => handlePay('4')}>Transferencia en dólares</option>
              <option onClick={() => handlePay('5')}>Transferencia en pesos</option>
            </select>
          )}
        </div>
      ))}
    </div>
  );
};

Searchers.propTypes = {
  activeTab: number.isRequired,
  onFilterChange: func,
};

export default Searchers;
