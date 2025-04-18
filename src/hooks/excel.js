import ExcelJS from 'exceljs';

export const uploadExcelSistemaContable = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const fileBuffer = req.file.buffer;
    await workbook.xlsx.load(fileBuffer);
    const worksheet = workbook.getWorksheet(1);
    const data = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        // Omitir la primera fila si es el encabezado
        const rowData = {
          fecha: row.getCell(1).value,
          fechaComprobante: row.getCell(2).value,
          cuenta: row.getCell(3).value,
          cliente: row.getCell(4).value,
          sistema: row.getCell(5).value,
          codigoIva: row.getCell(6).value,
          tipoIva: row.getCell(7).value,
          cuit: row.getCell(8).value,
          codigoFactura: row.getCell(9).value,
          tipoFactura: row.getCell(10).value,
          letra: row.getCell(11).value,
          sucursal: row.getCell(12).value,
          comprobante: row.getCell(13).value,
          controlInterno: row.getCell(14).value,
          neto: row.getCell(15).value,
          iva: row.getCell(16).value,
          total: row.getCell(17).value,
          porcentaje: row.getCell(18).value,
          fechaVto: row.getCell(19).value,
        };
        data.push(rowData);
      }
    });

    //await Ingresos.bulkCreate(data);
    res.status(200).json({ message: 'Datos cargados exitosamente' });
  } catch (error) {
    console.error('Error al cargar el archivo Excel:', error);
    res.status(500).json({ error: 'Error al cargar el archivo Excel' });
  }
};

export const uploadExcelEmpleados = async (event) => {
  return new Promise((resolve, reject) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Archivo seleccionado:', file);

      const workbook = new ExcelJS.Workbook();
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const buffer = e.target.result;
          await workbook.xlsx.load(buffer);
          const worksheet = workbook.getWorksheet(1);
          const data = [];

          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
              const rowData = {
                nombre: row.getCell(1).value,
                apellido: row.getCell(2).value,
                id_rol: checkRol(row.getCell(3).value),
                email: row.getCell(4).value,
                legajo: row.getCell(5).value,
                cuil: row.getCell(6).value,
                telefono: row.getCell(7).value,
                direccion: row.getCell(8).value,
              };
              data.push(rowData);
            }
          });
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => {
        console.error('Error al leer el archivo:', error);
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error('No file selected'));
    }
  });
};

const checkRol = (rol) => {
  const roles = {
    'Atención al cliente': 1,
    'Contable administrativo': 2,
    'Jefe de taller': 3,
    'Super administrador': 4,
    Técnico: 5,
  };

  return roles[rol] || null;
};

export const uploadExcelStock = async (event) => {
  return new Promise((resolve, reject) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Archivo seleccionado:', file);

      const workbook = new ExcelJS.Workbook();
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const buffer = e.target.result;
          await workbook.xlsx.load(buffer);
          const worksheet = workbook.getWorksheet(1);
          const data = [];

          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
              const rowData = {
                articulo: row.getCell(1).value,
                descripcion: row.getCell(2).value,
              };
              data.push(rowData);
            }
          });
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => {
        console.error('Error al leer el archivo:', error);
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error('No file selected'));
    }
  });
};

export const exportExcelTotalizador = async (data) => {
  try {
    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Totalizador');

    // Agregar encabezados
    worksheet.columns = [
      { header: 'Periodo del Mes', key: 'periodo', width: 20 },
      { header: 'Total Facturado', key: 'total_facturado', width: 20 },
      { header: 'Total Pagado a Técnicos', key: 'total_pagado_tecnicos', width: 25 },
      { header: 'Margen Bruto', key: 'margen_bruto', width: 20 },
/*       { header: 'Gastos Operativos', key: 'gastos_operativos', width: 20 }, */
      { header: 'Ganancia Neta', key: 'ganancia_neta', width: 20 },
      { header: 'Facturas Pendientes de Cobro', key: 'facturas_pendientes', width: 30 },
    ];

    // Agregar datos al archivo Excel
    data.forEach((row) => {
      worksheet.addRow({
        periodo: row.periodo,
        total_facturado: row.totalFacturado,
        total_pagado_tecnicos: row.totalPagadoTecnicos,
        margen_bruto: row.margenBruto,
        gastos_operativos: row.gastosOperativos,
        ganancia_neta: row.gananciaNeta,
        facturas_pendientes: row.facturasPendientes,
      });
    });

    // Generar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();

    // Descargar el archivo
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Totalizador.xlsx';
    link.click();
  } catch (error) {
    console.error('Error al exportar el archivo Excel:', error);
  }
};
