import { useEffect, useState } from 'react';
import Header from '../Header/Header';
import './CargarFactura.css';
import { listaCajas, modificarCaja } from '../../services/cajasService';
import { listadoProveedores } from '../../services/proveedoresService';
import { useCustomContext } from '../../hooks/context';
import { useNavigate } from 'react-router-dom';
import fetchDolarBlue from '../../services/ApiDolarService';

const CargarFactura = () => {
  const navigate = useNavigate();
  const { PostSaldosPendientes, listaFacturasCompra } = useCustomContext();
  const [factura, setFactura] = useState({
    id_proveedor: null,
    id_caja: null,
    importe: null,
    monto_pagado: null,
    tipo_comprobante: '',
    iva_alicuota: '',
    iva_cred_fiscal: '',
    descripcion: '',
    efectivo: '',
    dolares: '',
    transferencia: '',
    codigo_imputacion: '',  
  });
  const [proveedores, setProveedores] = useState([]);
  const [cajas, setCajas] = useState([]);

  useEffect(() => {
    const obtenerProveedores = async () => {
      const data = await listadoProveedores();
      setProveedores(data);
    };

    const obtenerCajas = async () => {
      const data = await listaCajas();
      setCajas(data);
    };

    obtenerProveedores();
    obtenerCajas();
  }, []);

  const handleChange = async (e) => {
    const { name, value, checked } = e.target;
    setFactura((prevFactura) => {
      const updatedFactura = {
        ...prevFactura,
        [name]: name === 'estado_pago' ? Number(value) : name === 'gastos_operativos' ? checked : value,
      };

      // Recalculate IVA fields only if 'importe' changes
      if (name === 'importe') {
        const importe = Number(value); // Ensure value is treated as a number
        updatedFactura.iva_alicuota = (importe * 21) / 100;
        updatedFactura.iva_cred_fiscal = (importe * 21) / 100;
      }

      return updatedFactura;
    });

    // Update monto_pagado as the sum of efectivo, transferencia, and dolares (converted to pesos)
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

    console.log(factura); // Debugging: Log the updated factura state
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
    const { id_proveedor, importe, id_caja, tipo_comprobante, iva_alicuota, iva_cred_fiscal, monto_pagado, efectivo, dolares, transferencia, codigo_imputacion } = factura;

    const fetchFactura = await fetch('https://lv-back.online/facturascompra/guardar', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_caja,
        tipo_comprobante,
        nro_comprobante: comprobantes.length + 1,
        id_proveedor,
        iva_alicuota,
        iva_cred_fiscal,
        importe,
        total: Number(importe),
        monto_pagado,
        descripcion: factura.descripcion,
        created_at: new Date(),
        efectivo,  
        dolares,   
        transferencia, 
        codigo_imputacion,
      }),
    });
    return fetchFactura.json();
  };

  const handleCreateFactura = async (factura) => {
    try {
      const { id_proveedor, id_caja, tipo_comprobante, iva_alicuota, importe, iva_cred_fiscal, monto_pagado, efectivo, dolares, transferencia, codigo_imputacion } = factura;

      const facturaCompra = await postFactura({
        id_caja,
        tipo_comprobante,
        id_proveedor,
        iva_alicuota,
        iva_cred_fiscal,
        importe,
        total: Number(importe) + Number(iva_alicuota),
        monto_pagado,
        descripcion: factura.descripcion,
        created_at: new Date(),
        efectivo,  
        dolares,   
        transferencia,
        codigo_imputacion,
      });

      console.log("datow factura", facturaCompra);

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
      }

      // Actualizar caja: actualizar según los montos ingresados en efectivo, dólares y transferencia
      const cajaSeleccionada = cajas.find(c => Number(c.id) === Number(id_caja));
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
        <h2>Cargar factura</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <h3>Proveedor:</h3>
            <select name='id_proveedor' value={factura.id_proveedor} onChange={handleChange} required>
              <option value=''>Seleccione un proveedor</option>
              {proveedores.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.nombre}
                </option>
              ))}
            </select>
          </div>
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
            <input type='text' name='iva_cred_fiscal' value={factura.iva_cred_fiscal} readOnly />
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
            <h3>Importe pagado:</h3>
            <input
              type='text'
              placeholder='0'
              name='monto_pagado'
              value={factura.monto_pagado}
              onChange={handleChange}
              required
            />
            {parseFloat(factura.efectivo || 0) + parseFloat(factura.dolares || 0) + parseFloat(factura.transferencia || 0) > parseFloat(factura.monto_pagado || 0) && (
              <span style={{ fontSize: '14px', color: 'red' }}>
                La suma de los montos no puede ser mayor que el importe pagado.
              </span>
            )}
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

export default CargarFactura;
