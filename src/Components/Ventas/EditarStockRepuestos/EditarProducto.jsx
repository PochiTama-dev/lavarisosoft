import Header from '../../Header/Header';

const EditarProducto = () => {
  return (
    <div>
      <Header text='Agregar un repuesto' />

      <div className='stockContainer'>
        <h1>Editar un producto</h1>
        <div className='formulario d-flex justify-content-evenly'>
          <ul className='d-flex flex-column'>
            <label htmlFor='nombre'>Nombre</label>

            <label htmlFor='id'>ID</label>

            <label htmlFor='proveedor'>Proveedor</label>

            <label htmlFor='precio'>Precio</label>

            <label htmlFor='cantidad'>Cantidad</label>

            <label htmlFor='orden'>Orden</label>

            <label htmlFor='fecha'>Fecha lote</label>
          </ul>
          <ul>
            <li className='d-flex justify-content-around liForm'>
              <input type='text' name='' id='' className='rounded-pill editForm' required />
            </li>
            <li className='d-flex justify-content-around liForm'>
              <input type='text' name='' id='' className='rounded-pill editForm' required />
            </li>
            <li className='d-flex justify-content-around liForm'>
              <select value={'proovedores'}>
                <option disabled readOnly>
                  Proovedores
                </option>
                <option>a</option>
                <option>b</option>
                <option>c</option>
              </select>
            </li>
            <li className='d-flex justify-content-around liForm'>
              <input type='text' name='' id='' className='rounded-pill editForm' required />
            </li>
            <li className='d-flex justify-content-around liForm'>
              <input type='text' name='' id='' className='rounded-pill editForm' required />
            </li>
            <li className='d-flex justify-content-around liForm'>
              <input type='text' name='' id='' className='rounded-pill editForm' required />
            </li>
            <li className='d-flex justify-content-around liForm'>
              <input type='date' name='' id='' className='rounded-pill editForm' required />
            </li>
          </ul>
        </div>
        <div className='d-flex justify-content-center'>
          <button className='rounded-pill bg-info text-white botonEliminar'>Guardar</button>
        </div>
      </div>
    </div>
  );
};
export default EditarProducto;
