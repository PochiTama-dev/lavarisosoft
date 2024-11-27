import { useState, useEffect } from 'react';
import './Calendario.css';

const Calendario = () => {
  const [eventos, setEventos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const eventosResponse = await fetch('https://lv-back.online/agenda/lista');
        const eventosData = await eventosResponse.json();

        const clientesResponse = await fetch('https://lv-back.online/clientes/lista');
        const clientesData = await clientesResponse.json();

        if (!eventosData.length || !clientesData.length) {
          throw new Error('No se encontraron eventos o clientes');
        }

        const clientesMap = new Map(clientesData.map((cliente) => [cliente.id, cliente.nombre]));

        const eventosConNombres = eventosData.map((evento) => {
          const { fecha, hora, id_cliente, id_evento_agenda } = evento;
          const fechaObj = new Date(fecha);
          const diaSemana = dias[fechaObj.getDay()];
          const estado = estadoEventoMap[id_evento_agenda] || 'Desconocido';
          const nombreCliente = clientesMap.get(id_cliente) || 'Desconocido';

          return {
            nombreCliente,
            estado,
            dia: diaSemana,
            fecha,
            horario: hora,
          };
        });

        setEventos(eventosConNombres);
        setClientes(clientesData);
      } catch (error) {
        console.error('Error al obtener datos:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, []);

  const horas = [];
  for (let i = 8; i <= 24; i++) {
    horas.push(i < 24 ? `${i}:00` : '00:00');
  }

  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const fechaActual = new Date();
  const primerDiaSemana = new Date(fechaActual);
  const ultimoDiaSemana = new Date(fechaActual);

  primerDiaSemana.setDate(fechaActual.getDate() - (fechaActual.getDay() === 0 ? 6 : fechaActual.getDay() - 1));
  ultimoDiaSemana.setDate(primerDiaSemana.getDate() + 6);

  const [comienzoSemana, setComienzoSemana] = useState(primerDiaSemana);
  const [finSemana, setFinSemana] = useState(ultimoDiaSemana);

  const semanaAnterior = () => {
    const nuevaSemana = new Date(comienzoSemana);
    nuevaSemana.setDate(nuevaSemana.getDate() - 7);
    setComienzoSemana(nuevaSemana);
    setFinSemana(new Date(nuevaSemana.getTime() + 6 * 24 * 60 * 60 * 1000));
  };

  const semanaSiguiente = () => {
    const nuevaSemana = new Date(comienzoSemana);
    nuevaSemana.setDate(nuevaSemana.getDate() + 7);
    setComienzoSemana(nuevaSemana);
    setFinSemana(new Date(nuevaSemana.getTime() + 6 * 24 * 60 * 60 * 1000));
  };

  const calcularPosicionYDuracion = (hora) => {
    const [inicio, fin] = hora.split(' - ').map((h) => {
      const [hora, minutos] = h.split(':').map(Number);
      return hora + minutos / 60;
    });

    const top = (inicio - 8) * 40;
    const height = (fin - inicio) * 40;

    return { top: `${top}px`, height: `${height}px` };
  };

  const estadoEventoMap = {
    1: 'Agendado',
    2: 'Concluido',
    3: 'Visitado',
  };

  return (
    <div className='m-5'>
      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error.message}</p>}
      <div className='d-flex flex-column justify-content-center align-items-center calendario'>
        <h3>
          Semana del {comienzoSemana.getDate()} de {meses[comienzoSemana.getMonth()]}
        </h3>
        <h3>
          <span className='bg-info flechaIzq' onClick={semanaAnterior}></span>
          {comienzoSemana.getDate()} de {meses[comienzoSemana.getMonth()]} - {finSemana.getDate()} de {meses[finSemana.getMonth()]}
          <span className='bg-info flechaDer' onClick={semanaSiguiente}></span>
        </h3>
      </div>

      <div className='d-flex justify-content-evenly dias-semana'>
        {dias.map((diaSemana, index) => {
          const fechaDiaActual = new Date(comienzoSemana);
          fechaDiaActual.setDate(comienzoSemana.getDate() + index);

          return (
            <div key={index} className='text-center'>
              <span className='dia-nombre'>
                {diaSemana} {fechaDiaActual.getDate()}
              </span>
            </div>
          );
        })}
      </div>

      <div className='d-flex grillaCalendario'>
        <ul className='horas p-0'>
          {horas.map((hora, index) => (
            <li key={index} className='hora bg-light text-center'>
              {hora}
            </li>
          ))}
        </ul>
        <ul className='d-flex justify-content-evenly dias p-0'>
          {dias.map((diaSemana, index) => {
            const fechaDiaActual = new Date(comienzoSemana);
            fechaDiaActual.setDate(comienzoSemana.getDate() + index - 1);
            return (
              <li key={index} className={'dia bg-light mx-2 text-center position-relative'}>
                {eventos
                  .filter((evento) => {
                    const fechaEvento = new Date(evento.fecha);
                    fechaEvento.setHours(0, 0, 0, 0);
                    return fechaEvento.getFullYear() === fechaDiaActual.getFullYear() && fechaEvento.getMonth() === fechaDiaActual.getMonth() && fechaEvento.getDate() === fechaDiaActual.getDate();
                  })
                  .map((evento, i) => {
                    const estilos = calcularPosicionYDuracion(evento.horario);
                    return (
                      <div key={i} className={`evento ${evento.estado} text-white position-absolute`} style={estilos}>
                        <div>
                          <strong>{evento.nombreCliente}</strong>
                        </div>
                        <div>{evento.horario}</div>
                      </div>
                    );
                  })}
              </li>
            );
          })}
        </ul>
      </div>

      <div className='d-flex'>
        <div className='mx-3 d-flex'>
          <span className='d-block circuloSpan bg-info'></span>
          <span>Agendado</span>
        </div>
        <div className='mx-3 d-flex'>
          <span className='d-block circuloSpan bg-body'></span>
          <span>Visitado</span>
        </div>
        <div className='mx-3 d-flex'>
          <span className='d-block circuloSpan bg-success'></span>
          <span>Concluido</span>
        </div>
      </div>
    </div>
  );
};

export default Calendario;
