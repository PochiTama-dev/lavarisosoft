import { useEffect, useState } from 'react';
import socket from '../../Components/services/socketService';

export const useTechnicianSockets = () => {
  const [technicians, setTechnicians] = useState({});

  useEffect(() => {
    const handleBroadcastLocation = (data) => {
      if (data && typeof data === 'object') {
        setTechnicians(() => {
          const updatedTechnicians = {};
          Object.keys(data).forEach((key) => {
            if (data[key].status !== 'desconectado') {
              updatedTechnicians[key] = data[key];
            }
          });
          return updatedTechnicians;
        });
      }
    };

    const handleUserStatus = (data) => {
      if (data && typeof data === 'object') {
        setTechnicians(() => {
          const updatedTechnicians = {};
          Object.keys(data).forEach((key) => {
            if (data[key].status !== 'desconectado') {
              updatedTechnicians[key] = data[key];
            }
          });
          return updatedTechnicians;
        });
      }
    };

    socket.on('broadcastLocation', handleBroadcastLocation);
    socket.on('userStatus', handleUserStatus);

    return () => {
      socket.off('broadcastLocation', handleBroadcastLocation);
      socket.off('userStatus', handleUserStatus);
    };
  }, []);

  return technicians;
};

export const handleTechnicianSelect = (tecnico, selectedClient, setSelectedTechnician, navigate) => {
  if (selectedClient) {
    setSelectedTechnician(tecnico);
    navigate('/locationOrder', {
      state: { selectedTechnician: tecnico, selectedClient: selectedClient },
    });
  }
};
