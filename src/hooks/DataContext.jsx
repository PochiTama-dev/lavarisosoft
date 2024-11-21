import React, { createContext, useState, useEffect } from "react";
import { ordenes } from "../services/ordenesService";
import { listadoProveedores, listaFacturas } from "../services/proveedoresService";
import { listaStockCamioneta } from "../services/stockCamionetaService";
import { listaCobros, listaCajas } from "../services/cajasService";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [stockCamioneta, setStockCamioneta] = useState([]);
  const [cobros, setCobros] = useState([]);
  const [listaCajasData, setListaCajasData] = useState([]);  // Estado para listaCajas

  // Funciones para obtener los datos
  const fetchOrdenes = async () => {
    const data = await ordenes();
    if (data) setOrders(data);
  };

  const fetchProveedores = async () => {
    const data = await listadoProveedores();
    if (data) setProveedores(data);
  };

  const fetchListaStockCamioneta = async () => {
    const data = await listaStockCamioneta();
    if (data) setStockCamioneta(data);
  };

  const fetchListaCobros = async () => {
    const data = await listaCobros();
    if (data) setCobros(data);
  };

  const fetchListaCajas = async () => {
    const data = await listaCajas();
    if (data) setListaCajasData(data);  // Aquí se carga listaCajas
  };

  useEffect(() => {
    fetchOrdenes();
    fetchProveedores();
    fetchListaStockCamioneta();
    fetchListaCobros();
    fetchListaCajas();  // Llamamos a la función para obtener listaCajas
  }, []);

  return (
    <DataContext.Provider 
      value={{
        orders, 
        proveedores, 
        stockCamioneta, 
        cobros, 
        listaCajas: listaCajasData  // Proveemos listaCajas en el contexto
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
