import { useEffect, useState } from "react";
import Header from "../../../Header/Header";
import { listaCajas } from "../../../../services/CajasService";
import Cajas from "./Cajas";
import CajaSeleccionada from "./CajaSeleccionada";
import DatosCaja from "./DatosCaja";
import { listaCobros } from "../../../../services/CobrosService";

const Totalizador = () => {
  const [caja, setCaja] = useState([]);
  const [cobros, setCobros] = useState([]);
  const [selectedCajaId, setSelectedCajaId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchCajasData = async () => {
      try {
        const data = await listaCajas();
        setCaja(data);
      } catch (error) {
        console.error("Error fetching cajas data:", error);
        setCaja([]);
      }
    };
    const fetchCobrosData = async () => {
      try {
        const data = await listaCobros();
        setCobros(data);
      } catch (error) {
        console.error("Error fetching cobros data:", error);
        setCobros([]);
      }
    };
    fetchCajasData();
    fetchCobrosData();
  }, []);

  const handleCajaChange = (id) => {
    setSelectedCajaId(id);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const filteredCobros = cobros.filter((cobro) => {
    const matchesCaja = selectedCajaId
      ? cobro.id_caja === selectedCajaId
      : true;
    const createdAtFormatted = cobro.created_at.slice(0, 10);
    const matchesDate = selectedDate
      ? createdAtFormatted === selectedDate
      : true;

    return matchesCaja && matchesDate;
  });

  return (
    <div className="totalizadorContainer">
      <Header text="Totalizador" />
      <div className="totalizadorLayout">
        <Cajas
          cajas={caja}
          onCajaSelect={handleCajaChange}
          selectedCajaId={selectedCajaId}
        />
        <div className="content">
          <CajaSeleccionada onDateChange={handleDateChange} />
          <DatosCaja cobros={filteredCobros} selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
};

export default Totalizador;
