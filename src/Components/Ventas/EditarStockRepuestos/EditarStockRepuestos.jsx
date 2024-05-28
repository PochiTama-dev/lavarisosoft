import Header from "../../Header/Header";
import "./EditarStockRepuestos.css";
import GrillaEditStock from "./GrillaEditStock";
const EditarStockRespuestos = () => {
  const itemsStock = [
    {
      nombre: "NombreAbc123",
      id: 4366,
      precio: 2330,
      disponibles: 2,
    },
    {
      nombre: "NombreAbc456",
      id: 43365,
      precio: 2330,
      disponibles: 2,
    },
    {
      nombre: "NombreAbc789",
      id: 435,
      precio: 2330,
      disponibles: 2,
    },
    {
      nombre: "NombreAbc159",
      id: 3165,
      precio: 2330,
      disponibles: 2,
    },
    {
      nombre: "NombreAbc987",
      id: 9894,
      precio: 2330,
      disponibles: 2,
    },
  ];
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
