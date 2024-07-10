const clientesDb = async () => {
  try {
    const data = await fetch('https://lv-back.online/clientes/lista');
    const response = await data.json();
    return response;
  } catch (error) {
    console.error(error);
  }
};
const clientesData = await clientesDb();
export default clientesData;
