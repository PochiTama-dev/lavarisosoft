import React, { createContext, useState, useEffect } from "react";
import { ordenes } from "../services/ordenesService";
import { listadoProveedores } from "../services/proveedoresService";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  const fetchOrdenes = async () => {
    const data = await ordenes();
    if (data) setOrders(data);
  };

  const fetchProveedores = async () => {
    const data = await listadoProveedores();
    if (data) setProveedores(data);
  };

  useEffect(() => {
    fetchOrdenes();
    fetchProveedores();
  }, []);

  return (
    <DataContext.Provider value={{ orders, proveedores }}>
      {children}
    </DataContext.Provider>
  );
};
