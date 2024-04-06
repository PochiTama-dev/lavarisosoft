import '../../Grilla/Grilla.css';
import PropTypes from 'prop-types';
import editar from '../../../images/editar2.webp';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
const GrillaEditStock = ({ columnas, elementos }) => {
  const [checkboxStates, setCheckboxStates] = useState(elementos.map(() => false));
  const [items, setItems] = useState(elementos);

  const handleDelete = (index) => {
    if (items[index]) {
      const nuevosItems = items.filter((elemento) => elemento !== items[index]);
      setItems(nuevosItems);
    } else {
      const nuevosElementos = items.filter((elemento, index) => !checkboxStates[index]);
      setItems(nuevosElementos);
      setCheckboxStates(items.map(() => false));
    }
  };

  const handleChecked = (index) => {
    const newCheckboxStates = [...checkboxStates];
    newCheckboxStates[index] = !newCheckboxStates[index];
    setCheckboxStates(newCheckboxStates);
  };

  const handleEdit = () => {
    Navigate('/editarProducto');
  };
  return (
    <div>
      <ul className='row p-0 text-center'>
        {columnas.map((columna, index) => (
          <li key={index} className='col'>
            {columna} <span></span>
          </li>
        ))}
      </ul>
      <ul className='grilla'>
        {items.map((item, index) => (
          <div key={index} className='itemContainer'>
            <ul className={`ulFlecha row mb-1 p-0 ${index % 2 === 0 ? 'bg-light' : ''}`}>
              {Object.entries(item).map(([, valor], index) => (
                <li key={index} className={`col text-center`}>
                  {valor}
                </li>
              ))}
              <li className='col'>
                <div className='d-flex'>
                  <img src={editar} alt='editar' className='imgEditar' />
                  <h1 className='borrar signo' onClick={() => handleDelete(index)}>
                    +
                  </h1>
                  <h1 className='signo' onClick={() => handleEdit(index)}>
                    +
                  </h1>
                  <input
                    type='checkbox'
                    name=''
                    id=''
                    checked={checkboxStates[index]}
                    onChange={() => handleChecked(index)}
                  />
                </div>
              </li>
            </ul>
          </div>
        ))}
      </ul>
      <div className='d-flex justify-content-end'>
        <button className='rounded-pill bg-info text-white botonEliminar' onClick={handleDelete}>
          Eliminiar
        </button>
      </div>
    </div>
  );
};
export default GrillaEditStock;

GrillaEditStock.propTypes = {
  columnas: PropTypes.array.isRequired,
  elementos: PropTypes.array.isRequired,
};
