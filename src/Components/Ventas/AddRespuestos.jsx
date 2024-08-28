import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import "./AddRepuestos.css";
import { useState } from "react";

const AgregarRepuesto = () => {
  const [repuesto, setRepuesto] = useState({
    codigo_repuesto: 0,
    numero_serie: "",
    tipo_electrodomestico: "",
    descripcion: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRepuesto((prevRepuesto) => ({
      ...prevRepuesto,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateRepuesto(repuesto);
  };

  const handleCreateRepuesto = async (repuesto) => {
    try {
      const { codigo_repuesto, descripcion } = await repuesto;
      await postRepuesto({ codigo_repuesto, descripcion });
      alert("Repuesto agregado con éxito");
      navigate(-1);
    } catch (error) {
      console.error(error);
    }
  };

  const postRepuesto = async (repuesto) => {
    const { codigo_repuesto, descripcion } = await repuesto;
    const fetchRepuesto = await fetch(
      "https://lv-back.online/repuestos/guardar",
      {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codigo_repuesto, descripcion }),
      }
    );
    console.log("repuesto cargado: ", fetchRepuesto.status);
  };

  return (
    <div>
      <Header text="Agregar un repuesto" />
      <div className="stockContainer">
        <h1 style={{ marginLeft: "5%" }}>Agregar un producto</h1>
        <div className="agregar-repuesto-formulario">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="codigo_repuesto">Código Repuesto</label>
              <input
                type="number"
                id="codigo_repuesto"
                name="codigo_repuesto"
                value={repuesto.codigo_repuesto}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="numero_serie">Número de serie</label>
              <input
                type="text"
                id="numero_serie"
                name="numero_serie"
                value={repuesto.numero_serie}
                onChange={handleChange}
              />
            </div>{" "}
            <div>
              <label htmlFor="tipo_electrodomestico">
                Tipo de electrodoméstico
              </label>
              <input
                type="text"
                id="tipo_electrodomestico"
                name="tipo_electrodomestico"
                value={repuesto.tipo_electrodomestico}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="descripcion">Descripción</label>
              <input
                type="text"
                id="descripcion"
                name="descripcion"
                value={repuesto.descripcion}
                onChange={handleChange}
              />
            </div>
            <button type="submit">Agregar Repuesto</button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default AgregarRepuesto;
