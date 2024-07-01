import PropTypes from 'prop-types';
import './Header.css';
import flechita from '../../images/arrow-back.webp';
import { useCustomContext } from '../../hooks/context';
import { useNavigate } from 'react-router-dom';
const Header = ({ text }) => {
  const navigate = useNavigate();
  const { setUser } = useCustomContext();
  const navig = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('usuario');
  };
  return (
    <header className='bg-info mt-0 fixed-top w-100 mb-4'>
      <div className='titles d-flex justify-content-between p-0'>
        <h2>{text}</h2>
        <span className='logout' onClick={handleLogout}>
          Cerrar sesión
        </span>
        <img className='flechita' onClick={navig} src={flechita} alt='flecha' />
      </div>
    </header>
  );
};
Header.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Header;
