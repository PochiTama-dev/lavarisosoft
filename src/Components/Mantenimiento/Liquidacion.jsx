import "./mantenimiento.css";
import React, { useState, useEffect } from "react";
import { func, object, any } from "prop-types";
import RemitoLiquidacion from "./RemitoLiquidacion";
import { listaCajas } from "../../services/cajasService";

const Liquidacion = ({ tecnico, setModal }) => {
  const [newModal, setNewModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [liqParcial, setLiqParcial] = useState("");
  const [selectedCaja, setSelectedCaja] = useState("");
  const [cajas, setCajas] = useState([]);

  useEffect(() => {
    const fetchCajas = async () => {
      const response = await listaCajas();
      setCajas(response);
    };
    fetchCajas();
  }, []);

  const handleLiquidate = () => {
    setNewModal(!newModal);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setLiqParcial(value);

    if (value) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  };

  const handleKeyPress = (event) => {
    const key = event.key;
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      ".",
      "Shift",
      "ArrowLeft",
      "Home",
      "Delete",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
    ];
    if (!/[0-9]/.test(key) && !allowedKeys.includes(key)) {
      event.preventDefault();
    }
  };

  const handleCajaChange = (event) => {
    setSelectedCaja(event.target.value);
  };

  return (
    <div className="liquidacion rounded">
      {!newModal && (
        <>
          <div className="d-flex justify-content-around">
            <h1>Liquidación {tecnico.nombre}</h1>
            <h1 className="pointer" onClick={() => setModal(false)}>
              x
            </h1>
          </div>
          <div className="liq-table d-flex justify-content-evenly">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <h2
                style={{
                  color: isDisabled ? "gray" : "initial",
                  border: isDisabled ? "1px solid gray" : "initial",
                  textDecoration: isDisabled ? "line-through" : "initial",
                }}
              >
                Total:
              </h2>
              <label htmlFor="adelanto">
                <h2>Liquidacion parcial</h2>
              </label>
              <label>
                <h2>Seleccionar Caja:</h2>
              </label>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <h3
                style={{
                  color: isDisabled ? "gray" : "initial",
                  border: isDisabled ? "1px solid gray" : "initial",
                  textDecoration: isDisabled ? "line-through" : "initial",
                }}
              >
                {tecnico.total - tecnico.adelanto}
              </h3>
              <input
                className="m-auto "
                style={{ height: "40px", fontSize: "30px" }}
                type="number"
                name=""
                id="adelanto"
                max={tecnico.total - tecnico.adelanto}
                onChange={handleInputChange}
                onKeyDownCapture={handleKeyPress}
              />
              <select
                value={selectedCaja}
                onChange={handleCajaChange}
                style={{
                  backgroundColor: "#e6e6e6",
                  border: "1px solid black",
                  width: "250px",
                }}
              >
                <option value="">Seleccione una caja</option>
                {cajas.map((caja) => (
                  <option key={caja.id} value={caja.id}>
                    {caja.denominacion} (Disponible: {caja.monto})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="d-flex  mt-3" style={{ flexDirection: "row" }}></div>
          <button onClick={handleLiquidate} disabled={!selectedCaja}>
            Liquidar
          </button>
        </>
      )}
      {newModal && (
        <div>
          <RemitoLiquidacion
            tecnico={tecnico}
            setModal={setNewModal}
            liqParcial={liqParcial}
            selectedCaja={selectedCaja}
            cajas={cajas}
          />
        </div>
      )}
    </div>
  );
};

Liquidacion.propTypes = {
  tecnico: object,
  setModal: func,
  selectedCaja: any,
  cajas: any,
};

export default Liquidacion;
