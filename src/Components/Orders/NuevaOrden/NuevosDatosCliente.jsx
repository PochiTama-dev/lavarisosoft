import { Suspense, useEffect, useState, useRef } from "react";
import "./nuevaOrden.css";
import { useCustomContext } from "../../../hooks/context";
import { func, object } from "prop-types";
const NuevosDatosCliente = ({ setCliente, cliente }) => {
 const suggestionsRef = useRef();
 
const [query, setQuery] = useState("");
 const { listaClientes } = useCustomContext();
 const [clientes, setClientes] = useState([]);
 const [selectedClient, setSelectedClient] = useState(cliente ? cliente : null);
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

  // Always update the input value in the state
  setCliente((prevState) => ({ ...prevState, [id]: value }));

  if (id === "ubicacion") {
    setUbicacion(value);
  }
 };

 useEffect(() => {
 
  setCliente((prevState) => ({
    ...prevState,
    direccion: prevState.direccion || ", Argentina",
  }));
 }, []);
const handleSelected = (client) => {
  setSelectedClient(client);
  setCliente(client);
  setClientOrNew(false);
};
 const handleNew = () => {
  setClientOrNew(true);
  setSelectedClient(null);
 };

 const handleSuggestions = async (event) => {
  const { value } = event.target;
    setQuery(event.target.value);
  handleInputChange(event);

  const ARGENTINA_BOUNDS = [-73.415, -55.25, -53.628, -21.832];
  const geoApiKey = "c7778bb5bb994ac88ff65b8732e2cbdf";
  const defaultCenter = [-31.4166867, -64.1834193];
  const query = value;

  if (query) {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&apiKey=${geoApiKey}&bias=proximity:${defaultCenter.join(",")}&bbox=${ARGENTINA_BOUNDS.join(",")}&limit=5`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        setSuggestions(data.features);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching geocode:", error);
    }
  } else {
    setSuggestions([]); // Clear suggestions if input is empty
  }
 };

 const handleSuggestionClick = (coordinates, formattedAddress) => {
  const [lon, lat] = coordinates;

  // Update cliente state with only the selected suggestion
  setCliente((prevCliente) => ({
    ...prevCliente,
    direccion: formattedAddress,
    latitud: lat,
    longitud: lon,
  }));

  setUbicacion(formattedAddress); // Update the displayed location
  setSuggestions([]); // Clear suggestions after selection
 };

 
const [filteredClientes, setFilteredClientes] = useState(clientes);
const [selectOpen, setSelectOpen] = useState(false);
 return (
  <div style={{ marginTop: "6%", marginLeft: "2%" }}>
   <h3 style={{ marginLeft: "5%" }}>{cliente ? "Cliente" : "Clientes"}</h3>
   <div className='row'>
    {selectedClient && (
     <>


<div className='col-sm-3 text-left' style={{ marginBottom: "1%", position: "relative" }}>
  <input
    type='text'
    className='form-control mb-2'
    placeholder='Buscar cliente...'
    value={query}
    onFocus={() => {
      setSelectOpen(true);
      setFilteredClientes(clientes);
    }}
    onChange={(e) => {
      const searchQuery = e.target.value.toLowerCase();
      setQuery(searchQuery);
      const filteredClients = searchQuery
        ? clientes.filter((client) =>
            client.nombre.toLowerCase().includes(searchQuery) ||
            client.numero_cliente.toString().includes(searchQuery)
          )
        : clientes;
      setFilteredClientes(filteredClients);
    }}
    onBlur={() => setTimeout(() => setSelectOpen(false), 200)} // Evita el cierre prematuro
  />
  {selectOpen && (
    <div
      className='form-control'
      style={{
        position: "absolute",
        top: "100%",
        marginLleft: "15px",
        zIndex: 10,
        maxHeight: "290px",
        overflowY: "auto",
        border: "1px solid #ced4da",
        borderRadius: "4px",
        padding: "5px",
        backgroundColor: "#fff",
      }}
    >
      {filteredClientes.length > 0 ? (
        filteredClientes.map((client) => (
      <div
  key={client.id}
 
  style={{
    padding: "5px",
    cursor: "pointer",
 
  }}
  onMouseEnter={(e) => (e.target.style.backgroundColor = "#f8f9fa")}  
  onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}  
  onClick={() => {
    console.log("Cliente seleccionado:", client);
    setSelectedClient(client);  
    setCliente(client);  
    setSelectOpen(false);
    setQuery(client.nombre);  
  }}
>
            {client.nombre} #{client.numero_cliente}
          </div>
        ))
      ) : (
        <div style={{ padding: "5px", color: "#6c757d" }}>No se encontraron resultados</div>
      )}
    </div>
  )}
</div>



      <div className='col-sm-3 text-left' style={{ width: "2vw", paddingLeft: "5%" }}>
 
      </div>
      <div className='col-sm-3 text-left pointer' style={{ paddingLeft: "5%" }}>
   
      </div>
     </>
    )}
    {selectedClient !== null && !clientOrNew && (
     <>
      <div className='col-md-6'>
       <div className='mb-3 row align-items-center'>
        <label htmlFor='numero_cliente' className='col-sm-2 text-left'>
         N° Cliente:
        </label>
        <div className='col-sm-8'>
         <input type='text' id='numero_cliente' className='form-control input-small' value={cliente.numero_cliente || ""} required disabled />
        </div>
       </div>
       <div className='mb-3 row align-items-center'>
        <label htmlFor='nombre' className='col-sm-2 text-left'>
         Nombre:
        </label>
        <div className='col-sm-8'>
         <input type='text' id='nombre' className='form-control input-small' value={cliente.nombre || ""} onChange={handleInputChange} required />
        </div>
       </div>
       <div className='mb-3 row align-items-center'>
        <label htmlFor='apellido' className='col-sm-2 text-left'>
         Apellido:
        </label>
        <div className='col-sm-8'>
         <input type='text' id='apellido' className='form-control input-small' value={cliente.apellido || ""} onChange={handleInputChange} required />
        </div>
       </div>
       <div className='mb-3 row align-items-center'>
        <label htmlFor='cuil' className='col-sm-2 text-left'>
         CUIL:
        </label>
        <div className='col-sm-8'>
         <input type='text' id='cuil' className='form-control input-small' value={cliente.cuil || ""} onChange={handleInputChange} required />
        </div>
       </div>
      </div>

      <div className='col-md-6'>
       <div className='mb-3 row align-items-center'>
        <label htmlFor='telefono' className='col-sm-3 text-left'>
         Teléfono:
        </label>
        <div className='col-sm-8'>
         <input type='text' id='telefono' className='form-control input-small' value={cliente.telefono || ""} onChange={handleInputChange} required />
        </div>
       </div>
       <div className='mb-3 row align-items-center'>
        <label htmlFor='direccion' className='col-sm-3 text-left'>
         Dirección:
        </label>
        <div className='col-sm-8 position-relative'>
         <input
          type='text'
          id='direccion'
          className='form-control input-small'
          value={cliente.direccion || ", Argentina"}
          onChange={handleSuggestions}
          required
         />
         {/* Render suggestions below the input */}
         {suggestions.length > 0 && (
          <div ref={suggestionsRef} className='suggestions-box-modal position-absolute w-100' style={{ top: '100%', zIndex: 10 }}>
           <Suspense fallback={<>Cargando...</>}>
            <div className='suggestions-list'>
             {suggestions.map((suggestion, index) => {
              const coordinates = suggestion.geometry.coordinates;
              const formattedAddress = suggestion.properties.formatted;

              return (
               <div
                key={index}
                className='suggestion-item pointer'
                onClick={() => handleSuggestionClick(coordinates, formattedAddress)}
               >
                {formattedAddress}
               </div>
              );
             })}
            </div>
           </Suspense>
          </div>
         )}
        </div>
       </div>
       <div className='mb-3 row align-items-center'>
        <label htmlFor='piso' className='col-sm-3 text-left'>
         Piso:
        </label>
        <div className='col-sm-8'>
         <input type='number' id='piso' className='form-control input-small' value={cliente.piso || ""} onChange={handleInputChange} required />
        </div>
       </div>
       <div className='mb-3 row align-items-center'>
        <label htmlFor='departamento' className='col-sm-3 text-left'>
         Departamento:
        </label>
        <div className='col-sm-8'>
         <input type='text' id='departamento' className='form-control input-small' value={cliente.departamento || ""} onChange={handleInputChange} required />
        </div>
       </div>
       <div className='mb-3 row align-items-center'>
        <label htmlFor='ubicacion' className='col-sm-3 text-left'>
         Localidad:
        </label>
        <div className='col-sm-8'>
         <input type='text' id='ubicacion' className='form-control input-small' value={ubicacion} onChange={handleSuggestions} required />
        </div>
       </div>
      </div>
     </>
    )}
   </div>
   {clientOrNew && (
    <div className='row'>
     <div className='col-md-6'>
      <h3 className='m-4'>Nuevo cliente</h3>
      <div className='mb-3 row align-items-center'>
       <label htmlFor='numero_cliente' className='col-sm-2 text-left'>
        N° Cliente:
       </label>
       <div className='col-sm-8'>
        <input type='text' id='numero_cliente' className='form-control input-small' value={cliente.numero_cliente || ""} onChange={handleInputChange} required disabled />
       </div>
      </div>
      <div className='mb-3 row align-items-center'>
       <label htmlFor='nombre' className='col-sm-2 text-left'>
        Nombre:
       </label>
       <div className='col-sm-8'>
        <input type='text' id='nombre' className='form-control input-small' value={cliente.nombre || ""} onChange={handleInputChange} required />
       </div>
      </div>
      <div className='mb-3 row align-items-center'>
       <label htmlFor='apellido' className='col-sm-2 text-left'>
        Apellido:
       </label>
       <div className='col-sm-8'>
        <input type='text' id='apellido' className='form-control input-small' value={cliente.apellido || ""} onChange={handleInputChange} required />
       </div>
      </div>
      <div className='mb-3 row align-items-center'>
       <label htmlFor='cuil' className='col-sm-2 text-left'>
        CUIL:
       </label>
       <div className='col-sm-8'>
        <input type='text' id='cuil' className='form-control input-small' value={cliente.cuil || ""} onChange={handleInputChange} required />
       </div>
      </div>
     </div>
     <div className='col-md-6'>
      <div className='mb-3 row align-items-center'>
       <label htmlFor='telefono' className='col-sm-3 text-left'>
        Teléfono:
       </label>
       <div className='col-sm-8'>
        <input type='text' id='telefono' className='form-control input-small' value={cliente.telefono || ""} onChange={handleInputChange} required />
       </div>
      </div>
      <div className='mb-3 row align-items-center'>
       <label htmlFor='direccion' className='col-sm-3 text-left'>
        Dirección:
       </label>
       <div className='col-sm-8'>
        <input type='text' id='direccion' className='form-control input-small' value={cliente.direccion || ""} onChange={handleInputChange} required />
       </div>
      </div>
      <div className='mb-3 row align-items-center'>
       <label htmlFor='piso' className='col-sm-3 text-left'>
        Piso:
       </label>
       <div className='col-sm-8'>
        <input type='number' id='piso' className='form-control input-small' value={cliente.piso || ""} onChange={handleInputChange} required />
       </div>
      </div>
      <div className='mb-3 row align-items-center'>
       <label htmlFor='departamento' className='col-sm-3 text-left'>
        Departamento:
       </label>
       <div className='col-sm-8'>
        <input type='text' id='departamento' className='form-control input-small' value={cliente.departamento || ""} onChange={handleInputChange} required />
       </div>
      </div>
      <div className='mb-3 row align-items-center'>
       <label htmlFor='ubicacion' className='col-sm-3 text-left'>
        Localidad:
       </label>
       <div className='col-sm-8'>
        <input type='text' id='ubicacion' className='form-control input-small' value={ubicacion} onChange={handleSuggestions} required />
       </div>
 <Suspense fallback={<>Cargando...</>}>
  {suggestions.length > 0 ? (
    suggestions.map((suggestion) => {
      const coordinates = suggestion.geometry.coordinates;
      const id = suggestion.properties.place_id || suggestion.properties.formatted;

      return (
        <div
          key={id}
          className='suggestion-item pointer'
          onClick={() => handleSuggestionClick(coordinates, suggestion)}
          role="option"
          tabIndex={0}
        >
          {suggestion.properties.formatted}
        </div>
      );
    })
  ) : (
    query.length > 2 && <div className="no-results">Sin resultados</div>
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
