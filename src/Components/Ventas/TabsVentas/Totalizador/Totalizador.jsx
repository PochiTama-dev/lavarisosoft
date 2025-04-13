import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [datosFiltrados, setDatosFiltrados] = useState([]);
  const [mesFacturado, setMesFacturado] = useState({});
  const [liquidaciones, setLiquidaciones] = useState([]);
  const [totalesPorMes, setTotalesPorMes] = useState({});

  const gastosDb = async () => {
    try {
      const response = await fetch("https://lv-back.online/gastos/listado");
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

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
          organizarFacturasPorMes([
            ...facturasVenta.map((f) => ({ ...f, tipo: "venta" })),
            ...facturasCompra.map((f) => ({ ...f, tipo: "compra" })),
          ])
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

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
  };

  useEffect(() => {
    const updateDatosFiltrados = async () => {
      const filteredData = await Object.entries(mesFacturado).reduce(
        async (accPromise, [key, facturas]) => {
          const acc = await accPromise;
          const [year, month] = key.split("-");
          if (
            (!selectedDate.year || selectedDate.year === year) &&
            (!selectedDate.month ||
              Number(selectedDate.month) === Number(month))
          ) {
            const facturasFiltradas = facturas.filter((factura) => {
              const metodoPagoValido =
                selectedPaymentMethod === "transferencia"
                  ? Number(factura.transferencia) > 0 ||
                    Number(factura.banco) > 0
                  : selectedPaymentMethod
                  ? Number(factura[selectedPaymentMethod]) > 0
                  : true;

              return (
                (!selectedCajaId ||
                  Number(factura.id_caja) === Number(selectedCajaId)) &&
                metodoPagoValido
              );
            });
            if (facturasFiltradas.length > 0) {
              acc[key] = facturasFiltradas;
            }
          }
          return acc;
        },
        Promise.resolve({})
      );
      setDatosFiltrados(filteredData);
    };
    updateDatosFiltrados();
  }, [mesFacturado, selectedDate, selectedCajaId, selectedPaymentMethod]);

  useEffect(() => {
    const calcularTotalesPorMes = async () => {
      const nuevosTotales = {};
      for (const [key, facturas] of Object.entries(datosFiltrados)) {
        const [year, month] = key.split("-");
        nuevosTotales[key] = await calcularTotales(facturas, year, month);
      }
      setTotalesPorMes(nuevosTotales);
    };
    calcularTotalesPorMes();
  }, [datosFiltrados]);

  const calcularTotales = async (facturas, year, month) => {
    let totalFacturado = 0;
    let compraGastos = 0;
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
      const metodoPagoTotal = selectedPaymentMethod
        ? Number(factura[selectedPaymentMethod])
        : Number(factura.total);

      if (factura.tipo === "compra") {
        compraGastos += metodoPagoTotal;
      } else {
        totalFacturado += metodoPagoTotal;
      }
      if (factura.estado === "pendiente") {
        facturasPendientes += 1;
      }
    });

    const gastos = await gastosDb();
    const gastosAPI = gastos
      .filter((gasto) => {
        const fecha = gasto.Proveedore?.fecha_ingreso || gasto.fecha_ingreso;
        if (!fecha) return false;
        let gastoYear, gastoMonth;
        if (fecha.includes("-")) {
          const d = new Date(fecha);
          gastoYear = d.getFullYear();
          gastoMonth = d.getMonth();
        } else {
          const [monthGasto, yearGasto] = fecha.split("/");
          gastoYear = Number(yearGasto);
          gastoMonth = Number(monthGasto);
        }
        return (
          Number(gastoYear) === Number(year) &&
          Number(gastoMonth) === Number(month)
        );
      })
      .reduce((acc, gasto) => acc + parseFloat(gasto.importe || 0), 0);

    const gastosOperativos = compraGastos + gastosAPI;
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

  const exportarExcel = async () => {
    const datosExcel = await Promise.all(
      Object.entries(datosFiltrados).map(async ([key, facturas]) => {
        const [year, month] = key.split("-");
        const nombreMes = new Date(year, month - 1).toLocaleString("es", {
          month: "long",
        });
        const totales = await calcularTotales(facturas, year, month);
        return {
          "Periodo del Mes": `${nombreMes} - ${year}`,
          "Total Facturado": totales.totalFacturado?.toFixed(2) || "",
          "Total Pagado a Técnicos": totales.totalPagado?.toFixed(2) || "",
          "Margen Bruto": totales.margenBruto?.toFixed(2) || "",
          "Gastos Operativos": totales.gastosOperativos?.toFixed(2) || "",
          "Ganancia Neta": totales.gananciaNeta?.toFixed(2) || "",
        };
      })
    );
    const hoja = XLSX.utils.json_to_sheet(datosExcel);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Totalizador");
    XLSX.writeFile(libro, "Totalizador.xlsx");
  };

  const exportarPDF = async () => {
    const doc = new jsPDF();
    doc.text("Totalizador", 14, 20);

    const datosPDF = await Promise.all(
      Object.entries(datosFiltrados).map(async ([key, facturas]) => {
        const [year, month] = key.split("-");
        const nombreMes = new Date(year, month - 1).toLocaleString("es", {
          month: "long",
        });
        const totales = await calcularTotales(facturas, year, month);
        return {
          periodo: `${nombreMes} - ${year}`,
          totalFacturado: totales.totalFacturado?.toFixed(2) || "",
          totalPagado: totales.totalPagado?.toFixed(2) || "",
          margenBruto: totales.margenBruto?.toFixed(2) || "",
          gastosOperativos: totales.gastosOperativos?.toFixed(2) || "",
          gananciaNeta: totales.gananciaNeta?.toFixed(2) || "",
        };
      })
    );

    doc.autoTable({
      startY: 30,
      head: [
        [
          "Periodo del Mes",
          "Total Facturado",
          "Total Pagado a Técnicos",
          "Margen Bruto",
          "Gastos Operativos",
          "Ganancia Neta",
        ],
      ],
      body: datosPDF.map((dato) => [
        dato.periodo,
        `$ ${dato.totalFacturado}`,
        `$ ${dato.totalPagado}`,
        `$ ${dato.margenBruto}`,
        `$ ${dato.gastosOperativos}`,
        `$ ${dato.gananciaNeta}`,
      ]),
    });

    doc.save("Totalizador.pdf");
  };

  return (
    <div className="totalizadorContainer">
      <Header text="Totalizador" />
      <div className="totalizadorLayout">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Cajas
            cajas={caja}
            onCajaSelect={handleCajaChange}
            selectedCajaId={selectedCajaId}
          />
          <div className="d-flex justify-content-center align-items-center">
            <select
              id="paymentMethod"
              className="form-select"
              style={{
                height: "38px",
                width: "300px",
                margin: "40px 0 30px 30px",
              }}
              value={selectedPaymentMethod}
              onChange={(e) => handlePaymentMethodChange(e.target.value)}
            >
              <option value="" disabled>
                Seleccione un método de pago
              </option>
              <option value="">Todos</option>
              <option value="efectivo">Efectivo</option>
              <option value="dolares">Dólares</option>
              <option value="transferencia">Banco</option>
            </select>
          </div>
        </div>
        <div className="content">
          <CajaSeleccionada onDateChange={handleDateChange} />
          <div>
            {Object.entries(datosFiltrados).map(([key], index) => {
              const [year, month] = key.split("-");
              const nombreMes = new Date(year, month - 1).toLocaleString("es", {
                month: "long",
              });

              const totales = totalesPorMes[key] || {
                totalFacturado: 0,
                totalPagado: 0,
                margenBruto: 0,
                gastosOperativos: 0,
                gananciaNeta: 0,
              };

              return (
                <div
                  className={`d-flex datosCaja ${
                    index % 2 === 0 ? "bg-light" : ""
                  }`}
                  key={key}
                >
                  <li className="col text-center">{`${nombreMes} - ${year}`}</li>
                  <li className="col text-center">
                    $ {totales.totalFacturado.toFixed(2)}
                  </li>
                  <li className="col text-center">
                    $ {totales.totalPagado.toFixed(2)}
                  </li>
                  <li className="col text-center">
                    $ {totales.margenBruto.toFixed(2)}
                  </li>
                  <li className="col text-center">
                    $ {totales.gastosOperativos.toFixed(2)}
                  </li>
                  <li className="col text-center">
                    $ {totales.gananciaNeta.toFixed(2)}
                  </li>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button className="exportar-excel-totalizador" onClick={exportarExcel}>
          Exportar a Excel
        </button>
        <button className="exportar-excel-totalizador" onClick={exportarPDF}>
          Exportar a PDF
        </button>
      </div>
    </div>
  );
};

export default Totalizador;
