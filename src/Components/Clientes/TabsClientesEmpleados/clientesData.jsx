// clientesData.js
const clientesDb = async () => {
  try {
    const response = await fetch('https://lv-back.online/clientes/lista');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default clientesDb;