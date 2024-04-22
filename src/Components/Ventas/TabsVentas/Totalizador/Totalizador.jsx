import { useState } from 'react';
import Header from '../../../Header/Header';
import CajaSeleccionada from './CajaSeleccionada';
import Cajas from './Cajas';
const Totalizador = () => {
  const cajasVarias = [
    {
      name: 'caja 1',
      efectivo: [
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#123456',
          nomCliente: 'CAJA 1 Cabrero',
          idCliente: 'CL-123456',
          valor: 9800,
        },
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#43365',
          nomCliente: 'Amelia Suar',
          idCliente: 'CL-123457',
          valor: 4000,
        },
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#42525',
          nomCliente: 'Azul Villanueva',
          idCliente: 'CL-123458',
          valor: 7800,
        },
      ],
      dolares: [
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#123456',
          nomCliente: 'DOLAR Cabrero',
          idCliente: 'CL-123456',
          valor: 9800,
        },
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#43365',
          nomCliente: 'Amelia Suar',
          idCliente: 'CL-123457',
          valor: 4000,
        },
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#42525',
          nomCliente: 'Azul Villanueva',
          idCliente: 'CL-123458',
          valor: 7800,
        },
      ],
      banco: [
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#123456',
          nomCliente: 'BANCO Cabrero',
          idCliente: 'CL-123456',
          valor: 9800,
        },
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#43365',
          nomCliente: 'Amelia Suar',
          idCliente: 'CL-123457',
          valor: 4000,
        },
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#42525',
          nomCliente: 'Azul Villanueva',
          idCliente: 'CL-123458',
          valor: 7800,
        },
      ],
    },
    {
      name: 'caja 2',
      efectivo: [
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#123456',
          nomCliente: 'CAJA 2 Cabrero',
          idCliente: 'CL-123456',
          valor: 9800,
        },
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#43365',
          nomCliente: 'Amelia Suar',
          idCliente: 'CL-123457',
          valor: 4000,
        },
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#42525',
          nomCliente: 'Azul Villanueva',
          idCliente: 'CL-123458',
          valor: 7800,
        },
      ],
      dolares: [
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#123456',
          nomCliente: 'Ramon Cabrero',
          idCliente: 'CL-123456',
          valor: 9800,
        },
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#43365',
          nomCliente: 'Amelia Suar',
          idCliente: 'CL-123457',
          valor: 4000,
        },
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#42525',
          nomCliente: 'Azul Villanueva',
          idCliente: 'CL-123458',
          valor: 7800,
        },
      ],
      banco: [
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#123456',
          nomCliente: 'Ramon Cabrero',
          idCliente: 'CL-123456',
          valor: 9800,
        },
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#43365',
          nomCliente: 'Amelia Suar',
          idCliente: 'CL-123457',
          valor: 4000,
        },
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#42525',
          nomCliente: 'Azul Villanueva',
          idCliente: 'CL-123458',
          valor: 7800,
        },
      ],
    },
    {
      name: 'caja 3',
      efectivo: [
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#123456',
          nomCliente: 'CAJA 3 Cabrero',
          idCliente: 'CL-123456',
          valor: 9800,
        },
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#43365',
          nomCliente: 'Amelia Suar',
          idCliente: 'CL-123457',
          valor: 4000,
        },
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#42525',
          nomCliente: 'Azul Villanueva',
          idCliente: 'CL-123458',
          valor: 7800,
        },
      ],
      dolares: [
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#123456',
          nomCliente: 'Ramon Cabrero',
          idCliente: 'CL-123456',
          valor: 9800,
        },
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#43365',
          nomCliente: 'Amelia Suar',
          idCliente: 'CL-123457',
          valor: 4000,
        },
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#42525',
          nomCliente: 'Azul Villanueva',
          idCliente: 'CL-123458',
          valor: 7800,
        },
      ],
      banco: [
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#123456',
          nomCliente: 'Ramon Cabrero',
          idCliente: 'CL-123456',
          valor: 9800,
        },
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#43365',
          nomCliente: 'Amelia Suar',
          idCliente: 'CL-123457',
          valor: 4000,
        },
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#42525',
          nomCliente: 'Azul Villanueva',
          idCliente: 'CL-123458',
          valor: 7800,
        },
      ],
    },
    {
      name: 'caja 4',
      efectivo: [
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#123456',
          nomCliente: 'CAJA 4 Cabrero',
          idCliente: 'CL-123456',
          valor: 9800,
        },
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#43365',
          nomCliente: 'Amelia Suar',
          idCliente: 'CL-123457',
          valor: 4000,
        },
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#42525',
          nomCliente: 'Azul Villanueva',
          idCliente: 'CL-123458',
          valor: 7800,
        },
      ],
      dolares: [
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#123456',
          nomCliente: 'Ramon Cabrero',
          idCliente: 'CL-123456',
          valor: 9800,
        },
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#43365',
          nomCliente: 'Amelia Suar',
          idCliente: 'CL-123457',
          valor: 4000,
        },
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#42525',
          nomCliente: 'Azul Villanueva',
          idCliente: 'CL-123458',
          valor: 7800,
        },
      ],
      banco: [
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#123456',
          nomCliente: 'Ramon Cabrero',
          idCliente: 'CL-123456',
          valor: 9800,
        },
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#43365',
          nomCliente: 'Amelia Suar',
          idCliente: 'CL-123457',
          valor: 4000,
        },
        {
          fecha: '25/12/23',
          codImp: 1111111,
          numOp: '#42525',
          nomCliente: 'Azul Villanueva',
          idCliente: 'CL-123458',
          valor: 7800,
        },
      ],
    },
  ];
  const [caja, setCaja] = useState(cajasVarias[0]);

  const nombreCajas = cajasVarias.map((nombre) => nombre.name);

  const handleCaja = (num) => {
    setCaja(cajasVarias[num]);
  };

  return (
    <div>
      <Header text={'Totalizador'} />
      <div className='containerTotalizador d-flex'>
        <Cajas nombresCajas={nombreCajas} cajaSeteada={handleCaja} />
        <div className='cajaDetalle'>
          <CajaSeleccionada cajaSelected={caja} />
        </div>
      </div>
    </div>
  );
};

export default Totalizador;
