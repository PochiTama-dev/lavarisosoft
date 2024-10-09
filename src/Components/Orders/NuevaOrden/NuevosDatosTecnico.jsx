import { useState, useEffect } from "react";

// Haversine formula to calculate the distance between two points
/* const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degree) => degree * (Math.PI / 180);
  const R = 6371; // Radius of the Earth in kilometers

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
}; */

// Fetch function to get employees
const empleados = async () => {
  try {
    const response = await fetch("https://lv-back.online/empleados");
    const empleados = await response.json();
    if (empleados[0] !== undefined) {
      //console.log(`Se encontró un listado completo con ${empleados.length} empleados!!`);
      return empleados;
    } else {
      console.log("Aún no se registra ningún empleado...");
      return [];
    }
  } catch (error) {
    console.error(
      "Error, no se encontraron empleados en la base de datos....",
      error
    );
    return [];
  }
};

const NuevosDatosTecnico = ({ setIdEmpleado, cliente }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeesOnline, setEmployeesOnline] = useState([]);

  useEffect(() => {
    const fetchEmpleados = async () => {
      const empleadosList = await empleados();
      const onlines = empleadosList.filter(
        (empleados) => empleados.estado === 1
      );
      setEmployees(empleadosList);
      setEmployeesOnline(onlines);
    };

    fetchEmpleados();
  }, []);

  /*   useEffect(() => {
    if (employees.length > 0 && cliente) {
      const distances = employees.map((emp) => ({
        ...emp,
        distance: haversineDistance(cliente.latitud, cliente.longitud, emp.latitud, emp.longitud),
      }));
      // Find the closest employee
      const closestEmployee = distances.reduce((min, emp) => (emp.distance < min.distance ? emp : min));
      setSelectedEmployee(closestEmployee);
      setIdEmpleado(closestEmployee.id);
    }
  }, [employees, setIdEmpleado]);
 */
  const handleSelectChange = (e) => {
    const employee = employees.find(
      (emp) => emp.id === parseInt(e.target.value)
    );
    setSelectedEmployee(employee);
    setIdEmpleado(employee.id); // Set the selected employee's ID
  };

  return (
    <div style={{ marginTop: "5%" }}>
      <h3 className="m-4">Datos del técnico</h3>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3 row align-items-center">
            <label htmlFor="empleado" className="col-sm-3 col-form-label">
              Técnicos disponibles:
            </label>
            <div className="col-sm-8">
              <select
                id="empleado"
                className="form-control"
                onChange={handleSelectChange}
              >
                <option selected disabled>
                  Seleccione un técnico
                </option>
                {employeesOnline.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nombre} {emp.apellido}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {selectedEmployee && (
            <>
              <div className="mb-3 row align-items-center">
                <label htmlFor="nombre" className="col-sm-2 col-form-label">
                  Nombre:
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    id="nombre"
                    className="form-control input-small"
                    value={selectedEmployee.nombre}
                    readOnly
                  />
                </div>
              </div>
              <div className="mb-3 row align-items-center">
                <label htmlFor="apellido" className="col-sm-2 col-form-label">
                  Apellido:
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    id="apellido"
                    className="form-control input-small"
                    value={selectedEmployee.apellido}
                    readOnly
                  />
                </div>
              </div>
              <div className="mb-3 row align-items-center">
                <label htmlFor="legajo" className="col-sm-2 col-form-label">
                  Legajo:
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    id="legajo"
                    className="form-control input-small"
                    value={selectedEmployee.legajo}
                    readOnly
                  />
                </div>
              </div>
            </>
          )}
        </div>
        {/* <div className='col-md-6'>
          <h3>Tecnicos online</h3>
          <select id='empleado' className='form-control' onChange={handleSelectChange}>
            <option value='' disabled selected>
              Seleccione un técnico
            </option>
            {employeesOnline.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.nombre} {emp.apellido}
              </option>
            ))}
          </select>
        </div> */}
      </div>
    </div>
  );
};

export default NuevosDatosTecnico;
