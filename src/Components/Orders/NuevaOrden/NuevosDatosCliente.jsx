import { Suspense, useEffect, useState } from "react";
import "./nuevaOrden.css";
import { useCustomContext } from "../../../hooks/context";
import { func, object } from "prop-types";
const NuevosDatosCliente = ({ setCliente, cliente }) => {
  const { listaClientes } = useCustomContext();
  const [clientes, setClientes] = useState([]);
  const [selectedClient, setSelectedClient] = useState(
    cliente ? cliente : null
  );
  const [clientOrNew, setClientOrNew] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [ubicacion, setUbicacion] = useState(",Cordoba,Argentina");
  useEffect(() => {
    getClientes();
  }, []);

  const getClientes = async () => {
    const allClients = await listaClientes();
    setClientes(allClients);
  };
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    console.log(id);
    console.log(value);

    setCliente((prevState) => ({ ...prevState, [id]: value }));
    setUbicacion(() => value);
    console.log(ubicacion);
  };

  const handleSelected = (client) => {
    setSelectedClient(client);
    setCliente(client);
    setClientOrNew(false);
    setCliente(client)
  };
  const handleNew = () => {
    setClientOrNew(true);
    setSelectedClient(null);
  };

  const handleSuggestions = async (event) => {
    handleInputChange(event);
    const ARGENTINA_BOUNDS = [-73.415, -55.25, -53.628, -21.832];
    const geoApiKey = "c7778bb5bb994ac88ff65b8732e2cbdf";
    const defaultCenter = [-31.4166867, -64.1834193];
    const query = event.target.value;
    if (query) {
      try {
        setTimeout(async () => {
          //const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&apiKey=${geoApiKey}&limit=10`);
          const response = await fetch(
            `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
              query
            )}&apiKey=${geoApiKey}&bias=proximity:${defaultCenter.join(
              ","
            )}&bbox=${ARGENTINA_BOUNDS.join(",")}&limit=5`
          );
          const data = await response.json();
          if (data.features && data.features.length > 0) {
            setSuggestions(data.features);
          } else {
            setSuggestions([]);
          }
        }, "1000");
      } catch (error) {
        console.error("Error fetching geocode:", error);
      }
    } else {
      setSuggestions([]);
    }
  };
  const handleSuggestionClick = (coordinates, sugestion) => {
    console.log(sugestion);
    const [lon, lat] = coordinates;
    cliente.latitud = lat;
    cliente.longitud = lon;
    setUbicacion(
      `${sugestion.properties.address_line1},${sugestion.properties.city},Argentina`
    );
    setSuggestions([]);
  };
  return (
    <div style={{ marginTop: "6%", marginLeft: "2%" }}>
      <h3 style={{ marginLeft: "5%" }}>{cliente ? "Cliente" : "Clientes"}</h3>
      <div className="row">
        {selectedClient && (
          <>
            <select
              className="col-sm-3 text-left"
              style={{ marginBottom: "1%" }}
            >
              <option value="" selected disabled>
                Seleccione un cliente
              </option>
              {clientes &&
                clientes.map((client) => (
                  <option
                    value={client.id}
                    key={client.id}
                    onClick={() => handleSelected(client)}
                  >
                    {client.nombre} #{client.numero_cliente}
                  </option>
                ))}
            </select>
            <div
              className="col-sm-3 text-left"
              style={{ width: "2vw", paddingLeft: "5%" }}
            >
              <h4>o</h4>
            </div>
            <div
              className="col-sm-3 text-left pointer"
              style={{ paddingLeft: "5%" }}
            >
              <h4 onClick={handleNew}>Cargar nuevo cliente</h4>
            </div>
          </>
        )}
        {selectedClient !== null && !clientOrNew && (
          <>
            <div className="col-md-6">
              <div className="mb-3 row align-items-center">
                <label htmlFor="numero_cliente" className="col-sm-2 text-left">
                  N° Cliente:
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    id="numero_cliente"
                    className="form-control input-small"
                    value={selectedClient.numero_cliente || ""}
                    required
                    disabled
                  />
                </div>
              </div>
              <div className="mb-3 row align-items-center">
                <label htmlFor="nombre" className="col-sm-2 text-left">
                  Nombre:
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    id="nombre"
                    className="form-control input-small"
                    value={selectedClient.nombre || ""}
                    required
                  />
                </div>
              </div>
              <div className="mb-3 row align-items-center">
                <label htmlFor="apellido" className="col-sm-2 text-left">
                  Apellido:
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    id="apellido"
                    className="form-control input-small"
                    value={selectedClient.apellido || ""}
                    required
                  />
                </div>
              </div>
              <div className="mb-3 row align-items-center">
                <label htmlFor="cuil" className="col-sm-2 text-left">
                  CUIL:
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    id="cuil"
                    className="form-control input-small"
                    value={selectedClient.cuil || ""}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3 row align-items-center">
                <label htmlFor="telefono" className="col-sm-3 text-left">
                  Teléfono:
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    id="telefono"
                    className="form-control input-small"
                    value={selectedClient.telefono || ""}
                    required
                  />
                </div>
              </div>
              <div className="mb-3 row align-items-center">
                <label htmlFor="direccion" className="col-sm-3 text-left">
                  Dirección:
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    id="direccion"
                    className="form-control input-small"
                    value={selectedClient.direccion || ""}
                    required
                  />
                </div>
              </div>
              <div className="mb-3 row align-items-center">
                <label htmlFor="piso" className="col-sm-3 text-left">
                  Piso:
                </label>
                <div className="col-sm-8">
                  <input
                    type="number"
                    id="piso"
                    className="form-control input-small"
                    value={selectedClient?.piso || ""}
                    required
                  />
                </div>
              </div>
              <div className="mb-3 row align-items-center">
                <label htmlFor="departamento" className="col-sm-3 text-left">
                  Departamento:
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    id="departamento"
                    className="form-control input-small"
                    value={selectedClient?.departamento || ""}
                    required
                  />
                </div>
              </div>
              <div className="mb-3 row align-items-center">
                <label htmlFor="ubicacion" className="col-sm-3 text-left">
                  Localidad:
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    id="ubicacion"
                    className="form-control input-small"
                    value={selectedClient.ubicacion || ""}
                    required
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {clientOrNew && (
        <div className="row">
          <div className="col-md-6">
            <h3 className="m-4">Nuevo cliente</h3>
            <div className="mb-3 row align-items-center">
              <label htmlFor="numero_cliente" className="col-sm-2 text-left">
                N° Cliente:
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  id="numero_cliente"
                  className="form-control input-small"
                  value={cliente.numero_cliente || ""}
                  onChange={handleInputChange}
                  required
                  disabled
                />
              </div>
            </div>
            <div className="mb-3 row align-items-center">
              <label htmlFor="nombre" className="col-sm-2 text-left">
                Nombre:
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  id="nombre"
                  className="form-control input-small"
                  value={cliente.nombre || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="mb-3 row align-items-center">
              <label htmlFor="apellido" className="col-sm-2 text-left">
                Apellido:
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  id="apellido"
                  className="form-control input-small"
                  value={cliente.apellido || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="mb-3 row align-items-center">
              <label htmlFor="cuil" className="col-sm-2 text-left">
                CUIL:
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  id="cuil"
                  className="form-control input-small"
                  value={cliente.cuil || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3 row align-items-center">
              <label htmlFor="telefono" className="col-sm-3 text-left">
                Teléfono:
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  id="telefono"
                  className="form-control input-small"
                  value={cliente.telefono || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="mb-3 row align-items-center">
              <label htmlFor="direccion" className="col-sm-3 text-left">
                Dirección:
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  id="direccion"
                  className="form-control input-small"
                  value={cliente.direccion || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="mb-3 row align-items-center">
              <label htmlFor="piso" className="col-sm-3 text-left">
                Piso:
              </label>
              <div className="col-sm-8">
                <input
                  type="number"
                  id="piso"
                  className="form-control input-small"
                  value={cliente.piso || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="mb-3 row align-items-center">
              <label htmlFor="departamento" className="col-sm-3 text-left">
                Departamento:
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  id="departamento"
                  className="form-control input-small"
                  value={cliente.departamento || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="mb-3 row align-items-center">
              <label htmlFor="ubicacion" className="col-sm-3 text-left">
                Localidad:
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  id="ubicacion"
                  className="form-control input-small"
                  value={ubicacion}
                  onChange={handleSuggestions}
                  required
                />
              </div>
              <Suspense fallback={<>Cargando...</>}>
                {suggestions.length > 0 && (
                  <>
                    {suggestions.map((suggestion, index) => {
                      const coordinates = suggestion.geometry.coordinates;

                      return (
                        <div
                          key={index}
                          className="suggestion-item pointer"
                          onClick={() =>
                            handleSuggestionClick(coordinates, suggestion)
                          }
                        >
                          {suggestion.properties.formatted}
                        </div>
                      );
                    })}
                  </>
                )}
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

NuevosDatosCliente.propTypes = {
  setCliente: func,
  cliente: object,
};

export default NuevosDatosCliente;
