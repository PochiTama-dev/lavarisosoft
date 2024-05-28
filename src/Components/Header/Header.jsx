import PropTypes from 'prop-types';
import './Header.css';
import flechita from '../../images/arrow-back.webp';
const Header = ({ text }) => {
  const handleBack = () => {
    window.history.back();
  };
  return (
    <header className='bg-info mt-0 fixed-top w-100'>
      <div className='titles d-flex justify-content-between'>
        <h2>{text}</h2>
        <img className='flechita' onClick={handleBack} src={flechita} alt='flecha' />
      </div>
    </header>
  );
};
Header.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Header;
