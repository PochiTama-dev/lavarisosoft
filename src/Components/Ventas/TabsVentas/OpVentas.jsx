// OpVentas.jsx
import { useEffect, useState } from 'react';
import Tab from '../../../Components/Tabs/Tab';
import Tabs2 from '../../../Components/Tabs/Tabs2';
import Ventas from './Op-Ventas/Ventas';
import PorTecnico from './Op-Ventas/PorTecnico';
import PorProducto from './Op-Ventas/PorProducto';
import './Caja.css';
import Searchers from './Op-Ventas/Searchers';
import { useCustomContext } from '../../../hooks/context';

// Función auxiliar para obtener valores anidados
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((value, key) => (value ? value[key] : undefined), obj);
};

const OpVentas = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [dataTab, setDataTab] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});

  const { ordenesGenerales, stockCamioneta } = useCustomContext();

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
    console.log(field);
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
    if (activeTab === 0 || activeTab === 1) {
      const orders = await ordenesGenerales();
      setDataTab(orders);
    } else if (activeTab === 2) {
      const listaStockCamioneta = await stockCamioneta();
      setDataTab(listaStockCamioneta);
    }
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
    console.log(filtered);
    setFilteredData(filtered);
  };

  return (
    <div className='opventas-container'>
      <h1 style={{ fontWeight: 'Bold', marginLeft: '20px', paddingTop: '2.5%' }}>Operaciones/Ventas</h1>
      <Searchers activeTab={activeTab} onFilterChange={handleFilterChange} />
      <div style={{ textAlign: 'center', marginTop: '0px' }}>
        <Tab>
          <div className='opventas-tabs tabs-ctn'>
            <Tabs2 active={activeTab} className='client-tabs' onChange={handleTabChange}>
              <Tab title='Ventas y Servicios'>
                <Ventas data={filteredData} />
              </Tab>
              <Tab title='Por Técnico'>
                <PorTecnico data={filteredData} />
              </Tab>
              <Tab title='Por Producto'>
                <PorProducto data={filteredData} />
              </Tab>
            </Tabs2>
          </div>
        </Tab>
      </div>
    </div>
  );
};

export default OpVentas;
