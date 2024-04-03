const DetalleOrden = () => {
  return (
    <div className="col-10">
      <ul>
        <li className="d-flex justify-content-between py-2 grey-text">
          <span>Servicio:</span>
          <input type="text" value='$85790' disabled className="rounded text-center grey-text" />
        </li>
        <li className="d-flex justify-content-between py-2 grey-text">
          <span>Repuestos:</span>
          <input type="text" value='$20000' disabled className="rounded text-center grey-text" />
        </li>
        <li className="d-flex justify-content-between py-2 grey-text">
          <span>Viaticos:</span>
          <input type="text" value='$400' disabled className="rounded text-center grey-text" />
        </li>
      </ul>
      <hr className="custom-hr" />
      <ul>
        <li className="d-flex justify-content-between py-2 grey-text">
          <span>Total:</span>
          <input type="text" value='$105790' disabled className="rounded text-center grey-text" />
        </li>
        <li className="d-flex justify-content-between py-2 grey-text">
          <span>Caja 1:</span>
          <input type="text" value='$84632' disabled className="rounded text-center grey-text" />
        </li>
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
