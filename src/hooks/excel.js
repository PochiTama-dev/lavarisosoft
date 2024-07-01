/*
sistema contable
 fecha	
FECHA REGISTRACION EN SISTEMA
fecha comprobante	
FECHA FACTURA
cuenta	
CODIGO CLIENTE
cliente	
NOMBRE COMPLETO DEL CLIENTE	
SISTEMA	
C1/C2
codigo iva
CODIGO SISTEMA IVA
tipo iva
RESP.INSCRIPTO/MONOTRIBUTO/CONS FINAL/ETC
cuit
CUIT
codigo factura
CODIGO FACTURA
tipo factura
FACT/NC/ND
letra	
A/B/M/ETC.
sucursal
NUMERO SUCURSAL
comprobante
N°FACTURA AFIP
control interno
N° CORRELATIVO EN SISTEMA PARA CONTROL
neto
MONTO NETO
IVA
MONTO IVA
total
MONTO TOTAL
porcentaje
21/10,5
fecha vto
VTO PARA EL PAGO
 */

/* export const uploadExcelSistemaContable = async (req, res) => {
    function getMedioPago(id_activo) {
      const mediosPago = {
        1: 'EFECTIVO',
        2: ['CUENTA', 'DEP./TRANSF', 'DEP./TRANSF.'],
        3: 'CHEQUE',
        4: 'E-CHEQ',
        5: 'MERCADO PAGO',
      };
      for (const indice in mediosPago) {
        if (mediosPago[indice].includes(id_activo)) {
          return parseInt(indice); // Convertir el índice a número
        }
      }
      // Si no se encuentra el valor, devolver un valor por defecto o manejar la situación según tus necesidades
      return null; // o puedes lanzar un error, devolver -1, etc.
    }
  
    try {
      const workbook = new ExcelJS.Workbook();
      const fileBuffer = req.file.buffer;
      await workbook.xlsx.load(fileBuffer);
      const worksheet = workbook.getWorksheet(1);
      const data = [];
  
      // Obtiene todas las filas excepto la primera
      // Desde la 3er fila, la 1ra muestra la fecha, la 2da los titulos, la 3ra los datos
      const rows = worksheet.getRows(3, worksheet.rowCount - 1);
  
      //Datos de usuario logueado NO FUNCA
      const userData2 = await req.body.userData;
  
      console.log('USER DATA 2: ', userData2);
      const userData = await Users.findOne({
        where: {
          id: userData2,
        },
      });
      for (const row of rows) {
   
        if (row.actualCellCount > 0) {
          const sucursal = await Sucursal.findOne({
            where: {
              sucursal: row.getCell(7).value,
            },
          });
          console.log(row.getCell(4).value);
          console.log(getMedioPago(row.getCell(4).value));
  
          const rowData = {
            fecha: new Date(),
            actualizado: new Date(),
            sucur: userData.id_sucursal,
            cliente: row.getCell(1).value,
            reciboNro: row.getCell(2).value,
            numeroOperacion: row.getCell(2).value,
            movimiento: row.getCell(3).value,
            id_activo: getMedioPago(row.getCell(4).value),
            detalle: row.getCell(5).value,
            valor: row.getCell(6).value,
            disponible: row.getCell(6).value, //Lo mismo que la anterior porque entra X valor y ese es lo disponible
            aprobado: row.getCell(8).value === 'true',
            isRead: row.getCell(9).value === 'true',
            user: userData.usuario,
            input6: row.getCell(10).value,
            input7: row.getCell(11).value,
            input8: row.getCell(12).value,
            input9: row.getCell(13).value,
            input10: row.getCell(14).value,
            tipo: 'ingreso',
          };
          data.push(rowData);
        }
   
      }
      await Ingresos.bulkCreate(data);
      res.status(200).json({ message: 'Datos cargados exitosamente' });
    } catch (error) {
      console.error('Error al cargar el archivo Excel:', error);
      res.status(500).json({ error: 'Error al cargar el archivo Excel' });
    }
  }; */
