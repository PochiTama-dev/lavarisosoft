import "./WhatsappChat.css";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const SOCKET_SERVER_URL = "https://lively-troubled-horesradish.glitch.me";
const ACCESS_TOKEN =
  "EAAHhWoqmSrgBO7pfgADDTqoGM7bkc0Dp0jjeB9A63i1efdfdu8p0H4jVKEeyDAlvoVvZAQhWDywr3rnJ1qqUpXvjlEvrFZCEfwGfmDuonMa8C4Dk3z1wRAqbVenPMOWOmmxzEvQUFz3msB3oYeLINseYn0BjXcQmtOlWFFsaUZBFrTZBZAPwkP5hbyTPeiKfAk8n2NjW2e07M9bf17fvD5ZAPPC8gZD";
const PHONE_NUMBER_ID = "434416053085704";

const WhatsAppChat = () => {
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  // Conectar al socket
  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);

    socket.on("new_message", (newMessage) => {
      if (selectedClient) {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [selectedClient.id]: [
            ...(prevMessages[selectedClient.id] || []),
            newMessage,
          ],
        }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedClient]);

  useEffect(() => {
    const fetchClients = async () => {
      const response = await fetch("https://lv-back.online/clientes/lista");
      const data = await response.json();
      setClients(data);
    };

    fetchClients();
  }, []);

  const sendMessage = async () => {
    if (!selectedClient) {
      setResponse("Selecciona un cliente primero");
      return;
    }
    const url = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    };

    const body = {
      messaging_product: "whatsapp",
      to: 54 + selectedClient.telefono,
      type: "text",
      text: { body: message },
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error al enviar el mensaje:", errorData);
        throw new Error(errorData.error.message || "Error desconocido");
      }

      const data = await res.json();
      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedClient.id]: [
          ...(prevMessages[selectedClient.id] || []),
          { text: { body: message }, type: "sent" },
        ],
      }));

      // Limpia el campo de entrada
      setMessage("");
      setResponse("Mensaje enviado exitosamente");
      console.log("Respuesta de la API:", data);
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error al enviar el mensaje: " + error.message);
    }
  };

  return (
    <div className="chat-container">
      <div className="clients-list">
        <h3>Clientes</h3>
        <ul>
          {clients.map((client) => (
            <li
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className={selectedClient?.id === client.id ? "selected" : ""}
            >
              {client.nombre} {client.apellido}
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-window">
        {selectedClient ? (
          <>
            <div className="chat-header">
              <h4>
                {selectedClient.nombre} {selectedClient.apellido} -{" "}
                {selectedClient.telefono}
              </h4>
            </div>
            <div className="messages">
              {(messages[selectedClient.id] || []).map((msg, index) => (
                <div
                  key={index}
                  className={`message ${
                    msg.type === "sent" ? "sent" : "received"
                  }`}
                >
                  {msg.text.body}
                </div>
              ))}
            </div>
            <textarea
              placeholder="Escribe tu mensaje"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Enviar</button>
            {response && <p>{response}</p>}
          </>
        ) : (
          <div className="chat-header">
            <h4>Selecciona un cliente</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppChat;
