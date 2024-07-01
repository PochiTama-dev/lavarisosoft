/*
sistema contable
 fecha	(FECHA REGISTRACION EN SISTEMA)
fecha comprobante	(FECHA FACTURA)
cuenta (CODIGO CLIENTE)
cliente	(NOMBRE COMPLETO DEL CLIENTE	)
SISTEMA	(C1/C2)
codigo iva (CODIGO SISTEMA IVA)
tipo iva (RESP.INSCRIPTO/MONOTRIBUTO/CONS FINAL/ETC)
cuit (CUIT)
codigo factura (CODIGO FACTURA)
tipo factura (FACT/NC/ND)
letra	(A/B/M/ETC.)
sucursal (NUMERO SUCURSAL
comprobante (N°FACTURA AFIP)
control interno (N° CORRELATIVO EN SISTEMA PARA CONTROL)
neto (MONTO NETO)
IVA (MONTO IVA
total (MONTO TOTAL)
porcentaje (21/10,5)
fecha vto (VTO PARA EL PAGO)
 */

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
