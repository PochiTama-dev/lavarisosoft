import Header from '../../Components/Header/Header.jsx';
import Calendario from './Calendario.jsx';
const Agenda = () => {
  return (
    <div>
      <Header text={'Agenda'} />
      <Calendario dia={11} mes={12} />
    </div>
  );
};
export default Agenda;
