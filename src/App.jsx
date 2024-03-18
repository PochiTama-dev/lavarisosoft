 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './pages/Login/Login';
import Menu from './Components/Menu/Menu';
import Clientes from './Components/Clientes/Clientes';
import UploadEmpleado from './Components/Clientes/UploadEmpleado';
import UploadEmpleadoExcel from './Components/Clientes/UploadEmpleadoExcel';
import Ubicaciones from './Components/Ubicaciones/Ubicaciones';
import UbicacionesOrden from './Components/Ubicaciones/UbicacionesOrden';
import Ordenes from './Components/Ordenes/Ordenes';
import NuevaOrden from './Components/Ordenes/NuevaOrden';
import OrdenCaja from './Components/Ordenes/OrdenCaja';
import OrdenGlobal from './Components/Ordenes/OrdenGlobal';
import LiquidacionOrden from './Components/Ordenes/LiquidacionOrden';
import Presupuestos from './Components/Presupuestos/Presupuestos';
import LiquidacionPresupuestos from './Components/Presupuestos/LiquidacionPresupuestos';
import Ventas from './Components/Ventas/Ventas';
import StockRespuestos from './Components/Ventas/StockRespuestos';
import AddRespuestos from './Components/Ventas/AddRespuestos';
import AddLoteExcel from './Components/Ventas/AddLoteExcel';
import CargarFactura from './Components/Ventas/CargarFactura';
import Gastos from './Components/Ventas/Gastos';
import RemitoVentas from './Components/Ventas/RemitoVentas';
import Mantenimiento from './Components/Mantenimiento/Mantenimiento';
import CajasBancos from './Components/Mantenimiento/CajasBancos';
import CargarCuenta from './Components/Mantenimiento/CargarCuenta';
import EditCuenta from './Components/Mantenimiento/EditCuenta';
import EditProveedor from './Components/Mantenimiento/EditProveedor';
import Liquidacion from './Components/Mantenimiento/Liquidacion';
import MantEditRemito from './Components/Mantenimiento/MantEditRemito';
import MantFacturas from './Components/Mantenimiento/MantFacturas';
import MantRemito from './Components/Mantenimiento/MantRemito';
import NuevoProveedor from './Components/Mantenimiento/NuevoProveedor';
import Agenda from './Components/Agenda/Agenda';
import Chat from './Components/Chat/Chat';
import Notificaciones from './Components/Notificaciones/Notificaciones';
import Feedback from './Components/Feedback/Feedback';
 
function App() {
  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/menu' element={<Menu />} />
            {/* Ruta Feedback */}
            <Route path='/feedback' element={<Feedback />} />
            {/* Rutas Clientes y Empleados */}
 
            <Route path='/clientes' element={<Clientes />} />
            <Route path='/uploadEmpleado' element={<UploadEmpleado />} />
            <Route path='/uploadEmpleadoExcel' element={<UploadEmpleadoExcel />} />
 
            {/* Rutas Ubicaciones */}
            <Route path='/location' element={<Ubicaciones />} />
            <Route path='/locationOrder' element={<UbicacionesOrden />} />
            {/* Rutas Ordenes */}
            <Route path='/ordenes' element={<Ordenes />} />
            <Route path='/nuevaOrden' element={<NuevaOrden />} />
            <Route path='/ordenCaja' element={<OrdenCaja />} />
            <Route path='/ordenGlobal' element={<OrdenGlobal />} />
            <Route path='/ordenLiquidacion' element={<LiquidacionOrden />} />
            {/* Rutas Presupuesto */}
            <Route path='/presupuestos' element={<Presupuestos />} />
            <Route path='/liquidacionPresupuestos' element={<LiquidacionPresupuestos />} />
            {/* Rutas Ventas */}
            <Route path='/ventas' element={<Ventas />} />
            <Route path='/stockRespuestos' element={<StockRespuestos />} />
            <Route path='/addRespuestos' element={<AddRespuestos />} />
            <Route path='/addLoteExcel' element={<AddLoteExcel />} />
            <Route path='/cargarFactura' element={<CargarFactura />} />
            <Route path='/gastos' element={<Gastos />} />
            <Route path='/VentasRemito' element={<RemitoVentas />} />
            {/* Rutas Mantenimiento */}
            <Route path='/mantRemito' element={<MantRemito />} />
            <Route path='/mantEditRemito' element={<MantEditRemito />} />
            <Route path='/mantFactura' element={<MantFacturas />} />
            <Route path='/mantenimiento' element={<Mantenimiento />} />
            <Route path='/liquidacion' element={<Liquidacion />} />
            <Route path='/cargarCuenta' element={<CargarCuenta />} />
            <Route path='/editarCuenta' element={<EditCuenta />} />
            <Route path='/cajasBancos' element={<CajasBancos />} />
            <Route path='/proveedor' element={<NuevoProveedor />} />
            <Route path='/proveedorEdit' element={<EditProveedor />} />
            {/* Rutas Agenda */}
            <Route path='/agenda' element={<Agenda />} />
            {/* Rutas Chat Redes Sociales */}
            <Route path='/chat' element={<Chat />} />
            {/* Rutas Notificaciones */}
            <Route path='/notificaciones' element={<Notificaciones />} />
          </Routes>
        </Router>
      </div>
      <p className='read-the-docs'>La Beriso App Desktop</p>
    </>
  );
}

export default App;
