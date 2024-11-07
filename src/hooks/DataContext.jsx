import React, { createContext, useState, useEffect } from "react";
import { ordenes } from "../services/ordenesService";
import { listadoProveedores, listaFacturas } from "../services/proveedoresService";
import { listaStockCamioneta } from "../services/stockCamionetaService";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [stockCamioneta, setStockCamioneta] = useState([]);

  const fetchOrdenes = async () => {
    const data = await ordenes();
    if (data) setOrders(data);
  };

  const fetchProveedores = async () => {
    const data = await listadoProveedores();
    if (data) setProveedores(data);
  };

  const fetchlistaStockCamioneta= async () => {
    const data = await listaStockCamioneta();
    if (data) setStockCamioneta(data);
  };
  useEffect(() => {
    fetchOrdenes();
    fetchProveedores();
    fetchlistaStockCamioneta();
  }, []);

  return (
    <DataContext.Provider value={{ orders, proveedores, stockCamioneta }}>
      {children}
    </DataContext.Provider>
  );
};
