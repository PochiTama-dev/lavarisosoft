import  { createContext, useState, useEffect } from "react";
import { ordenes } from "../services/ordenesService";
import { listadoProveedores, /* listaFacturas */ } from "../services/proveedoresService";
import { listaStockCamioneta } from "../services/stockCamionetaService";
import { listaCobros, listaCajas } from "../services/cajasService";

export const DataContext = createContext();

// eslint-disable-next-line react/prop-types
export const DataProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [stockCamioneta, setStockCamioneta] = useState([]);
  const [cobros, setCobros] = useState([]);
  const [listaCajasData, setListaCajasData] = useState([]);   

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
    if (data) setListaCajasData(data);   
  };

  useEffect(() => {
    fetchOrdenes();
    fetchProveedores();
    fetchListaStockCamioneta();
    fetchListaCobros();
    fetchListaCajas();   
  }, []);

  return (
    <DataContext.Provider 
      value={{
        orders, 
        proveedores, 
        stockCamioneta, 
        cobros, 
        listaCajas: listaCajasData   
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
