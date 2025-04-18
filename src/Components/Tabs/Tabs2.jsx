 
import "./tabs.css";

const Tabs = ({ active, onChange, children, direction }) => {
  const tabsClass = direction === "column" ? "tabs2-vertical" : "tabs2-horizontal";

  return (
    <>
      <div className={`tabs2 ${tabsClass}`}>
        {children.map((c, index) => (
          <a
            key={index}
            href="#"
            onClick={e => { e.preventDefault(); onChange(index); }}
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