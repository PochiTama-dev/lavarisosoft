import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './pages/Login/Login';
import Menu from './Components/Menu/Menu';
import Clientes from './Components/Clientes/ClientesEmpleados';
import UploadEmpleado from './Components/Clientes/UploadEmpleado';
import UploadEmpleadoExcel from './Components/Clientes/UploadEmpleadoExcel';
import Ubicaciones from './Components/Ubicaciones/Ubicaciones';
import UbicacionesOrden from './Components/Ubicaciones/UbicacionesOrden';
import Orders from './pages/Orders/Orders';
import NuevaOrden from './pages/Orders/NuevaOrden';
import Cobrar from './pages/Orders/Cobrar';
import AumentosGlobal from './pages/Orders/AumentosGlobal';
import Presupuestos from './Components/Presupuestos/Presupuestos';
import LiquidacionPresupuestos from './Components/Presupuestos/LiquidacionPresupuestos';
/* Ventas */
import Ventas from './pages/Ventas/Ventas.jsx';
import EditarStockRespuestos from './Components/Ventas/EditarStockRepuestos/EditarStockRepuestos.jsx';
import EditarProducto from './Components/Ventas/EditarStockRepuestos/EditarProducto.jsx';
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
import NuevaCaja from './Components/Mantenimiento/NuevaCaja';
import NuevoProveedor from './Components/Mantenimiento/NuevoProveedor';
import Agenda from './pages/Agenda/Agenda.jsx';
import Chat from './Components/Chat/Chat';
import Notificaciones from './Components/Notificaciones/Notificaciones';
import Feedback from './Components/Feedback/Feedback';
import PrivateRoute from './Components/ProtectedRoute/ProtectedRoute.jsx';
import RemitoOrden from './Components/Orders/OrdenDetalle/RemitoOrden.jsx';
import AddFactura from './Components/Ventas/FileUploader/AddFactura.jsx';
function App() {

  
  return (
    <Routes>
      
      <Route path='/' element={<Login />} />
      <Route path='/login' element={<Login />} />
      <Route path='/menu' element={<Menu />} />
      <Route element={<PrivateRoute roles={['Atención al cliente', 'Super administrador']} />}>
        {/* Rutas Chat Redes Sociales */}
        <Route path='/chat' element={<Chat />} />
        {/* Rutas Clientes y Empleados */}
        <Route path='/clientes' element={<Clientes />} />
        <Route path='/uploadEmpleado' element={<UploadEmpleado />} />
        <Route path='/uploadEmpleadoExcel' element={<UploadEmpleadoExcel />} />
        {/* Ruta Feedback */}
        <Route path='/feedback' element={<Feedback />} />
      </Route>

      <Route element={<PrivateRoute roles={['Contable administrativo', 'Super administrador']} />}>
        {/* Rutas Ordenes */}
        <Route path='/ordenes' element={<Orders />} />
        <Route path='/ordenes/nuevaOrden' element={<NuevaOrden />} />
        <Route path='/ordenes/cobrarCaja' element={<Cobrar />} />
        <Route path='/ordenes/ordenGlobal' element={<AumentosGlobal />} />
        <Route path='/ventas' element={<Ventas />} />
        <Route path='/ventas/cargarFactura' element={<CargarFactura />} />
        <Route path='/gastos' element={<Gastos />} />
        <Route path='/VentasRemito' element={<RemitoVentas />} />
        <Route path='/mantRemito' element={<MantRemito />} />
        <Route path='/mantEditRemito' element={<MantEditRemito />} />
        <Route path='/remitoOrden' element={<RemitoOrden />} />
        <Route path='/mantFactura' element={<MantFacturas />} />
        <Route path='/liquidacion' element={<Liquidacion />} />
        <Route path='/cargarCuenta' element={<CargarCuenta />} />
        <Route path='/editarCuenta' element={<EditCuenta />} />
        <Route path='/caja' element={<NuevaCaja />} />
        <Route path='/cajasBancos' element={<CajasBancos />} />
        <Route path='/proveedor' element={<NuevoProveedor />} />
        <Route path='/proveedorEdit' element={<EditProveedor />} />
        <Route path='/mantenimiento' element={<Mantenimiento />} />
        <Route path='/presupuestos' element={<Presupuestos />} />
      <Route path='/addFactura' element={<AddFactura />} />
      </Route>
      <Route element={<PrivateRoute roles={['Jefe de taller', 'Super administrador']} />}>
        <Route path='/liquidacionPresupuestos' element={<LiquidacionPresupuestos />} />
        <Route path='/editarStockRepuestos' element={<EditarStockRespuestos />} />
        <Route path='/editarStockRepuestos/editarProducto/:id' element={<EditarProducto />} />
        <Route path='/addRespuestos' element={<AddRespuestos />} />
        <Route path='/addLoteExcel' element={<AddLoteExcel />} />
        {/* Rutas Agenda */}
        <Route path='/agenda' element={<Agenda />} />
        {/* Rutas Ubicaciones */}
        <Route path='/location' element={<Ubicaciones />} />
        <Route path='/locationOrder' element={<UbicacionesOrden />} />
      </Route>

      {/* Rutas Notificaciones */}
      <Route path='/notificaciones' element={<Notificaciones />} />
    </Routes>
  );
}

export default App;
