import { func, object } from 'prop-types';
import { useState } from 'react';
import { useCustomContext } from '../../../hooks/context';
const EditEmpleado = ({ empleado, setModal }) => {
  console.log(empleado);
  const { editPorcentajeEmpleado } = useCustomContext();
  const [porcentaje, setPorcentaje] = useState(empleado.porcentaje_arreglo);
  const handleChange = (event) => {
    setPorcentaje(event.target.value);
  };
  const handlePut = async (empleado) => {
    const parsedPorcentaje = parseFloat(porcentaje) / 100;
    if (isNaN(parsedPorcentaje)) {
      alert('Por favor, ingrese un número válido.');
      return;
    }
    empleado.porcentaje_arreglo = parsedPorcentaje;
    console.log(empleado);
    await editPorcentajeEmpleado(empleado.id, empleado);
    setModal(false);
  };
  return (
    <div>
      <div className='liquidacion rounded'>
        <div className='d-flex justify-content-between'>
          <h1 className='text-center'>
            {empleado.nombre} {empleado.apellido}
          </h1>
          <h2 className='pointer' onClick={() => setModal(false)}>
            x
          </h2>
        </div>
        <div className='liq-table'>
          <div>
            <span>Porcentaje arreglo:</span>
          </div>
          <div>
            <input className='text-center' type='text' value={porcentaje < 1 ? porcentaje * 100 : porcentaje} onChange={handleChange} />
          </div>
        </div>
        <button onClick={() => handlePut(empleado)}>Agregar/Cambiar</button>
      </div>
    </div>
  );
};
EditEmpleado.propTypes = {
  empleado: object,
  setModal: func,
};
export default EditEmpleado;
