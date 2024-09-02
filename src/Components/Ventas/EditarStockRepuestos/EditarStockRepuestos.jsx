import { useEffect, useState } from "react";
import Header from "../../Header/Header";
import "./EditarStockRepuestos.css";
import GrillaEditStock from "./GrillaEditStock";
const EditarStockRespuestos = () => {
  const [loading, setLoading] = useState(true);
  const [stockData, setStockData] = useState([]);

  const stockDb = async () => {
    try {
      const response = await fetch(
        "https://lv-back.online/stock/principal/lista"
      );
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const data = await stockDb();
        setStockData(data);
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setStockData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStockData();
  }, []);

  const itemsStock = stockData?.map((item) => ({
    nombre: item.Repuesto?.descripcion,
    id: item.id,
    precio: item.precio,
    disponibles: item.cantidad,
  }));

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="stockContainer">
      <Header text="Editar stock de repuestos" />
      <div>
        <h1>Editar Stock</h1>
        <div>
          <input className="caja-input" type="text" placeholder="Buscar..." />
          <button className="caja-button-search">🔍︎</button>
        </div>
      </div>

      <GrillaEditStock
        columnas={["Nombre", "ID", "Precio", "Disponibles", ""]}
        elementos={itemsStock}
      />
    </div>
  );
};

export default EditarStockRespuestos;
