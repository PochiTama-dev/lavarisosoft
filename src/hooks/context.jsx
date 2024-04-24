/* eslint-disable react/prop-types */
import { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
const Context = createContext();

export const Provider = ({ children }) => {
  const navigate = useNavigate();

  const handleNavigate = (text) => {
    navigate(`/${text}`);
  };
  const handleEdit = (items) => {
    navigate(`editarStockRepuestos/editarProducto/:${items.id}`);
  };

  return <Context.Provider value={{ handleNavigate, handleEdit }}>{children}</Context.Provider>;
};

export function useCustomContext() {
  return useContext(Context);
}
