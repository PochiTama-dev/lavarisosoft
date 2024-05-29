import "./Menu.css";
import { Link } from "react-router-dom";
import Header from "../Header/Header.jsx";

const Menu = () => {
  return (
    <div className="container-full-width">
      <Header text="Menú Principal" />
      <div className="row menu-button-container">
        <div className="col-md-4">
          <div className="btn-group-vertical ">
            <Link to="/clientes" className="btn btn-lg btn-block menu-button">
              Clientes y empleados
            </Link>
            <Link
              to="/presupuestos"
              className="btn btn-lg btn-block menu-button"
            >
              Presupuestos
            </Link>
            <Link to="/agenda" className="btn btn-lg btn-block menu-button">
              Agenda
            </Link>
            <Link to="/chat" className="btn btn-lg btn-block menu-button">
              Chat
            </Link>
          </div>
        </div>
        <div className="col-md-4">
          <div className="btn-group-vertical ">
            <Link to="/location" className="btn btn-lg btn-block menu-button">
              Ubicaciones tiempo real
            </Link>
            <Link to="/ventas" className="btn btn-lg btn-block menu-button">
              Ventas
            </Link>
            <Link to="/feedback" className="btn btn-lg btn-block menu-button">
              Feedback
            </Link>
          </div>
        </div>
        <div className="col-md-4">
          <div className="btn-group-vertical">
            <Link to="/ordenes" className="btn btn-lg btn-block menu-button">
              Ordenes
            </Link>
            <Link
              to="/mantenimiento"
              className="btn btn-lg btn-block menu-button"
            >
              Mantenimiento
            </Link>
            <Link
              to="/notificaciones"
              className="btn btn-lg btn-block menu-button"
            >
              Notificaciones
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
