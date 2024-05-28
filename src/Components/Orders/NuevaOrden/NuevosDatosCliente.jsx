const NuevosDatosCliente = () => {
  return (
    <div className='mx-3'>
      <h1 className=''>Datos del cliente</h1>
      <div>
        <ul className='d-flex'>
          <div className='d-flex flex-column'>
            <li>
              <span>Nombre: </span>
              <input type='text' className='rounded' required />
            </li>
            <li>
              <span>Apellido: </span>
              <input type='text' className='rounded' required />
            </li>
            <li>
              <span>Legajo: </span>
              <input type='text' className='rounded' required />
            </li>
          </div>
          <div className='d-flex flex-column mx-5'>
            <li>
              <span>Telefono: </span>
              <input type='text' className='rounded' required />
            </li>
            <li>
              <span>Direccion: </span>
              <input type='text' className='rounded' required />
            </li>
            <li>
              <span>Localidad: </span>
              <input type='text' className='rounded' required />
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
};
export default NuevosDatosCliente;
