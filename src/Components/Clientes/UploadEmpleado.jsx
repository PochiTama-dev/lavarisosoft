import { useState, useEffect, useRef, Suspense } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';

const UploadEmpleado = () => {
  const [empleado, setEmpleado] = useState({
    id_rol: '',
    nombre: '',
    apellido: '',
    cuil: '',
    cuenta: null,
    legajo: null,
    telefono: '',
    email: '',
    direccion: '',
    ubicacion: '',
    longitud: 0,
    latitud: 0,
    estado: null,
    marca: '',
    modelo: '',
    color: '',
    patente: '',
  });
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [camposVacios, setCamposVacios] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmpleado((prevEmpleado) => ({
      ...prevEmpleado,
      [name]: value,
    }));
  };
  const [suggestions, setSuggestions] = useState([]);

  const suggestionsRef = useRef();

  const handleSuggestions = async (event) => {
    handleChange(event);
    const ARGENTINA_BOUNDS = [-73.415, -55.25, -53.628, -21.832];
    const geoApiKey = 'c7778bb5bb994ac88ff65b8732e2cbdf';
    const defaultCenter = [-31.4166867, -64.1834193];
    const query = event.target.value;
    if (query) {
      try {
        setTimeout(async () => {
          //const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&apiKey=${geoApiKey}&limit=10`);
          const response = await fetch(
            `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&apiKey=${geoApiKey}&bias=proximity:${defaultCenter.join(',')}&bbox=${ARGENTINA_BOUNDS.join(',')}&limit=5`
          );
          const data = await response.json();
          if (data.features && data.features.length > 0) {
            setSuggestions(data.features);
          } else {
            setSuggestions([]);
          }
        }, '3000');
      } catch (error) {
        console.error('Error fetching geocode:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (coordinates) => {
    const [lon, lat] = coordinates;
    empleado.latitud = lat;
    empleado.longitud = lon;
    setSuggestions([]);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateEmpleado(empleado);
  };

  const handleCreateEmpleado = async (empleado) => {
    try {
      const { id_rol, nombre, apellido, cuil, legajo, telefono, email, direccion, ubicacion, longitud, latitud, estado, marca, modelo, color, patente } = await empleado;
      await postEmpleado({ id_rol, nombre, apellido, cuil, legajo, telefono, email, direccion, ubicacion, longitud, latitud, estado });
      if (marca && modelo && patente && color) {
        const idEmpleado = await getEmpleado(email);
        await postVehiculo({ id_empleado: idEmpleado, marca, modelo, patente, color });
        alert('Empleado y vehículo agregado con exito');
      } else alert('Empleado agregado con exito');
      navigate('/clientes');
    } catch (error) {
      console.error(error);
    }
  };

  const getRoles = async () => {
    try {
      const roles = await fetch('https://lv-back.online/opciones/roles');
      const result = await roles.json();
      if (result) setRoles(result);
    } catch (error) {
      console.error(error);
    }
  };

  const postEmpleado = async (empleadoForm) => {
    let { id_rol, nombre, apellido, cuil, legajo, telefono, email, direccion, ubicacion, longitud, latitud } = await empleadoForm;
    switch (id_rol) {
      case '1':
        legajo = 'ATC-' + legajo;
        break;
      case '2':
        legajo = 'CAD-' + legajo;
        break;

      case '3':
        legajo = 'JFT-' + legajo;
        break;

      case '4':
        legajo = 'SPA-' + legajo;
        break;

      default:
        legajo = 'TEC-' + legajo;
        break;
    }
    const fetchEmpleado = await fetch('https://lv-back.online/empleados/guardar', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_rol, nombre, apellido, cuil, legajo, telefono, email, direccion, ubicacion, longitud, latitud, estado: 0 }),
    });
    console.log('status empleado: ', fetchEmpleado.status);
  };
  const getEmpleado = async (empleadoMail) => {
    try {
      const empleados = await fetch('https://lv-back.online/empleados/listado');
      const result = await empleados.json();
      const buscarEmpleado = await result.find((empleado) => empleado.email === empleadoMail);
      return buscarEmpleado.id;
    } catch (error) {
      console.error(error);
    }
  };

  const postVehiculo = async ({ id_empleado, marca, modelo, patente, color }) => {
    try {
      const fetchVehiculo = await fetch('https://lv-back.online/vehiculos/guardar', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_empleado, marca, modelo, patente, color }),
      });
      console.log('status vehiculo: ', fetchVehiculo.status);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getRoles();
    /* const campos = Object.entries(empleado).filter(([key, value]) => value.trim() === '');
    setCamposVacios(campos.map(([key]) => key)); */
  }, [empleado]);

  return (
    <div className='vw-100 mx-5 mt-5'>
      <Header className='vw-100' text='Gestion Global'></Header>
      <Form className='p-3' onSubmit={handleSubmit}>
        <Row>
          <Col>
            <h2 className='mb-4 p-3 text-left'>Cargar Empleado</h2>
            <Form.Group controlId='formRol' className='label-input-margin'>
              <Form.Label className={camposVacios.includes('rol') ? 'required-field' : ''} style={{ textAlign: 'left', display: 'block' }}>
                Rol
              </Form.Label>
              <Form.Control as='select' name='id_rol' value={empleado.rol} onChange={handleChange} placeholder='Seleccione el rol' style={{ textAlign: 'left', borderRadius: '5px', width: '350px' }}>
                <option value=''>Seleccionar</option>
                {roles &&
                  roles.map((rol) => (
                    <option value={rol.id} key={rol.id}>
                      {rol.tipo_rol}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId='formNombre' className='label-input-margin'>
              <Form.Label className={camposVacios.includes('nombre') ? 'required-field' : ''} style={{ textAlign: 'left', display: 'block' }}>
                Nombre
              </Form.Label>
              <Form.Control
                type='text'
                name='nombre'
                value={empleado.nombre}
                onChange={handleChange}
                placeholder='Ingrese su nombre'
                style={{ textAlign: 'left', borderRadius: '5px', width: '350px' }}
              />
            </Form.Group>
            <Form.Group controlId='formApellido' className='label-input-margin'>
              <Form.Label className={camposVacios.includes('nombre') ? 'required-field' : ''} style={{ textAlign: 'left', display: 'block' }}>
                Apellido
              </Form.Label>
              <Form.Control
                type='text'
                name='apellido'
                value={empleado.apellido}
                onChange={handleChange}
                placeholder='Ingrese su apellido'
                style={{ textAlign: 'left', borderRadius: '5px', width: '350px' }}
              />
            </Form.Group>
            <Form.Group controlId='formLegajo' className='label-input-margin'>
              <Form.Label className={camposVacios.includes('legajo') ? 'required-field' : ''} style={{ textAlign: 'left', display: 'block' }}>
                Legajo
              </Form.Label>
              <Form.Control
                type='text'
                name='legajo'
                value={empleado.legajo}
                onChange={handleChange}
                placeholder='Ingrese su legajo'
                style={{ textAlign: 'left', borderRadius: '5px', width: '350px' }}
              />
            </Form.Group>
            <Form.Group controlId='formTelefono' className='label-input-margin'>
              <Form.Label className={camposVacios.includes('telefono') ? 'required-field' : ''} style={{ textAlign: 'left', display: 'block' }}>
                Teléfono
              </Form.Label>
              <Form.Control
                type='text'
                name='telefono'
                value={empleado.telefono}
                onChange={handleChange}
                placeholder='Ingrese su teléfono'
                style={{ textAlign: 'left', borderRadius: '5px', width: '350px' }}
              />
            </Form.Group>
            <Form.Group controlId='formEmail' className='label-input-margin'>
              <Form.Label className={camposVacios.includes('email') ? 'required-field' : ''} style={{ textAlign: 'left', display: 'block' }}>
                Email
              </Form.Label>
              <Form.Control
                type='email'
                name='email'
                value={empleado.email}
                onChange={handleChange}
                placeholder='Ingrese su email'
                style={{ textAlign: 'left', borderRadius: '5px', width: '350px' }}
              />
            </Form.Group>
            <Form.Group controlId='formCuil' className='label-input-margin'>
              <Form.Label className={camposVacios.includes('cuil') ? 'required-field' : ''} style={{ textAlign: 'left', display: 'block' }}>
                CUIL
              </Form.Label>
              <Form.Control type='text' name='cuil' value={empleado.cuil} onChange={handleChange} placeholder='Ingrese su CUIL' style={{ textAlign: 'left', borderRadius: '5px', width: '350px' }} />
            </Form.Group>
            <Form.Group controlId='formDireccion' className='label-input-margin'>
              <Form.Label className={camposVacios.includes('direccion') ? 'required-field' : ''} style={{ textAlign: 'left', display: 'block' }}>
                Direccion
              </Form.Label>
              <Form.Control
                type='text'
                name='direccion'
                value={empleado.direccion}
                onChange={handleSuggestions}
                placeholder='Ingrese su Direccion'
                style={{ textAlign: 'left', borderRadius: '5px', width: '350px' }}
              />
              {/* <li className='d-flex justify-content-between py-2 grey-text'>
                <input type='text' name='direccion' className='rounded text-center grey-text' value={empleado.direccion} onChange={handleSuggestions} />
              </li> */}
              <div ref={suggestionsRef} className='suggestions-box'>
                <Suspense fallback={<>Cargando...</>}>
                  {suggestions.length > 0 && (
                    <>
                      {suggestions.map((suggestion, index) => {
                        const coordinates = suggestion.geometry.coordinates;

                        return (
                          <div key={index} className='suggestion-item pointer' onClick={() => handleSuggestionClick(coordinates)}>
                            {suggestion.properties.formatted}
                          </div>
                        );
                      })}
                    </>
                  )}
                </Suspense>
              </div>
            </Form.Group>
            <Form.Group controlId='formUbicacion' className='label-input-margin'>
              <Form.Label className={camposVacios.includes('ubicacion') ? 'required-field' : ''} style={{ textAlign: 'left', display: 'block' }}>
                Ubicacion
              </Form.Label>
              <Form.Control
                type='text'
                name='ubicacion'
                value={empleado.ubicacion}
                onChange={handleChange}
                placeholder='Ingrese su ubicacion'
                style={{ textAlign: 'left', borderRadius: '5px', width: '350px' }}
              />
            </Form.Group>
            {/* <Form.Group controlId='formLatitud' className='label-input-margin'>
              <Form.Label className={camposVacios.includes('latitud') ? 'required-field' : ''} style={{ textAlign: 'left', display: 'block' }}>
                Latitud
              </Form.Label>
              <Form.Control
                type='text'
                name='latitud'
                value={empleado.latitud}
                onChange={handleChange}
                placeholder='Ingrese su latitud WTF!?'
                style={{ textAlign: 'left', borderRadius: '5px', width: '350px' }}
              />
            </Form.Group> */}
            {/* <Form.Group controlId='formLongitud' className='label-input-margin'>
              <Form.Label className={camposVacios.includes('longitud') ? 'required-field' : ''} style={{ textAlign: 'left', display: 'block' }}>
                Longitud
              </Form.Label>
              <Form.Control
                type='text'
                name='longitud'
                value={empleado.longitud}
                onChange={handleChange}
                placeholder='Ingrese su longitud AHRE!'
                style={{ textAlign: 'left', borderRadius: '5px', width: '350px' }}
              />
            </Form.Group> */}
            {/* <Form.Group controlId='formEstado' className='label-input-margin'>
              <Form.Label className={camposVacios.includes('estado') ? 'required-field' : ''} style={{ textAlign: 'left', display: 'block' }}>
                Estado
              </Form.Label>
              <Form.Control
                type='number'
                name='estado'
                value={empleado.estado}
                onChange={handleChange}
                placeholder='Ingrese su Estado'
                style={{ textAlign: 'left', borderRadius: '5px', width: '350px' }}
              />
            </Form.Group> */}
          </Col>
          <Col className='uploadEmpleado-c2' style={{ textAlign: 'left' }}>
            <Form.Group controlId='formAutomovil' className='label-input-margin'>
              <Form.Label className={camposVacios.includes('marca') ? 'required-field' : ''} style={{ textAlign: 'left', display: 'block' }}>
                Automovil
              </Form.Label>
              <Form.Control
                type='text'
                name='marca'
                value={empleado.marca}
                onChange={handleChange}
                placeholder='Ingrese Automovil'
                style={{ textAlign: 'left', borderRadius: '5px', width: '350px' }}
              />
              {empleado.marca.length > 10 && <span style={{ color: 'red' }}>El nombre no puede tener mas de 10 carácteres</span>}
            </Form.Group>
            <Form.Group controlId='formNuevoInput1' className='label-input-margin'>
              <Form.Label className={camposVacios.includes('modelo') ? 'required-field' : ''} style={{ textAlign: 'left', display: 'block' }}>
                Modelo
              </Form.Label>
              <Form.Control
                type='text'
                name='modelo'
                value={empleado.modelo}
                onChange={handleChange}
                placeholder='Ingrese modelo de vehiculo'
                style={{ textAlign: 'left', borderRadius: '5px', width: '350px' }}
              />
              {empleado.modelo.length > 10 && <span style={{ color: 'red' }}>El modelo no puede tener mas de 10 carácteres</span>}
            </Form.Group>
            <Form.Group controlId='formNuevoInput2' className='label-input-margin'>
              <Form.Label className={camposVacios.includes('color') ? 'required-field' : ''} style={{ textAlign: 'left', display: 'block' }}>
                Color
              </Form.Label>
              <Form.Control
                type='text'
                name='color'
                value={empleado.color}
                onChange={handleChange}
                placeholder='Ingrese color de vehiculo'
                style={{ textAlign: 'left', borderRadius: '5px', width: '350px' }}
              />
              {empleado.color.length > 25 && <span style={{ color: 'red' }}>El color no puede tener mas de 25 carácteres</span>}
            </Form.Group>
            <Form.Group controlId='formNuevoInput3' className='label-input-margin'>
              <Form.Label className={camposVacios.includes('patente') ? 'required-field' : ''} style={{ textAlign: 'left', display: 'block' }}>
                Patente
              </Form.Label>
              <Form.Control
                type='text'
                name='patente'
                value={empleado.patente}
                onChange={handleChange}
                placeholder='Ingrese patente de vehiculo'
                style={{ textAlign: 'left', borderRadius: '5px', width: '350px' }}
              />
              {empleado.patente.length > 10 && <span style={{ color: 'red' }}>La patente no puede tener mas de 10 carácteres</span>}
            </Form.Group>
          </Col>
        </Row>
        <Button className='guardarEmpleado-btn' variant='primary' type='submit' style={{ backgroundColor: '#69688C', borderRadius: '20px', border: 'none' }}>
          Guardar Empleado
        </Button>
      </Form>
    </div>
  );
};

export default UploadEmpleado;
