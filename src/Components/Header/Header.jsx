import PropTypes from 'prop-types';
import './Header.css';
import flechita from '../../images/arrow-back.webp';
import home from '../../images/home.webp';
import { useCustomContext } from '../../hooks/context';
import { useNavigate } from 'react-router-dom';
const Header = ({ text, showBackButton = true }) => {
  const navigate = useNavigate();
  const { setUser } = useCustomContext();
  const navig = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <header className=' header bg-info mt-0 fixed-top w-100 mb-4'>
 <div className="titles d-flex p-0">
  <div className="header-title-container">
    <h2>{text}</h2>
  </div>
  
  <div className="header-right">
    <img 
      src={home} 
      onClick={() => navigate('/menu')} 
      style={{ width: 32, height: 32, cursor: 'pointer' }} 
    />
     {showBackButton && <img className="flechita" onClick={navig} src={flechita} alt="flecha" />}
    <div className="logout" onClick={handleLogout}>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 19.5V16.5H10.5V12L3 18L10.5 24V19.5H24Z" fill="white" />
        <path d="M30 4.5H16.5C14.8455 4.5 13.5 5.8455 13.5 7.5V13.5H16.5V7.5H30V28.5H16.5V22.5H13.5V28.5C13.5 30.1545 14.8455 31.5 16.5 31.5H30C31.6545 31.5 33 30.1545 33 28.5V7.5C33 5.8455 31.6545 4.5 30 4.5Z" fill="white" />
      </svg>
      Cerrar sesión
    </div>
    
    
  </div>
</div>
    </header>
  );
};
Header.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Header;
