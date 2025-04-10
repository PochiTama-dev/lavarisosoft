import { useContext } from "react";
import { Link } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import { DataContext } from "../../../hooks/DataContext";  
 
const Cajas = () => {
  const { listaCajas } = useContext(DataContext);  

  return (
    <div className='cajas-ctn'>
      <Table striped hover>
        <thead>
          <tr>
            <th>Caja</th>
            <th>Cuenta corriente</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {listaCajas.map((caja, index) => (
            <tr key={index}>
              <td>{caja.denominacion}</td>
                  <td>{caja.cuenta ? caja.cuenta : "-"}</td>
              <td>{caja.monto}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="button-container">
        <Link to="/caja" className="add-container">
          <button>+</button>
        </Link>
 {/*        <button className="export-button">
          <svg
            width="34"
            height="41"
            viewBox="0 0 34 41"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.22266 27.8926C2.15322 31.3656 4.20378 34.4346 7.05632 36.6234C9.90885 38.8123 13.4039 39.9987 16.9995 39.9987C20.595 39.9987 24.0901 38.8123 26.9427 36.6234C29.7952 34.4346 31.8458 31.3656 32.7763 27.8926"
              stroke="white"
        
            />
            <path
              d="M16.9983 23.6654L15.54 25.4854L16.9983 26.652L18.4566 25.4854L16.9983 23.6654ZM19.3316 2.66537C19.3316 2.04653 19.0858 1.45304 18.6482 1.01545C18.2106 0.577866 17.6171 0.332034 16.9983 0.332034C16.3795 0.332033 15.786 0.577866 15.3484 1.01545C14.9108 1.45304 14.665 2.04653 14.665 2.66537L19.3316 2.66537ZM3.87329 16.152L15.54 25.4854L18.4566 21.8454L6.78996 12.512L3.87329 16.152ZM18.4566 25.4854L30.1233 16.152L27.2066 12.512L15.54 21.8454L18.4566 25.4854ZM19.3316 23.6654L19.3316 2.66537L14.665 2.66537L14.665 23.6654L19.3316 23.6654Z"
              fill="white"
            />
          </svg>
        </button> */}
      </div>
    </div>
  );
};

export default Cajas;