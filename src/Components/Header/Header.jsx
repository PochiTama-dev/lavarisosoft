import PropTypes from 'prop-types';
import './Header.css';
const Header = ({ text }) => {
  return (
    <header className='bg-info mt-0 fixed-top w-100'>
      <div className='titles d-flex justify-content-between'>
        <h2>{text}</h2>
        <h3>X</h3>
      </div>
    </header>
  );
};
Header.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Header;
