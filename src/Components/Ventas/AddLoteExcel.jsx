import Header from '../Header/Header';
import GrillaEditStock from './EditarStockRepuestos/GrillaEditStock';

const AddLoteExcel = () => {
  const itemsStock = [
    {
      nombre: 'NombreAbc123',
      id: 4366,
      precio: 2330,
      disponibles: 2,
    },
    {
      nombre: 'NombreAbc456',
      id: 43365,
      precio: 2330,
      disponibles: 2,
    },
    {
      nombre: 'NombreAbc789',
      id: 435,
      precio: 2330,
      disponibles: 2,
    },
    {
      nombre: 'NombreAbc159',
      id: 3165,
      precio: 2330,
      disponibles: 2,
    },
    {
      nombre: 'NombreAbc987',
      id: 9894,
      precio: 2330,
      disponibles: 2,
    },
  ];
  return (
    <div>
      <Header text='Cargar lote desde Excel' />
      <div className='stockContainer'>
        <h2>Cargar archivo</h2>
        <input type='file' name='' id='' />
      </div>
      <div>
        <GrillaEditStock
          columnas={['Nombre', 'ID', 'Proveedor', 'Precio', 'Disponiles', 'Fecha', 'Orden']}
          elementos={itemsStock}
        />
      </div>
    </div>
  );
};

export default AddLoteExcel;
