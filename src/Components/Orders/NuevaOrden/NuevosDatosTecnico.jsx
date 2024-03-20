const NuevosDatosTecnico = () => {
  return (
    <div>
      <h3 className='ms-5 mt-3'>Datos del ténico</h3>
      <div>
        <ul className='d-flex'>
          <li>
            <span>Nombre:</span>
            <input type='text' className='rounded' required />
          </li>
          <li>
            <span>Apellido:</span>
            <input type='text' className='rounded' required />
          </li>
          <li>
            <span>Legajo:</span>
            <input type='text' className='rounded' required />
          </li>
        </ul>
      </div>
    </div>
  );
};
export default NuevosDatosTecnico;
