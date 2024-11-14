import { Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import markerIcon from "../../assets/camioneta.png";
import clientIcon from "../../assets/man.webp";
import "leaflet/dist/leaflet.css";
import PropTypes from "prop-types";
import "./Markers.css";

const clienteIcono = new Icon({
  iconUrl: clientIcon,
  iconSize: [30, 30],
  iconAnchor: [12, 41],
  popupAnchor: [1, -35],
});

const myIcon = new Icon({
  iconUrl: markerIcon,
  iconSize: [30, 30],
  iconAnchor: [12, 41],
  popupAnchor: [1, -35],
  className: "camioneta-tecnico",
});
export const TechnicianMarker = ({ tecnico, onTechnicianSelect }) => (
  <Marker position={[tecnico.latitud, tecnico.longitud]} icon={myIcon}>
    <Popup>
      <div className="popup-tecnico">
        <img src={`https://via.placeholder.com/50`} alt="Technician" />
        <div className="popup-content">
          <h4>{tecnico.nombre}</h4>
          <p>{tecnico.telefono}</p>
        </div>
      </div>
      <div className="popup-tecnico-button">
        <button onClick={onTechnicianSelect}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="currentColor"
            className="bi bi-arrow-right"
          >
            <path
              fillRule="evenodd"
              d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
            />
          </svg>
        </button>
      </div>
    </Popup>
  </Marker>
);

export const ClientMarker = ({
  cliente,
  handleOpenModalWithClientData,
  handleCoordinates,
}) => (
  <Marker
    position={[cliente.latitud, cliente.longitud]}
    icon={clienteIcono}
    eventHandlers={{ click: () => handleCoordinates(cliente) }}
  >
    <Popup>
      <div className="popup-tecnico">
        <img src={`https://via.placeholder.com/50`} alt="Client" />
        <div className="popup-content">
          <h4>{cliente.nombre}</h4>
          <p>{cliente.telefono}</p>
        </div>
      </div>
      <div className="popup-tecnico-button">
        <button onClick={() => handleOpenModalWithClientData(cliente)}>
          Ver detalles
        </button>
      </div>
    </Popup>
  </Marker>
);

// Definir los PropTypes comunes
const locationPropTypes = PropTypes.shape({
  latitud: PropTypes.string.isRequired,
  longitud: PropTypes.string.isRequired,
  nombre: PropTypes.string.isRequired,
  telefono: PropTypes.string.isRequired,
}).isRequired;

TechnicianMarker.propTypes = {
  tecnico: locationPropTypes, // Usando el conjunto común de PropTypes
  onTechnicianSelect: PropTypes.func.isRequired,
};
ClientMarker.propTypes = {
  cliente: locationPropTypes, // Usando el conjunto común de PropTypes
  handleOpenModalWithClientData: PropTypes.func.isRequired,
  handleCoordinates: PropTypes.func.isRequired,
};
