/* eslint-disable react/prop-types */
const NotificationPopup = ({ message, onClick }) => {
  if (!message) return null;

  console.log('Renderizando popup con mensaje:', message); // Depuración

  return (
    <div
      onClick={onClick} // Manejar clic para redirigir
      style={{
        position: "fixed",
        top: "20px",
        left: "20px",
        zIndex: 9999999999,
        padding: "10px 20px",
        background: "rgba(0,0,0,0.7)",
        color: "#fff",
        borderRadius: "4px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        cursor: "pointer", // Cambiar cursor para indicar que es clickeable
      }}
    >
      {message}
    </div>
  );
};

export default NotificationPopup;