import "./Menu.css";
import { Link } from "react-router-dom";

const Menu = () => {
  return (
    <div className="container-full-width">
      <h1 className="text-left mb-4 menu-heading text-uppercase">
        Menú Principal
      </h1>
      <div className="row button-container">
        <div className="col-md-4">
          <div className="btn-group-vertical ">
            <Link
              to="/clientes"
              className="btn btn-lg btn-block mb-5 menu-button"
            >
              Clientes y empleados
            </Link>
            <Link
              to="/presupuestos"
              className="btn btn-lg btn-block mb-5 menu-button"
            >
              Presupuestos
            </Link>
            <Link
              to="/agenda"
              className="btn btn-lg btn-block mb-5 menu-button"
            >
              Agenda
            </Link>
            <Link to="/chat" className="btn btn-lg btn-block mb-5 menu-button">
              Chat
            </Link>
          </div>
        </div>
        <div className="col-md-4">
          <div className="btn-group-vertical ">
            <Link
              to="/location"
              className="btn btn-lg btn-block mb-5 menu-button"
            >
              Ubicaciones tiempo real
            </Link>
            <Link
              to="/ventas"
              className="btn btn-lg btn-block mb-5 menu-button"
            >
              Ventas
            </Link>
            <Link
              to="/feedback"
              className="btn btn-lg btn-block mb-5 menu-button"
            >
              Feedback
            </Link>
          </div>
        </div>
        <div className="col-md-4">
          <div className="btn-group-vertical">
            <Link
              to="/ordenes"
              className="btn btn-lg btn-block mb-5 menu-button"
            >
              Ordenes
            </Link>
            <Link
              to="/mantenimiento"
              className="btn btn-lg btn-block mb-5 menu-button"
            >
              Mantenimiento
            </Link>
            <Link
              to="/notificaciones"
              className="btn btn-lg btn-block mb-5 menu-button"
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
