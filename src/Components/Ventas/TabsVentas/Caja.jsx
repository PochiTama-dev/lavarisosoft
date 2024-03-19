import "./Caja.css";

const Caja = () => {
  return (
    <div className="caja-container">
      <div>
        <div className="caja-heading mb-4">
          <h1>Movimientos de caja</h1>
        </div>
        <div className="caja-input-top">
          <div>
            <h4 className="caja-input-text">Buscar por número de orden</h4>
            <input className="caja-input" type="text" placeholder="Buscar" />
            <button className="caja-button-search">🔍︎</button>
          </div>
        </div>
        <div className="caja-input-bottom">
          <div>
            <h4 className="caja-input-text">Filtrar por fecha</h4>
            <input
              className="caja-input"
              type="text"
              placeholder="dd/mm/aaaa"
            />
            <button className="caja-button-search">🔍︎</button>
          </div>
          <div>
            <h4 className="caja-input-text">Filtrar por técnico</h4>
            <input className="caja-input" type="text" placeholder="Buscar" />
            <button className="caja-button-search">🔍︎</button>
          </div>
          <div>
            <h4 className="caja-input-text">Filtrar por cliente</h4>
            <input className="caja-input" type="text" placeholder="Buscar" />
            <button className="caja-button-search">🔍︎</button>
          </div>
        </div>
        <div className="caja-excel">
          <h2 className="caja-excel-heading">
            Movimientos del 27 de enero, 2024
          </h2>
          <div className="caja-excel-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Movimiento</th>
                  <th>Importe</th>
                  <th>No. de orden</th>
                  <th>Hora</th>
                  <th>Comentarios</th>
                </tr>
              </thead>
              <tbody>
                <tr className="row-even">
                  <td>Ingreso</td>
                  <td>$5000</td>
                  <td>#3366</td>
                  <td>15:06:32</td>
                  <td>"Recibo arreglo..."</td>
                </tr>
                <tr>
                  <td>Ingreso</td>
                  <td>$25000</td>
                  <td>#3365</td>
                  <td>14:24:00</td>
                  <td>"Presupuesto..."</td>
                </tr>
                <tr className="row-even">
                  <td>Egreso</td>
                  <td>$480000</td>
                  <td>#3364</td>
                  <td>12:27:00</td>
                  <td>Viático</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Caja;
