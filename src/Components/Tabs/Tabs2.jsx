import React from "react";
import "./tabs.css";

const Tabs = ({ active, onChange, children, direction }) => {
  const tabsClass = direction === "column" ? "tabs2-vertical" : "tabs2-horizontal";

  return (
    <>
      <div className={`tabs2 ${tabsClass}`}>
        {children.map((c, index) => (
          <a
            key={index}
            href={"javascript: void(0)"}
            onClick={() => onChange(index)}
            className={active === index ? "activeTab" : ""}
          >
            {c.props.title}
          </a>
        ))}
      </div>
      <div>{children[active]}</div>
    </>
  );
};

export default Tabs;