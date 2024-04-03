import "./LibroIVA.css";

const LibroIVA = () => {
  return (
    <div className="libro-container">
      <div className="libro-header-container">
        <div className="libro-header-left">
          <div className="libro-heading">
            <h1>Libro IVA</h1>
          </div>
          <div className="libro-heading-button-container">
            <button className="libro-heading-button">
              Comprobante de ventas
            </button>
          </div>
        </div>
        <div className="libro-header-right">
          <div className="libro-input-container">
            <h3 className="libro-input-text">Filtrar por fecha</h3>
            <input
              className="libro-input"
              type="text"
              placeholder="dd/mm/aaaa"
            />
            <button className="libro-button-search">🔍︎</button>
          </div>
        </div>
      </div>
      <div className="libro-excel-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>No. de orden</th>
              <th>Fecha</th>
              <th>Monto</th>
              <th>Denominación comprador</th>
              <th>Neto gravado</th>
              <th>IVA</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="row-even">
              <td>#3366</td>
              <td>12/12/12</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>#3365</td>
              <td>12/12/12</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr className="row-even">
              <td>#3364</td>
              <td>12/12/12</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>#3363</td>
              <td>12/12/12</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LibroIVA;
