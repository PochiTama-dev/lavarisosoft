import Header from '../../Header/Header';
import './GestionGlobal.css';
const GestionGlobal = () => {
  return (
    <div className='gestionGlobal-ctn'>
      <Header text='Gestion Global' />
      <div className='m-5 p-5'>
        <h1>Porcentaje de aumentos</h1>
        <div className='d-flex flex-column porcentajeAumentos'>
          <span>Repuestos: </span>
          <input className='rounded' type='number' name='' id='' />
          <span>Técnicos: </span>
          <input className='rounded' type='number' name='' id='' />
          <span>Administradores: </span>
          <input className='rounded' type='number' name='' id='' />
          <span>Contable-admin: </span>
          <input className='rounded' type='number' name='' id='' />
          <span>Jefe taller: </span>
          <input className='rounded' type='number' name='' id='' />
          <span>Atención al cliente: </span>
          <input className='rounded' type='number' name='' id='' />
        </div>
        <button className='bg-info rounded-pill text-white mx-5 papelitoButton'>Guardar</button>
      </div>
    </div>
  );
};
export default GestionGlobal;
