const fetchDolarBlue = async () => {
  try {
    const response = await fetch("https://dolarapi.com/v1/dolares/blue");
    const data = await response.json();
    return data.venta;
  } catch (error) {
    console.error("Error al obtener la tasa del dólar blue:", error);
  }
};

export default fetchDolarBlue;
