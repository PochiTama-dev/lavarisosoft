import { useState, useEffect } from 'react';
import './Alertas.css';
import alertasData from './alertas.json';

const Alertas = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [alertas, setAlertas] = useState([]);

    useEffect(() => {
      setAlertas(alertasData);
    }, []);

    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };

    return (
      <div className='container'>
        <h2>Alertas</h2>
        {alertas.map((alerta, index) => (
          <div key={index} className="row my-3">
            <div className='col-1'>
              <div className="notification-badge">
                {alerta.descripciones.length}
              </div>
            </div>
            <div key={index} className="col-6">
              <div className="dropdown dropdown-alert-name">
                <button 
                  className="btn btn-secondary dropdown-toggle dropbtn" 
                  type="button" 
                  onClick={toggleDropdown} 
                  aria-expanded={isOpen ? 'true' : 'false'}
                >
                  {alerta.nombre}
                </button>
                <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                  {alerta.descripciones.map((descripcion, idx) => (
                    <li key={idx}><a className="dropdown-item active" href="#">{descripcion}</a></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
}

export default Alertas;
