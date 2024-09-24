import { useState } from "react";
import Header from "../Header/Header";
import WhatsAppChat from "./WhatsappChat";
import Tabs from "../Tabs/Tabs";
import Tab from "../Tabs/Tab";
import FacebookChat from "./FacebookChat";

const Chat = () => {
  const [active, setActive] = useState(0);
  const handleChange = (newActive) => setActive(newActive);
  return (
    <div className="chat">
      <Header text="Chat" />
      <div style={{ marginTop: "4%" }}>
        <Tabs active={active} onChange={handleChange}>
          <Tab title="WHATSAPP" className="wpp">
            <WhatsAppChat />
          </Tab>
          <Tab title="FACEBOOK">
            {/* <FacebookChat /> */}
            Todavía no está disponible
          </Tab>
          <Tab title="INSTAGRAM">Todavía no está disponible</Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Chat;
