// OpVentas.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Tab from '../../../Components/Tabs/Tab';
import Tabs2 from '../../../Components/Tabs/Tabs2';
import Ventas from './Op-Ventas/Ventas';
import PorTecnico from './Op-Ventas/PorTecnico';
 
import './Caja.css';
import Searchers from './Op-Ventas/Searchers';
import { useCustomContext } from '../../../hooks/context';
import Header from '../../Header/Header';
// Función auxiliar para obtener valores anidados
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((value, key) => (value ? value[key] : undefined), obj);
};

const OpVentas = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [dataTab, setDataTab] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});

  const { listaFacturasVenta } = useCustomContext();

  useEffect(() => {
    itemsData();
  }, [activeTab]);

  useEffect(() => {
    applyFilters();
  }, [filters, dataTab]);

  const handleTabChange = (newActiveTab) => {
    setActiveTab(newActiveTab);
    setFilters([]);
  };

  const handleFilterChange = (field, value) => {
  
    if (field === 'created_at') {
      const targetDate = new Date(value);
      targetDate.setDate(targetDate.getDate() + 1);
      console.log(targetDate.toLocaleDateString());
      setFilteredData(
        dataTab.filter((item) => {
          const itemDate = new Date(item.created_at).toLocaleDateString();
          return itemDate === targetDate.toLocaleDateString();
        })
      );
    } else {
      setFilters((prev) => ({ ...prev, [field]: value }));
    }
  };

  const itemsData = async () => {
    const facturasVenta = await listaFacturasVenta();
    setDataTab(facturasVenta);
  };

  const applyFilters = () => {
    const filtered =
      dataTab &&
      dataTab.filter((item) => {
        return Object.keys(filters).every((key) => {
          //console.log(key);
          const filterValue = key !== 'created_at' && filters[key].toLowerCase();
          const itemValue = getNestedValue(item, key);
          return filterValue === '' || (itemValue && itemValue.toString().toLowerCase().includes(filterValue));
        });
      });
 
    setFilteredData(filtered);
  };

  return (
    <div className='opventas-container' style={{ padding:'20px' }}>
      <Header text='Operaciones/Ventas' />
 
      <Searchers activeTab={activeTab} onFilterChange={handleFilterChange} />
      <div className='cargarButton' style={{ textAlign: 'right', marginBottom: '10px' }}>
      <Link to="/cargarFacturaVenta">
            <button>Cargar factura</button>
          </Link>
      </div>
      <div style={{ textAlign: 'center', marginTop: '0px' }}>
        <Tab>
          <div className='opventas-tabs tabs-ctn'>
            <Tabs2 active={activeTab} className='client-tabs' onChange={handleTabChange}>
              <Tab title='Ventas y Servicios'>
                <Ventas data={filteredData} />
              </Tab>
              <Tab title='Por Técnico'>
                <PorTecnico data={filteredData || ''} />
              </Tab>
        {/*       <Tab title='Por Producto'>
                <PorProducto data={filteredData} />
              </Tab> */}
            </Tabs2>
          </div>
        </Tab>
      </div>
    </div>
  );
};

export default OpVentas;
