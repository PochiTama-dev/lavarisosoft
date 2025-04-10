import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Header from "../../../Header/Header";
import { listaCajas } from "../../../../services/cajasService";
import { obtenerLiquidaciones } from "../../../../services/liquidacionesService";
import Cajas from "./Cajas";
import CajaSeleccionada from "./CajaSeleccionada";
import { useCustomContext } from "../../../../hooks/context";
import "./Totalizador.css";

const Totalizador = () => {
  const { listaFacturasCompra, listaFacturasVenta } = useCustomContext();
  const [caja, setCaja] = useState([]);
  const [selectedCajaId, setSelectedCajaId] = useState("");
  const [selectedDate, setSelectedDate] = useState({ year: "", month: "" });
  const [datosFiltrados, setDatosFiltrados] = useState([]);
  const [mesFacturado, setMesFacturado] = useState({});
  const [liquidaciones, setLiquidaciones] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cajasData, facturasCompra, facturasVenta, liquidacionesData] =
          await Promise.all([
            listaCajas(),
            listaFacturasCompra(),
            listaFacturasVenta(),
            obtenerLiquidaciones(),
          ]);

        setCaja(cajasData || []);
        setMesFacturado(
          organizarFacturasPorMes([...facturasCompra, ...facturasVenta])
        );
        setLiquidaciones(liquidacionesData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const organizarFacturasPorMes = (facturas) => {
    return facturas.reduce((acc, factura) => {
      const fecha = new Date(factura.created_at);
      const mes = fecha.getMonth() + 1;
      const year = fecha.getFullYear();
      const key = `${year}-${mes}`;
      acc[key] = acc[key] || [];
      acc[key].push(factura);
      return acc;
    }, {});
  };

  const handleDateChange = ({ year, month }) => {
    setSelectedDate({ year, month });
  };

  const handleCajaChange = (cajaId) => {
    setSelectedCajaId(cajaId);
  };

  useEffect(() => {
    const filteredData = Object.entries(mesFacturado).reduce(
      (acc, [key, facturas]) => {
        const [year, month] = key.split("-");
        if (
          (!selectedDate.year || selectedDate.year === year) &&
          (!selectedDate.month || Number(selectedDate.month) === Number(month))
        ) {
          const facturasFiltradas = facturas.filter(
            (factura) =>
              !selectedCajaId ||
              Number(factura.id_caja) === Number(selectedCajaId)
          );
          if (facturasFiltradas.length > 0) {
            acc[key] = facturasFiltradas;
          }
        }
        return acc;
      },
      {}
    );
    setDatosFiltrados(filteredData);
  }, [mesFacturado, selectedDate, selectedCajaId]);

  const calcularTotales = (facturas, year, month) => {
    let totalFacturado = 0;
    let totalPagado = 0;
    let gastosOperativos = 0;
    let facturasPendientes = 0;

    const totalPagadoTecnicos = liquidaciones
      .filter((liquidacion) => {
        const fecha = new Date(liquidacion.created_at);
        return (
          fecha.getFullYear() === Number(year) &&
          fecha.getMonth() + 1 === Number(month)
        );
      })
      .reduce((acc, liquidacion) => acc + Number(liquidacion.monto), 0);

    facturas.forEach((factura) => {
      totalFacturado += Number(factura.total);
      totalPagado += Number(factura.importe || 0);
      gastosOperativos += Number(factura.gastos_operativos || 0);
      if (factura.estado === "pendiente") {
        facturasPendientes += 1;
      }
    });

    const margenBruto = totalFacturado - totalPagadoTecnicos;
    const gananciaNeta = margenBruto - gastosOperativos;

    return {
      totalFacturado,
      totalPagado: totalPagadoTecnicos,
      margenBruto,
      gastosOperativos,
      gananciaNeta,
      facturasPendientes,
    };
  };

  const exportarExcel = () => {
    const datosExcel = Object.entries(datosFiltrados).map(([key, facturas]) => {
      const [year, month] = key.split("-");
      const nombreMes = new Date(year, month - 1).toLocaleString("es", {
        month: "long",
      });

      const {
        totalFacturado,
        totalPagado,
        margenBruto,
        gastosOperativos,
        gananciaNeta,
        facturasPendientes,
      } = calcularTotales(facturas, year, month);

      return {
        "Periodo del Mes": `${nombreMes} - ${year}`,
        "Total Facturado": totalFacturado.toFixed(2),
        "Total Pagado a Técnicos": totalPagado.toFixed(2),
        "Margen Bruto": margenBruto.toFixed(2),
/*         "Gastos Operativos": gastosOperativos.toFixed(2), */
        "Ganancia Neta": gananciaNeta.toFixed(2),
        // "Facturas Pendientes de Cobro": facturasPendientes,
      };
    });

    const hoja = XLSX.utils.json_to_sheet(datosExcel);

    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Totalizador");

    XLSX.writeFile(libro, "Totalizador.xlsx");
  };

  return (
    <div className="totalizadorContainer">
      <Header text="Totalizador" />
      <div className="totalizadorLayout">
        {/* Selector de cajas */}
        <Cajas
          cajas={caja}
          onCajaSelect={handleCajaChange}
          selectedCajaId={selectedCajaId}
        />
        <div className="content">
          {/* Selector de fecha */}
          <CajaSeleccionada onDateChange={handleDateChange} />
          <div>
            {Object.entries(datosFiltrados).map(([key, facturas], index) => {
              const [year, month] = key.split("-");
              const nombreMes = new Date(year, month - 1).toLocaleString("es", {
                month: "long",
              });

              const {
                totalFacturado,
                totalPagado,
                margenBruto,
                gastosOperativos,
                gananciaNeta,
                // facturasPendientes,
              } = calcularTotales(facturas, year, month);

              return (
                <div
                  className={`d-flex datosCaja ${
                    index % 2 === 0 ? "bg-light" : ""
                  }`}
                  key={key}
                >
                  <li className="col text-center">{`${nombreMes} - ${year}`}</li>
                  <li className="col text-center">
                    {totalFacturado.toFixed(2)}
                  </li>
                  <li className="col text-center">{totalPagado.toFixed(2)}</li>
                  <li className="col text-center">{margenBruto.toFixed(2)}</li>
            {/*       <li className="col text-center">
                    {gastosOperativos.toFixed(2)}
                  </li> */}
                  <li className="col text-center">{gananciaNeta.toFixed(2)}</li>
                  {/* <li className="col text-center">{facturasPendientes}</li> */}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <button className="exportar-excel-totalizador" onClick={exportarExcel}>
        Exportar a Excel
      </button>
    </div>
  );
};

export default Totalizador;
