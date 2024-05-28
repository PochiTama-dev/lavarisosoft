import Header from '../../Components/Header/Header.jsx';
import NuevosDatosCliente from '../../Components/Orders/NuevaOrden/NuevosDatosCliente.jsx';
import NuevosDatosIncidente from '../../Components/Orders/NuevaOrden/NuevosDatosIncidente.jsx';
import NuevosDatosTecnico from '../../Components/Orders/NuevaOrden/NuevosDatosTecnico.jsx';
const NuevaOrden = () => {
  return (
    <div className='nuevaOrder-ctn'>
      <Header text='Nueva Orden' />
      <div className='m-5'>
        <h1>Orden #25647</h1>
        <span>Estado: Borrador</span>
      </div>
      <NuevosDatosTecnico />
      <NuevosDatosCliente />
      <NuevosDatosIncidente />
      <div className='d-flex justify-content-center'>
        <button className='bg-primary rounded-pill text-white papelitoButton'>Crear</button>
      </div>
    </div>
  );
};
export default NuevaOrden;
