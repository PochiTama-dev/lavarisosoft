import { useEffect, useState } from 'react';
import Header from '../Header/Header';
import './CargarFactura.css';
import { useNavigate } from 'react-router-dom';
import { listadoEmpleados } from '../../services/empleadoService';
import { listaCajas } from '../../services/cajasService';
import { listaStockPrincipal } from '../../services/stockPrincipalService';
import { listadoProveedores } from '../../services/proveedoresService';
import { useCustomContext } from '../../hooks/context';

const CargarFactura = () => {
  const { PostSaldosPendientes, listaFacturasCompra } = useCustomContext();
  const [factura, setFactura] = useState({
    id_proveedor: 0,
    id_caja: 0,
    importe: 0,
    monto_pagado: 0,
    tipo_comprobante: '',
    iva_alicuota: '',
    iva_cred_fiscal: '',
    gastos_operativos: false,
    //id_repuesto: 0,
    //id_responsable: 0,
    //cantidad: 0,
    //codigo_imputacion: '',
    //fecha_ingreso: '',
    //imagen_comprobante: '',
    //estado_pago: 0,
    //lote: '',
  });
  const [proveedores, setProveedores] = useState([]);
  const [repuestos, setRepuestos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [cajas, setCajas] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const obtenerProveedores = async () => {
      const data = await listadoProveedores();
      setProveedores(data);
    };

    const obtenerRepuestos = async () => {
      const data = await listaStockPrincipal();
      setRepuestos(data);
    };
    const obtenerEmpleados = async () => {
      const data = await listadoEmpleados();
      setEmpleados(data);
    };
    const obtenerCajas = async () => {
      const data = await listaCajas();
      setCajas(data);
    };
    obtenerProveedores();
    obtenerRepuestos();
    obtenerEmpleados();
    obtenerCajas();
  }, []);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFactura((prevFactura) => ({
      ...prevFactura,
      [name]: name === 'estado_pago' ? Number(value) : value,
      [name]: name === 'gastos_operativos' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateFactura(factura);
  };

  const handleCreateFactura = async (factura) => {
    try {
      const { id_proveedor, id_caja, tipo_comprobante, iva_alicuota, importe, iva_cred_fiscal, monto_pagado, gastos_operativos } = await factura;
      //console.log(monto_pagado);
      const facturaCompra = await postFactura({
        id_caja,
        tipo_comprobante,
        id_proveedor,
        iva_alicuota,
        iva_cred_fiscal,
        importe,
        total: Number(importe) + Number(iva_alicuota) + Number(iva_cred_fiscal),
        monto_pagado,
        gastos_operativos,
        created_at: new Date(),
      });
      //console.log(facturaCompra);
      if (Number(factura.monto_pagado) < Number(importe) + Number(iva_alicuota) + Number(iva_cred_fiscal)) {
        const dataBody = {
          caja: id_caja,
          presupuesto: null,
          facturaCompra: await facturaCompra.id,
          tecnico: null,
          monto: Number(factura.monto_pagado),
          tipo: 'proveedor',
        };
        console.log(dataBody);
        await PostSaldosPendientes(dataBody);
      }
      alert('Factura agregada con éxito');
      //  navigate(-1);
    } catch (error) {
      console.error(error);
    }
  };

  const postFactura = async (factura) => {
    const comprobantes = await listaFacturasCompra();
    const { id_proveedor, importe, id_caja, tipo_comprobante, iva_alicuota, iva_cred_fiscal, monto_pagado, gastos_operativos } = await factura;
    // id_responsable, cantidad, codigo_imputacion, fecha_ingreso, imagen_comprobante, estado_pago,
    const fetchFactura = await fetch('https://lv-back.online/facturascompra/guardar', {
      method: 'post',
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
        total: Number(importe) + Number(iva_alicuota) + Number(iva_cred_fiscal),
        monto_pagado,
        descripcion: 'Factura proveedor',
        gastos_operativos,
        created_at: new Date(),
      }),
    });
    //console.log('Factura cargada: ', fetchFactura);
    return fetchFactura.json();
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
          {/* <div>
            <h3>Cantidad:</h3>
            <input type='number' placeholder='0' name='cantidad' value={factura.cantidad} onChange={handleChange} required />
          </div> */}
          <div>
            <h3>Importe:</h3>
            <input type='text' placeholder='0' name='importe' value={factura.importe} onChange={handleChange} required />
          </div>
          <div>
            <h3>Importe pagado:</h3>
            <input type='text' placeholder='0' name='monto_pagado' value={factura.monto_pagado} onChange={handleChange} required />
          </div>
          {/* <div>
            <h3>Cod. imputación:</h3>
            <input type='text' name='codigo_imputacion' value={factura.codigo_imputacion} onChange={handleChange} required />
          </div> */}
          {/* <div>
            <h3>Fecha de ingreso:</h3>
            <input type='text' placeholder='dd/mm/aaaa' name='fecha_ingreso' value={factura.fecha_ingreso} onChange={handleChange} required />
          </div> */}
          {/* <div>
            <h3>Imagen comprobante:</h3>
            <input type='file' name='imagen_comprobante' value={factura.imagen_comprobante} onChange={handleChange} required />
          </div> */}
          <div>
            <h3>Estado pago:</h3>
            <select name='estado_pago' value={factura.estado_pago} onChange={handleChange} required>
              <option value={0}>No pagado</option>
              <option value={1}>Pagado</option>
            </select>
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
          {/* <div>
            <h3>Lote:</h3>
            <input type='text' name='lote' value={factura.lote} onChange={handleChange} />
          </div> */}
          <div>
            <h3>Tipo de comprobante:</h3>
            <input type='text' name='tipo_comprobante' value={factura.tipo_comprobante} onChange={handleChange} />
          </div>
          <div>
            <h3>IVA alicuota:</h3>
            <input type='text' name='iva_alicuota' value={factura.iva_alicuota} onChange={handleChange} />
          </div>
          <div>
            <h3>IVA credito fiscal:</h3>
            <input type='text' name='iva_cred_fiscal' value={factura.iva_cred_fiscal} onChange={handleChange} />
          </div>
          <div>
            <h3>Gastos operativos:</h3>
            <input type='checkbox' name='gastos_operativos' value={factura.gastos_operativos} onChange={handleChange} />
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
