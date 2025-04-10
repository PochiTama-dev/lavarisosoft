import { useEffect, useState } from 'react';
import Header from '../Header/Header';
import './CargarFactura.css';
import { listaCajas } from '../../services/cajasService';
import { listadoProveedores } from '../../services/proveedoresService';
import { useCustomContext } from '../../hooks/context';
import { useNavigate } from 'react-router-dom';

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

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFactura((prevFactura) => ({
      ...prevFactura,
      [name]: name === 'estado_pago' ? Number(value) : value,
      [name]: name === 'gastos_operativos' ? checked : value,
      iva_alicuota: (prevFactura.importe * 21) / 100,
      iva_cred_fiscal: (prevFactura.importe * 21) / 100,
    }));
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
    const { id_proveedor, importe, id_caja, tipo_comprobante, iva_alicuota, iva_cred_fiscal, monto_pagado } = await factura;

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
        total: Number(importe) + Number(iva_alicuota),
        monto_pagado,
        descripcion: 'Factura proveedor',
  
        created_at: new Date(),
      }),
    });
    return fetchFactura.json();
  };

  const handleCreateFactura = async (factura) => {
    try {
      const { id_proveedor, id_caja, tipo_comprobante, iva_alicuota, importe, iva_cred_fiscal, monto_pagado  } = await factura;

      const facturaCompra = await postFactura({
        id_caja,
        tipo_comprobante,
        id_proveedor,
        iva_alicuota,
        iva_cred_fiscal,
        importe,
        total: Number(importe) + Number(iva_alicuota),
        monto_pagado,
        
        created_at: new Date(),
      });
console.log("datow factura",facturaCompra);
      if (Number(factura.monto_pagado) < Number(importe) + Number(iva_alicuota)) {
        const dataBody = {
          caja: id_caja,
          presupuesto: null,
          facturaCompra: await facturaCompra.id,
          tecnico: null,
          monto: Number(factura.monto_pagado),
          tipo: 'proveedor',
        };
        await PostSaldosPendientes(dataBody);
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
          {/* <div>
            <h3>Repuesto:</h3>
            <select name='id_repuesto' value={factura.id_repuesto} onChange={handleChange} required>
              <option value=''>Seleccione un repuesto</option>
              {repuestos.map((rep) => (
                <option key={rep.id} value={rep.id}>
                  {rep.nombre}
                </option>
              ))}
            </select>
          </div> */}
          {/* <div>
            <h3>Responsable:</h3>
            <select name='id_responsable' value={factura.id_responsable} onChange={handleChange} required>
              <option value=''>Seleccione un responsable</option>
              {empleados.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.nombre} {emp.apellido}
                </option>
              ))}
            </select>
          </div> */}
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
            <h3>Importe pagado:</h3>
            <input type='text' placeholder='0' name='monto_pagado' value={factura.monto_pagado} onChange={handleChange} required />
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
     {/*       <div>
            <h3>IVA alicuota:</h3>
            <input
              type='text'
              name='iva_alicuota'
              value={factura.tipo_comprobante === 'Factura A' || factura.tipo_comprobante === 'Factura B' ? (factura.importe * 21) / 100 : factura.iva_alicuota}
              onChange={handleChange}
            />
          </div>
          <div>
            <h3>IVA credito fiscal:</h3>
            <input
              type='text'
              name='iva_cred_fiscal'
              value={factura.tipo_comprobante === 'Factura A' || factura.tipo_comprobante === 'Factura B' ? (factura.importe * 21) / 100 : factura.iva_cred_fiscal}
              onChange={handleChange}
            />
          </div>   */}  
    {/*       <div>
            <h3>Gastos operativos:</h3>
            <input type='checkbox' name='gastos_operativos' checked={factura.gastos_operativos} onChange={handleChange} />
          </div> */}
          <div>
            <button type='submit'>Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CargarFactura;
