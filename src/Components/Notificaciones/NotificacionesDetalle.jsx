import { useState, useEffect } from "react";
import "./Notificaciones.css";
import notificacionesData from "./notificaciones.json";

const NotificacionesDetalle = () => {
    const [notificaciones, setNotificaciones] = useState([]);

    useEffect(() => {
        setNotificaciones(notificacionesData);
    }, []);

    return (
        <div className="container p-5 notificaciones-container">
            <h2>Notificaciones</h2>
            {notificaciones.map((notificaciones, index) => (
                <div key={index}>
                    <div className="row my-3">
                        <div className="col-1 d-flex justify-content-center">
                            <div className="notification-badge"></div>
                        </div>
                        <div className="col-10 p-0">
                            <div className="item-notification" href="#">
                                <b>{notificaciones.nombre}</b> {notificaciones.descripcion}
                            </div>
                        </div>
                    </div>
                    <hr />
                </div>
            ))}
        </div>
    )
}

export default NotificacionesDetalle;
