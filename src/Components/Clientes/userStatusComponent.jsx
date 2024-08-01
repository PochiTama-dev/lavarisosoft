import React, { useEffect, useState } from 'react';
import socket from '../services/socketService'; // Asegúrate de que esta ruta sea correcta

const UserStatusComponent = () => {
  const [userStatus, setUserStatus] = useState(null);

  useEffect(() => {
    // Escuchar el evento 'userStatus' del servidor
    const handleUserStatus = (status) => {
      console.log('Received user status:', status);
      setUserStatus(status); // Actualizar el estado del componente con el nuevo estado del usuario
    };

    // Establecer el manejador para el evento 'userStatus'
    socket.on('userStatus', handleUserStatus);

    // Cleanup en caso de desmontaje del componente
    return () => {
      socket.off('userStatus', handleUserStatus);
    };
  }, []);

  return (
    <div>
      <h1>User Status</h1>
      <p>{userStatus ? `Current status: ${userStatus.status}` : 'No status available'}</p>
    </div>
  );
};

export default UserStatusComponent;
