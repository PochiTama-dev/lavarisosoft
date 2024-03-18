import "./Feedback.css";
import Header from "../Header/Header";

const Feedback = () => {
  return (
    <div className="container-full-width">
      {/* <Header
        text="Feedback"
      /> */}
      <h1 className="text-left feedback-heading text-uppercase">Feedback</h1>
      <div className="content-container">
        <div className="left-containers">
          <div className="left-container">
            {/* Contenedor izquierdo superior */}
            <h2 className="p-3 feedback-containers-heading">Por técnico</h2>
            <ul className="scrollable-container">
              {/* Lista de elementos por técnico */}
              <li>Técnico 1</li>
              <li>Técnico 2</li>
              <li>Técnico 3</li>
              <li>Técnico 1</li>
              <li>Técnico 2</li>
              <li>Técnico 3</li>
              <li>Técnico 1</li>
              <li>Técnico 2</li>
              <li>Técnico 3</li>
            </ul>
          </div>
          <div className="left-container">
            {/* Contenedor izquierdo inferior */}
            <h2 className="p-3 feedback-containers-heading">
              Por número de orden
            </h2>
            <ul className="scrollable-container">
              {/* Lista de elementos por número de orden */}
              <li>#1</li>
              <li>#2</li>
              <li>#3</li>
              <li>#4</li>
              <li>#5</li>
              <li>#6</li>
              <li>#1</li>
              <li>#2</li>
              <li>#3</li>
              <li>#4</li>
              <li>#5</li>
              <li>#6</li>
              <li>#1</li>
              <li>#2</li>
              <li>#3</li>
              <li>#4</li>
              <li>#5</li>
              <li>#6</li>
            </ul>
          </div>
        </div>
        <div className="right-container">
          {/* Contenedor derecho */}
          <h2
            className="p-3
           feedback-containers-heading"
          >
            Orden #2552525
          </h2>
          <div className="feedback-form">
            <h6 className="p-3 feedback-form-charge">Cargar feedback</h6>
            <textarea className="feedback-textarea"></textarea>
          </div>
          <div className="feedback-form-edit">
            <button className="feedback-form-button">Editar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
