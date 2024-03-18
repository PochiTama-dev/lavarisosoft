import React from "react";
import "./tabs.css";

const Tabs = ({ active, onChange, children, direction }) => {
  const tabsClass = direction === "column" ? "tabs-vertical" : "tabs-horizontal";

  return (
    <>
      <div className={`tabs ${tabsClass}`}>
        {children.map((c, index) => (
          <a
            href={"javascript: void(0)"}
            onClick={() => onChange(index)}
            className={active === index ? "activeTab" : ""}
          >
            {c.props.title}
            <div className="line"></div>
          </a>
        ))}
      </div>
      <div>{children[active]}</div>
    </>
  );
};

export default Tabs;