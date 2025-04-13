import { useEffect, useState } from 'react';
import Header from '../../Header/Header';
/* import './CargarFactura.css'; */
import { listaCajas, modificarCaja } from '../../../services/cajasService';
import { listadoEmpleados } from '../../../services/empleadoService';
import { useCustomContext } from '../../../hooks/context';
import { useNavigate } from 'react-router-dom';
import fetchDolarBlue from '../../../services/ApiDolarService';

const CargarFacturaVenta = () => {
  const navigate = useNavigate();
  const {/*  PostSaldosPendientes, */ listaFacturasCompra, listaClientes } = useCustomContext();
  const [factura, setFactura] = useState({
    id_caja: null,
    importe: null,
    monto_pagado: null,
    tipo_comprobante: '',
    nro_comprobante: '',
    id_cliente: null,
    iva_alicuota: '',
    iva_deb_fiscal: '',
    id_tecnico : null,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
    descripcion: '',
    efectivo: 0,
    dolares: 0,
    transferencia: 0,
    codigo_imputacion: '',
  });
  const [proveedores, setProveedores] = useState([]);
  const [cajas, setCajas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [isCliente, setIsCliente] = useState(false);

  useEffect(() => {
    const obtenerTecnicos = async () => {
      const data = await listadoEmpleados();
      const filteredData = data.filter((emp) => emp.id_rol !== 4);
      setProveedores(filteredData);
    };

    const obtenerCajas = async () => {
      const data = await listaCajas();
      setCajas(data);
    };

    const obtenerClientes = async () => {
      const data = await listaClientes();
      setClientes(data);
    };

    obtenerTecnicos();
    obtenerCajas();
    obtenerClientes();
  }, []);

  const handleToggle = (e) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
    const { checked } = e.target;
    setIsCliente(checked);
    setFactura((prevFactura) => ({
      ...prevFactura,
      id_cliente: checked ? null : prevFactura.id_cliente,
      id_tecnico: checked ? null : prevFactura.id_tecnico,
    }));
  };

  const handleChange = async (e) => {
    const { name, value, checked } = e.target;
    setFactura((prevFactura) => {
      const updatedFactura = {
        ...prevFactura,
        [name]: name === 'estado_pago' ? Number(value) : name === 'gastos_operativos' ? checked : value,
      };

      if (name === 'codigo_imputacion') {
        updatedFactura.nro_comprobante = value; // Set nro_comprobante to codigo_imputacion
      }

      if (name === 'importe') {
        const importe = Number(value);
        updatedFactura.iva_alicuota = (importe * 21) / 100;
        updatedFactura.iva_deb_fiscal = (importe * 21) / 100;
      }

      return updatedFactura;
    });

    if (['efectivo', 'transferencia', 'dolares'].includes(name)) {
      const dolarBlueRate = await fetchDolarBlue();
      setFactura((prevFactura) => {
        const efectivo = parseFloat(prevFactura.efectivo || 0);
        const transferencia = parseFloat(prevFactura.transferencia || 0);
        const dolares = parseFloat(prevFactura.dolares || 0) * dolarBlueRate;
        return {
          ...prevFactura,
          monto_pagado: (efectivo + transferencia + dolares).toFixed(2),
        };
      });
    }

    console.log(factura);
  };

  const handleIvaChange = (e) => {
    const ivaPercentage = parseFloat(e.target.value);
    const importe = parseFloat(factura.importe) || 0;
    const ivaAlicuota = (importe * ivaPercentage) / 100;
    const ivaCredFiscal = importe + ivaAlicuota;

    setFactura((prevFactura) => ({
      ...prevFactura,
      iva_alicuota: ivaAlicuota.toFixed(2),
      iva_cred_fiscal: ivaCredFiscal.toFixed(2),
    }));
  };

  const postFactura = async (factura) => {
    const comprobantes = await listaFacturasCompra();
    const {
      tipo_comprobante,
      nro_comprobante,
      id_cliente,
      importe,
      iva_alicuota,
      iva_deb_fiscal,
      id_caja,
      descripcion,
      codigo_imputacion,
      efectivo,
      dolares,
      transferencia,
      id_tecnico,
    } = factura;
    const fetchFactura = await fetch('https://lv-back.online/facturasventa/guardar', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tipo_comprobante,
        nro_comprobante: nro_comprobante || comprobantes.length + 1,
        id_cliente,
        importe,
        iva_alicuota,
        iva_deb_fiscal,
        total: Number(importe) + Number(iva_alicuota),
        id_caja,
        descripcion,
        created_at: new Date(),
        codigo_imputacion,
        efectivo,
        dolares,
        transferencia,
        id_tecnico,
      }),
    });
    return fetchFactura.json();
  };

  const handleCreateFactura = async (factura) => {
    try {
      const {
        id_caja,
        tipo_comprobante,
        nro_comprobante,
        id_cliente,
        iva_alicuota,
        id_tecnico,
        iva_deb_fiscal,
        importe,
       /*  monto_pagado, */
        efectivo,
        dolares,
        transferencia,
        descripcion,
        codigo_imputacion,
      } = factura;

      const facturaCompra = await postFactura({
        id_caja,
        tipo_comprobante,
        nro_comprobante,
        id_cliente,
        importe,
        iva_alicuota,
        iva_deb_fiscal,
        descripcion,
        codigo_imputacion,
        efectivo,
        dolares,
        transferencia,
        id_tecnico,
      });

      console.log('datow factura', facturaCompra);
/* 
      if (Number(monto_pagado) < Number(importe) + Number(iva_alicuota)) {
        const dataBody = {
          caja: id_caja,
          presupuesto: null,
          facturaCompra: facturaCompra.id,
          tecnico: null,                                                                                             
          monto: Number(monto_pagado),
          tipo: 'proveedor',                                                                                                        
        };
        await PostSaldosPendientes(dataBody);
      } */

      // Actualizar caja: actualizar según los montos ingresados en efectivo, dólares y transferencia
      const cajaSeleccionada = cajas.find((c) => Number(c.id) === Number(id_caja));
      if (cajaSeleccionada) {
        let updatedFields = {};
        if (efectivo) {
          updatedFields.efectivo = Number(cajaSeleccionada.efectivo || 0) - Number(efectivo);
        }
        if (dolares) {
          updatedFields.dolares = Number(cajaSeleccionada.dolares || 0) - Number(dolares);
        }
        if (transferencia) {
          updatedFields.banco = Number(cajaSeleccionada.banco || 0) - Number(transferencia);
        }
        await modificarCaja(id_caja, updatedFields);
        console.log(updatedFields);
      }

      alert('Factura agregada con éxito');
      navigate(-1);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateFactura(factura);
  };

  return (
    <div>
      <Header text='Cargar factura' />
      <div className='factura-formulario'>
        {/*     <h2>Cargar factura</h2> */}
        <form onSubmit={handleSubmit}>
          <div>
            <label style={{ fontSize: '20px', margin: '10px' }}>
              <input
                style={{ fontSize: '20px', marginRight: '10px' }}
                type='checkbox'
                checked={isCliente}
                onChange={handleToggle}
              />
              Cliente ( seleccionar si es para un cliente)
            </label>
          </div>
          {isCliente ? (
            <div>
              <h3>Cliente:</h3>
              <select
                name='id_cliente'
                value={factura.id_cliente}
                onChange={handleChange}
                required
              >
                <option value=''>Seleccione un cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} {cliente.apellido}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <h3>Tecnico:</h3>
              <select
                name='id_tecnico'
                value={factura.id_tecnico}
                onChange={handleChange}
                required
              >
                <option value=''>Seleccione un tecnico</option>
                {proveedores.map((prov) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <h3>Tipo de comprobante:</h3>
            <select name='' id=''>
              <option value='' disabled selected>
                Seleccione comprobante
              </option>
              <option onClick={() => (factura.tipo_comprobante = 'Factura A')}>Factura A</option>
              <option onClick={() => (factura.tipo_comprobante = 'Factura B')}>Factura B</option>
              <option onClick={() => (factura.tipo_comprobante = 'Factura C')}>Factura C</option>
            </select>
          </div>
          <div>
            <h3>Descripcion:</h3>
            <input type='text' name='descripcion' value={factura.descripcion} onChange={handleChange} required />
          </div>
          <div>
            <h3>Importe:</h3>
            <input type='text' placeholder='0' name='importe' value={factura.importe} onChange={handleChange} required />
          </div>
          <div>
            <h3>Tipo de IVA:</h3>
            <select name='tipo_iva' onChange={handleIvaChange} required>
              <option value='' disabled selected>
                Seleccione tipo de IVA
              </option>
              <option value='10.5'>10.5%</option>
              <option value='21'>21%</option>
              <option value='27.5'>27.5%</option>
            </select>
          </div>
          <div>
            <h3>IVA alicuota:</h3>
            <input type='text' name='iva_alicuota' value={factura.iva_alicuota} readOnly />
          </div>
          <div>
            <h3>IVA credito fiscal:</h3>
            <input type='text' name='iva_deb_fiscal' value={factura.iva_deb_fiscal} readOnly />
          </div>
          <div>
            <h3>Caja:</h3>
            <select name='id_caja' value={factura.id_caja} onChange={handleChange} required>
              <option value=''>Seleccione una caja</option>
              {cajas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.denominacion}
                </option>
              ))}
            </select>
          </div>
  
          <div>
            <h3>Monto Efectivo:</h3>
            <input
              type='text'
              placeholder='0'
              name='efectivo'
              value={factura.efectivo}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                const disponible = parseFloat(cajas.find((c) => c.id === Number(factura.id_caja))?.efectivo || 0);
                if (value > disponible) {
                  setFactura((prevFactura) => ({ ...prevFactura, efectivo: disponible }));
                } else {
                  handleChange(e);
                }
              }}
            />
            <span style={{ fontSize: '14px', color: 'gray' }}>
              Disponible: ${cajas.find((c) => c.id === Number(factura.id_caja))?.efectivo || 0}
            </span>
          </div>
          <div>
            <h3>Monto Dolares:</h3>
            <input
              type='text'
              placeholder='0'
              name='dolares'
              value={factura.dolares}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                const disponible = parseFloat(cajas.find((c) => c.id === Number(factura.id_caja))?.dolares || 0);
                if (value > disponible) {
                  setFactura((prevFactura) => ({ ...prevFactura, dolares: disponible }));
                } else {
                  handleChange(e);
                }
              }}
            />
            <span style={{ fontSize: '14px', color: 'gray' }}>
              Disponible: ${cajas.find((c) => c.id === Number(factura.id_caja))?.dolares || 0}
            </span>
          </div>
          <div>
            <h3>Monto Transferencia:</h3>
            <input
              type='text'
              placeholder='0'
              name='transferencia'
              value={factura.transferencia}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                const disponible = parseFloat(cajas.find((c) => c.id === Number(factura.id_caja))?.banco || 0);
                if (value > disponible) {
                  setFactura((prevFactura) => ({ ...prevFactura, transferencia: disponible }));
                } else {
                  handleChange(e);
                }
              }}
            />
            <span style={{ fontSize: '14px', color: 'gray' }}>
              Disponible: ${cajas.find((c) => c.id === Number(factura.id_caja))?.banco || 0}
            </span>
          </div>
          <div>
            <h3>Importe</h3>
            <input
              type='text'
              placeholder='0'
              name='monto_pagado'
              value={factura.monto_pagado}
              onChange={handleChange}
              required
              disabled
            />
            {parseFloat(factura.efectivo || 0) + parseFloat(factura.dolares || 0) + parseFloat(factura.transferencia || 0) >
              parseFloat(factura.monto_pagado || 0) && (
              <span style={{ fontSize: '14px', color: 'red' }}>
                La suma de los montos no puede ser mayor que el importe pagado.
              </span>
            )}
          </div>
          <div>
            <h3>Código Imputación:</h3>
            <input
              type='text'
              name='codigo_imputacion'
              value={factura.codigo_imputacion}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <button type='submit'>Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CargarFacturaVenta;
