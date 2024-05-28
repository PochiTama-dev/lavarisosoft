const DetalleOrden = ({ comisiones, cajas }) => {
  console.log('comisiones:', comisiones);
  console.log('cajas:', cajas);

  return (
    <div className="col-10">
      <ul>
        {Object.keys(comisiones).map((key) =>
          comisiones[key] ? (
            <li key={key} className="d-flex justify-content-between py-2 grey-text">
              <span>{key}:</span>
              <input type="text" value="$85790" disabled className="rounded text-center grey-text" />
            </li>
          ) : null
        )}
      </ul>
      <hr className="custom-hr" />
      <ul>
        <li className="d-flex justify-content-between py-2 grey-text">
          <span>Total:</span>
          <input type="text" value='$105790' disabled className="rounded text-center grey-text" />
        </li>
        {Object.keys(cajas).map((key) =>
          cajas[key] ? (
            <li key={key} className="d-flex justify-content-between py-2 grey-text">
              <span>{key}:</span>
              <input type="text" value="$85790" disabled className="rounded text-center grey-text" />
            </li>
          ) : null
        )}
        <li className="d-flex justify-content-between py-2 grey-text">
          <span>Codigo de imp.:</span>
          <input type="text" value='$1.111.111' disabled className="rounded text-center grey-text" />
        </li>
        <li className="d-flex justify-content-between py-2 grey-text">
          <span>Técnico domicilio:</span>
          <input type="text" value='$105790' disabled className="rounded text-center grey-text" />
        </li>
        <li className="d-flex justify-content-between py-2 grey-text">
          <span>Técnico taller:</span>
          <input type="text" value='$84632' disabled className="rounded text-center grey-text" />
        </li>
        <li className="d-flex justify-content-between py-2 grey-text">
          <span>Técnico entrega:</span>
          <input type="text" value='$5631' disabled className="rounded text-center grey-text" />
        </li>
      </ul>
    </div>
  );
};

export default DetalleOrden;
