const empleadosDb = async () => {
  try {
    const data = await fetch('https://lv-back.online/empleados');
    const response = await data.json();
    return response;
  } catch (error) {
    console.error(error);
  }
};
const empleadosData = await empleadosDb();
export default empleadosData;
