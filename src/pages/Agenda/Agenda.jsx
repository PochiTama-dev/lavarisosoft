import Header from '../../Components/Header/Header.jsx';
import Calendario from './Calendario.jsx';
const Agenda = () => {
  const fechaActual = new Date();
  console.log(fechaActual.getMonth());
  return (
    <div>
      <Header text={'Agenda'} />
      <Calendario dia={fechaActual.getDate()} mes={fechaActual.getMonth() + 1} />
    </div>
  );
};
export default Agenda;
