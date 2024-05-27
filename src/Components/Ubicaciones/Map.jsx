import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { Icon, divIcon } from "leaflet";
import markerIcon from "../../assets/marker.png";
import "leaflet/dist/leaflet.css";

// Definición de límites de la provincia de Córdoba
/* const CORDOBA_BOUNDS = {
  north: -29.0,
  south: -34.0,
  west: -65.0,
  east: -62.0,
}; */

const myIcon = new Icon({
  iconUrl: markerIcon,
  iconSize: [30, 30],
  iconAnchor: [12, 41],
  popupAnchor: [1, -35],
});

const Map = ({
  position,
  zoom,
  activeTechnicians,
  selectedClient,
  selectedTechnician,
  setSelectedTechnician,
}) => {
  const { latitude, longitude } = position;
  const navigate = useNavigate();

  const handleTechnicianSelect = (tecnico) => {
    if (selectedClient) {
      setSelectedTechnician(tecnico);
      navigate("/locationOrder", {
        state: { selectedTechnician: tecnico, selectedClient: selectedClient },
      });
    }
  };

  return (
    <MapContainer
      className="searchMap"
      center={[latitude, longitude]}
      zoom={zoom}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {/* Marcador Usuario */}
      <Marker position={[latitude, longitude]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      {/* End Marcador Usuario */}
      {/* Marcador Tecnicos Activos */}
      {activeTechnicians.map((technician, index) => (
        <Marker
          key={index}
          position={[
            technician.position.latitude,
            technician.position.longitude,
          ]}
          icon={myIcon}
        >
          <Popup>
            <div className="popup-tecnico">
              <img src={`https://via.placeholder.com/50`} alt="Technician" />
              <div className="popup-content">
                <h4>{technician.nombre}</h4>
                <p>{technician.telefono}</p>
              </div>
            </div>
            <div className="popup-tecnico-button">
              <button onClick={() => handleTechnicianSelect(technician)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="currentColor"
                  className="bi bi-arrow-right"
                  viewBox="0 0 15 15"
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
      ))}
      {/* End Marcador Tecnicos Activos */}
      {/* Marcador Tecnico Seleccionado Mapa */}
      {selectedTechnician &&
        selectedTechnician.position && ( // Mostrar el popup solo si se ha seleccionado un técnico y tiene posición
          <Popup
            position={[
              selectedTechnician.position.latitude,
              selectedTechnician.position.longitude,
            ]}
          >
            <div className="popup-tecnico">
              <img src={`https://via.placeholder.com/50`} alt="Technician" />
              <div className="popup-content">
                <h4>{selectedTechnician.nombre}</h4>
                <p>{selectedTechnician.telefono}</p>
              </div>
            </div>
            <div className="popup-tecnico-button">
              <button
                onClick={() => handleTechnicianSelect(selectedTechnician)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="currentColor"
                  className="bi bi-arrow-right"
                  viewBox="0 0 15 15"
                >
                  <path
                    fillRule="evenodd"
                    d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                  />
                </svg>
              </button>
            </div>
          </Popup>
        )}
      {/* End Marcador Tecnico Seleccionado Mapa */}
    </MapContainer>
  );
};

export default Map;
