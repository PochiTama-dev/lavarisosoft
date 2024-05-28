// import "../../Grilla/Grilla.css";
// import PropTypes from "prop-types";
// import editar from "../../../images/editar2.webp";
// import { useState } from "react";
// import { useCustomContext } from "../../../hooks/context.jsx";
// const GrillaEditStock = ({ columnas, elementos }) => {
//   const { handleEdit } = useCustomContext();
//   const [checkboxStates, setCheckboxStates] = useState(
//     elementos.map(() => false)
//   );
//   const [items, setItems] = useState(elementos);

//   const handleDelete = (index) => {
//     if (items[index]) {
//       const nuevosItems = items.filter((elemento) => elemento !== items[index]);
//       setItems(nuevosItems);
//     } else {
//       const nuevosElementos = items.filter(
//         (elemento, index) => !checkboxStates[index]
//       );
//       setItems(nuevosElementos);
//       setCheckboxStates(items.map(() => false));
//     }
//   };

//   const handleChecked = (index) => {
//     const newCheckboxStates = [...checkboxStates];
//     newCheckboxStates[index] = !newCheckboxStates[index];
//     setCheckboxStates(newCheckboxStates);
//   };

//   return (
//     <div>
//       <ul className="row p-0 text-center">
//         {columnas.map((columna, index) => (
//           <li key={index} className="col">
//             {columna} <span></span>
//           </li>
//         ))}
//       </ul>
//       <ul className="grilla">
//         {items.map((item, index) => (
//           <div key={index} className="itemContainer">
//             <ul
//               className={`ulFlecha row mb-1 p-0 ${
//                 index % 2 === 0 ? "bg-light" : ""
//               }`}
//             >
//               {Object.entries(item).map(([, valor], index) => (
//                 <li key={index} className={`col text-center`}>
//                   {valor}
//                 </li>
//               ))}
//               <li className="col">
//                 <div className="d-flex align-items-center">
//                   <img
//                     src={editar}
//                     alt="editar"
//                     className="imgEditar"
//                     onClick={() => handleEdit(item)}
//                   />
//                   <span
//                     className="borrar signo"
//                     onClick={() => handleDelete(index)}
//                   >
//                     +
//                   </span>
//                   <span className="signo">+</span>
//                   <input
//                     type="checkbox"
//                     name=""
//                     id=""
//                     checked={checkboxStates[index]}
//                     onChange={() => handleChecked(index)}
//                   />
//                 </div>
//               </li>
//             </ul>
//           </div>
//         ))}
//       </ul>
//       <div className="d-flex justify-content-end">
//         <button
//           className="rounded-pill bg-info text-white botonEliminar"
//           onClick={handleDelete}
//         >
//           Eliminar
//         </button>
//       </div>
//     </div>
//   );
// };
// export default GrillaEditStock;

// GrillaEditStock.propTypes = {
//   columnas: PropTypes.array.isRequired,
//   elementos: PropTypes.array.isRequired,
// };

import "../../Grilla/Grilla.css";
import PropTypes from "prop-types";
import editar from "../../../images/editar2.webp";
import { useState } from "react";
import { useCustomContext } from "../../../hooks/context.jsx";

const GrillaEditStock = ({ columnas, elementos }) => {
  const { handleEdit } = useCustomContext();
  const [checkboxStates, setCheckboxStates] = useState(
    elementos.map(() => false)
  );
  const [items, setItems] = useState(elementos);
  const [orderBy, setOrderBy] = useState(null);
  const [orderAsc, setOrderAsc] = useState(true);

  const handleDelete = (index) => {
    if (items[index]) {
      const nuevosItems = items.filter((elemento) => elemento !== items[index]);
      setItems(nuevosItems);
    } else {
      const nuevosElementos = items.filter(
        (elemento, index) => !checkboxStates[index]
      );
      setItems(nuevosElementos);
      setCheckboxStates(items.map(() => false));
    }
  };

  const handleChecked = (index) => {
    const newCheckboxStates = [...checkboxStates];
    newCheckboxStates[index] = !newCheckboxStates[index];
    setCheckboxStates(newCheckboxStates);
  };

  const handleSort = (columnName) => {
    if (orderBy === columnName) {
      setOrderAsc((prevOrderAsc) => !prevOrderAsc);
    } else {
      setOrderBy(columnName);
      setOrderAsc(true);
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    if (!orderBy) return 0;
    if (orderAsc) {
      return a[orderBy] > b[orderBy] ? 1 : -1;
    } else {
      return a[orderBy] < b[orderBy] ? 1 : -1;
    }
  });

  return (
    <div>
      <ul className="row p-0 text-center">
        {columnas.map((columna, index) => (
          <li
            key={index}
            className="col"
            onClick={() => handleSort(columna.toLowerCase())}
            style={{
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "large",
              marginTop: "2.5%",
            }}
          >
            {columna}{" "}
            {orderBy === columna.toLowerCase() && (orderAsc ? "▲" : "▼")}
          </li>
        ))}
      </ul>
      <ul className="grilla">
        {sortedItems.map((item, index) => (
          <div key={index} className="itemContainer aling-items-center">
            <ul
              style={{ fontWeight: "500", height: "7vh" }}
              className={`ulFlecha row p-0 ${
                index % 2 === 0 ? "bg-light" : ""
              }`}
            >
              {Object.entries(item).map(([, valor], index) => (
                <li key={index} className={`col text-center`}>
                  {valor}
                </li>
              ))}
              <li className="col">
                <div className="d-flex align-items-center">
                  <img
                    src={editar}
                    alt="editar"
                    className="imgEditar"
                    onClick={() => handleEdit(item)}
                  />
                  <span
                    className="borrar signo"
                    onClick={() => handleDelete(index)}
                  >
                    +
                  </span>
                  <span className="signo">+</span>
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    checked={checkboxStates[index]}
                    onChange={() => handleChecked(index)}
                  />
                </div>
              </li>
            </ul>
          </div>
        ))}
      </ul>
      <div className="d-flex justify-content-end">
        <button
          className="rounded-pill bg-info text-white botonEliminar"
          onClick={handleDelete}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

GrillaEditStock.propTypes = {
  columnas: PropTypes.array.isRequired,
  elementos: PropTypes.array.isRequired,
};

export default GrillaEditStock;
