import "./tabs.css";
import PropTypes from 'prop-types';

// eslint-disable-next-line react/prop-types
const Tabs = ({ active, onChange, children, direction }) => {
  const tabsClass =
    direction === "column" ? "tabs-vertical" : "tabs-horizontal";

  return (
    <>
      <div className={`tabs ${tabsClass}`}>
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
Tabs.propTypes = {
  active: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  direction: PropTypes.oneOf(['row', 'column'])
};

export default Tabs;
 
