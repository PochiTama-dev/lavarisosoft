import { useEffect, useState } from 'react';
import './nuevaOrden.css';
import { useCustomContext } from '../../../hooks/context';

const NuevosDatosCliente = ({ setCliente, cliente }) => {
  const { listaClientes } = useCustomContext();
  const [clientes, setClientes] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientOrNew, setClientOrNew] = useState(false);

  useEffect(() => {
    getClientes();
  }, []);

  const getClientes = async () => {
    const allClients = await listaClientes();
    setClientes(allClients);
  };
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setCliente((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleSelected = (client) => {
    setSelectedClient(client);
    setClientOrNew(false);
  };
  const handleNew = () => {
    setClientOrNew(true);
    setSelectedClient(null);
  };
  return (
    <div>
      <h3 className='m-4'>Clientes</h3>
      <div className='row'>
        <select className='col-sm-3 col-form-label'>
          <option value='' selected disabled>
            Seleccione un cliente
          </option>
          {clientes &&
            clientes.map((client) => (
              <option value={client.id} key={client.id} onClick={() => handleSelected(client)}>
                {client.nombre} #{client.numero_cliente}
              </option>
            ))}
        </select>
        <div className='col-sm-3 col-form-label'>
          <h4>o</h4>
        </div>
        <div className='col-sm-3 col-form-label'>
          <h4 onClick={handleNew}>Cargar nuevo cliente</h4>
        </div>
        {selectedClient !== null && !clientOrNew && (
          <>
            <div className='col-md-6'>
              <div className='mb-3 row align-items-center'>
                <label htmlFor='numero_cliente' className='col-sm-2 col-form-label'>
                  N° Cliente:
                </label>
                <div className='col-sm-8'>
                  <input type='text' id='numero_cliente' className='form-control input-small' value={selectedClient.numero_cliente || ''} required disabled />
                </div>
              </div>
              <div className='mb-3 row align-items-center'>
                <label htmlFor='nombre' className='col-sm-2 col-form-label'>
                  Nombre:
                </label>
                <div className='col-sm-8'>
                  <input type='text' id='nombre' className='form-control input-small' value={selectedClient.nombre || ''} required />
                </div>
              </div>
              <div className='mb-3 row align-items-center'>
                <label htmlFor='apellido' className='col-sm-2 col-form-label'>
                  Apellido:
                </label>
                <div className='col-sm-8'>
                  <input type='text' id='apellido' className='form-control input-small' value={selectedClient.apellido || ''} required />
                </div>
              </div>
              <div className='mb-3 row align-items-center'>
                <label htmlFor='cuil' className='col-sm-2 col-form-label'>
                  CUIL:
                </label>
                <div className='col-sm-8'>
                  <input type='text' id='cuil' className='form-control input-small' value={selectedClient.cuil || ''} required />
                </div>
              </div>
            </div>

            <div className='col-md-6'>
              <div className='mb-3 row align-items-center'>
                <label htmlFor='telefono' className='col-sm-2 col-form-label'>
                  Teléfono:
                </label>
                <div className='col-sm-8'>
                  <input type='text' id='telefono' className='form-control input-small' value={selectedClient.telefono || ''} required />
                </div>
              </div>
              <div className='mb-3 row align-items-center'>
                <label htmlFor='direccion' className='col-sm-2 col-form-label'>
                  Dirección:
                </label>
                <div className='col-sm-8'>
                  <input type='text' id='direccion' className='form-control input-small' value={selectedClient.direccion || ''} required />
                </div>
              </div>
              <div className='mb-3 row align-items-center'>
                <label htmlFor='ubicacion' className='col-sm-2 col-form-label'>
                  Localidad:
                </label>
                <div className='col-sm-8'>
                  <input type='text' id='ubicacion' className='form-control input-small' value={selectedClient.ubicacion || ''} required />
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
              <label htmlFor='numero_cliente' className='col-sm-2 col-form-label'>
                N° Cliente:
              </label>
              <div className='col-sm-8'>
                <input type='text' id='numero_cliente' className='form-control input-small' value={cliente.numero_cliente || ''} onChange={handleInputChange} required disabled />
              </div>
            </div>
            <div className='mb-3 row align-items-center'>
              <label htmlFor='nombre' className='col-sm-2 col-form-label'>
                Nombre:
              </label>
              <div className='col-sm-8'>
                <input type='text' id='nombre' className='form-control input-small' value={cliente.nombre || ''} onChange={handleInputChange} required />
              </div>
            </div>
            <div className='mb-3 row align-items-center'>
              <label htmlFor='apellido' className='col-sm-2 col-form-label'>
                Apellido:
              </label>
              <div className='col-sm-8'>
                <input type='text' id='apellido' className='form-control input-small' value={cliente.apellido || ''} onChange={handleInputChange} required />
              </div>
            </div>
            <div className='mb-3 row align-items-center'>
              <label htmlFor='cuil' className='col-sm-2 col-form-label'>
                CUIL:
              </label>
              <div className='col-sm-8'>
                <input type='text' id='cuil' className='form-control input-small' value={cliente.cuil || ''} onChange={handleInputChange} required />
              </div>
            </div>
          </div>
          <div className='col-md-6'>
            <div className='mb-3 row align-items-center'>
              <label htmlFor='telefono' className='col-sm-2 col-form-label'>
                Teléfono:
              </label>
              <div className='col-sm-8'>
                <input type='text' id='telefono' className='form-control input-small' value={cliente.telefono || ''} onChange={handleInputChange} required />
              </div>
            </div>
            <div className='mb-3 row align-items-center'>
              <label htmlFor='direccion' className='col-sm-2 col-form-label'>
                Dirección:
              </label>
              <div className='col-sm-8'>
                <input type='text' id='direccion' className='form-control input-small' value={cliente.direccion || ''} onChange={handleInputChange} required />
              </div>
            </div>
            <div className='mb-3 row align-items-center'>
              <label htmlFor='ubicacion' className='col-sm-2 col-form-label'>
                Localidad:
              </label>
              <div className='col-sm-8'>
                <input type='text' id='ubicacion' className='form-control input-small' value={cliente.ubicacion || ''} onChange={handleInputChange} required />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NuevosDatosCliente;
