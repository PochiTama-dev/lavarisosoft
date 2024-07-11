import React, { useState, useEffect } from 'react';

// Fetch function to get employees
const empleados = async () => {
  try {
    const response = await fetch("https://lv-back.online/empleados");
    const empleados = await response.json();
    if (empleados[0] !== undefined) {
      console.log(`Se encontró un listado completo con ${empleados.length} empleados!!`);
      return empleados;
    } else {
      console.log('Aún no se registra ningún empleado...');
      return [];
    }
  } catch (error) {
    console.error("Error, no se encontraron empleados en la base de datos....", error);
    return [];
  }
};

const NuevosDatosTecnico = ({ setIdEmpleado }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const fetchEmpleados = async () => {
      const empleadosList = await empleados();
      setEmployees(empleadosList);
    };

    fetchEmpleados();
  }, []);

  const handleSelectChange = (e) => {
    const employee = employees.find(emp => emp.id === parseInt(e.target.value));
    setSelectedEmployee(employee);
    setIdEmpleado(employee.id); // Set the selected employee's ID
  };

  return (
    <div>
      <h3 className='m-4'>Datos del técnico</h3>
      <div className='row'>
        <div className='col-md-6'>
          <div className='mb-3 row align-items-center'>
            <label htmlFor='empleado' className='col-sm-2 col-form-label'>Empleado:</label>
            <div className='col-sm-8'>
              <select id='empleado' className='form-control' onChange={handleSelectChange}>
                <option value="">Seleccione un empleado</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nombre} {emp.apellido}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {selectedEmployee && (
            <>
              <div className='mb-3 row align-items-center'>
                <label htmlFor='nombre' className='col-sm-2 col-form-label'>Nombre:</label>
                <div className='col-sm-8'>
                  <input type='text' id='nombre' className='form-control input-small' value={selectedEmployee.nombre} readOnly />
                </div>
              </div>
              <div className='mb-3 row align-items-center'>
                <label htmlFor='apellido' className='col-sm-2 col-form-label'>Apellido:</label>
                <div className='col-sm-8'>
                  <input type='text' id='apellido' className='form-control input-small' value={selectedEmployee.apellido} readOnly />
                </div>
              </div>
              <div className='mb-3 row align-items-center'>
                <label htmlFor='legajo' className='col-sm-2 col-form-label'>Legajo:</label>
                <div className='col-sm-8'>
                  <input type='text' id='legajo' className='form-control input-small' value={selectedEmployee.legajo} readOnly />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NuevosDatosTecnico;
