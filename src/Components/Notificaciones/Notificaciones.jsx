
import NotificacionesDetalle from "./NotificacionesDetalle";
import Alertas from "./Alertas";
import Header from "../Header/Header";

const Notificaciones = () => {
    return (
      <div className="vw-100 p-3 ">
        <Header text="Notificaciones" />
        <div className="row p-5 mt-5">
          <div className="col-6">
            <NotificacionesDetalle />
          </div>
          <div className="col-6">
            <Alertas />
          </div>
        </div>
      </div>
    );
  }
  
  export default Notificaciones;