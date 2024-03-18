import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Header from "../Header/Header";
 
const UploadEmpleado = () => {
  const [empleado, setEmpleado] = useState({
    nombre: '',
    legajo: '',
    rol: '',
    telefono: '',
    email: '',
    cuil: '',
    automovil: '',
    modelo: '',
    color: '',
    patente: '',
  });

  const [camposVacios, setCamposVacios] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmpleado((prevEmpleado) => ({
      ...prevEmpleado,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Empleado guardado:', empleado);
    setEmpleado({
      nombre: '',
      legajo: '',
      rol: '',
      telefono: '',
      email: '',
      cuil: '',
      automovil: '',
      modelo: '',
      color: '',
      patente: '',
    });
  };

  useEffect(() => {
    const campos = Object.entries(empleado).filter(([key, value]) =>   value.trim() === '');
    setCamposVacios(campos.map(([key]) => key));
  }, [empleado]);

  return (
    <div className='vw-100 mx-5 mt-5'>
      <Header className='vw-100' text="Gestion Global"></Header>
          <Form className='p-3' onSubmit={handleSubmit}>
      <Row>
        <Col>
          <h2 className="mb-4 p-3 text-left">Cargar Empleado</h2>
            <Form.Group controlId="formRol" className="label-input-margin">
              <Form.Label className={camposVacios.includes('rol') ? 'required-field' : ''} style={{ textAlign: 'left', display: 'block' }}>Rol</Form.Label>
              <Form.Control
                as="select"
                name="rol"
                value={empleado.rol}
                onChange={handleChange}
                placeholder="Seleccione el rol"
                style={{ textAlign: 'left', borderRadius: '5px', width: '350px' }}
              >
                <option value="">Seleccionar</option>
                <option value="CL">CL</option>
                <option value="TC">TC</option>
                <option value="AD">AD</option>
                <option value="SP">SP</option>
                <option value="CT">CT</option>
                <option value="JF">JF</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formNombre" className="label-input-margin">
              <Form.Label className={camposVacios.includes('nombre') ? 'required-field' : ''} style={{ textAlign: 'left', display: 'block' }}>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={empleado.nombre}
                onChange={handleChange}
                placeholder="Ingrese su nombre"
                style={{ textAlign: 'left', borderRadius: '5px', width: '350px' }}
              />
            </Form.Group>
            <Form.Group controlId="formLegajo" className="label-input-margin">
              <Form.Label className={camposVacios.includes('legajo') ? 'required-field' : ''} style={{ textAlign: 'left', display: 'block' }}>Legajo</Form.Label>
              <Form.Control
                type="text"
                name="legajo"
                value={empleado.legajo}
                onChange={handleChange}
                placeholder="Ingrese su legajo"
                style={{ textAlign: 'left', borderRadius: '5px', width: '350px' }}
              />
            </Form.Group>
            <Form.Group controlId="formTelefono" className="label-input-margin">
              <Form.Label className={camposVacios.includes('telefono') ? 'required-field' : ''} style={{ textAlign: 'left', display: 'block' }}>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                value={empleado.telefono}
                onChange={handleChange}
                placeholder="Ingrese su teléfono"
                style={{ textAlign: 'left', borderRadius: '5px', width: '350px' }}
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="label-input-margin">
              <Form.Label className={camposVacios.includes('email') ? 'required-field' : ''} style={{ textAlign: 'left', display: 'block' }}>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={empleado.email}
                onChange={handleChange}
                placeholder="Ingrese su email"
                style={{ textAlign: 'left', borderRadius: '5px', width: '350px' }}
              />
            </Form.Group>
            <Form.Group controlId="formCuil" className="label-input-margin">
              <Form.Label className={camposVacios.includes('cuil') ? 'required-field' : ''} style={{ textAlign: 'left', display: 'block' }}>CUIL</Form.Label>
              <Form.Control
                type="text"
                name="cuil"
                value={empleado.cuil}
                onChange={handleChange}
                placeholder="Ingrese su CUIL"
                style={{ textAlign: 'left', borderRadius: '5px', width: '350px' }}
              />
            </Form.Group>
      
     
        </Col>
        <Col className="uploadEmpleado-c2" style={{ textAlign: 'left' }}>
        <Form.Group controlId="formAutomovil" className="label-input-margin">
              <Form.Label className={camposVacios.includes('automovil') ? 'required-field' : ''} style={{ textAlign: 'left', display: 'block' }}>Automovil</Form.Label>
              <Form.Control
                type="text"
                name="automovil"
                value={empleado.automovil}
                onChange={handleChange}
                placeholder="Ingrese Automovil"
                style={{ textAlign: 'left', borderRadius: '5px', width: '350px' }}
              />
            </Form.Group>
          <Form.Group controlId="formNuevoInput1" className="label-input-margin">
            <Form.Label className={camposVacios.includes('modelo') ? 'required-field' : ''} style={{ textAlign: 'left', display: 'block' }} >Modelo</Form.Label>
            <Form.Control
              type="text"
              name="modelo"
              value={empleado.modelo}
              onChange={handleChange}
              placeholder="Ingrese modelo de vehiculo"
              style={{ textAlign: 'left', borderRadius: '5px', width: '350px' }}
            />
          </Form.Group>
          <Form.Group controlId="formNuevoInput2" className="label-input-margin">
            <Form.Label className={camposVacios.includes('color') ? 'required-field' : ''} style={{ textAlign: 'left', display: 'block' }}>Color</Form.Label>
            <Form.Control
              type="text"
              name="color"
              value={empleado.color}
              onChange={handleChange}
              placeholder="Ingrese color de vehiculo"
              style={{ textAlign: 'left', borderRadius: '5px', width: '350px' }}
            />
          </Form.Group>
          <Form.Group controlId="formNuevoInput3" className="label-input-margin">
            <Form.Label className={camposVacios.includes('patente') ? 'required-field' : ''} style={{ textAlign: 'left', display: 'block' }}>Patente</Form.Label>
            <Form.Control
              type="text"
              name="patente"
              value={empleado.patente}
              onChange={handleChange}
              placeholder="Ingrese patente de vehiculo"
              style={{ textAlign: 'left', borderRadius: '5px', width: '350px' }}
            />
          </Form.Group>
        </Col>
      </Row>
      <Button className='guardarEmpleado-btn' variant="primary" type="submit" style={{ backgroundColor: '#69688C', borderRadius: '20px', border: 'none' }}>
        Guardar Empleado
      </Button>
      </Form>
    </div>
  );
};

 
export default UploadEmpleado;