import { useCustomContext } from '../../hooks/context';
import imageLogin from '../../images/imageLogin.webp';
import './Login.css';

const Login = () => {
  const { handleNavigate } = useCustomContext();
  return (
    <div className='d-flex bg-primary loginContainer'>
      <aside className='container-sm row align-items-center my-5 leftContainer'>
        <div>
          <h1 className='text-white titleLogin'>LavaRiso</h1>
          <h5 className='text-white subtitleLogin'>Servicio técnico de lavarropas a domicilio</h5>
        </div>
        <h3 className='messageTitle text-center'>¡Bienvenido de vuelta!</h3>
        <span className='messageTitle'>Credenciales requeridas</span>
        <form action='' method='post' className='d-flex flex-column'>
          <input className='bg-white text-black rounded-pill my-2 inputsLogin' type='email' name='' id='' placeholder='E-mail' />
          <input className='bg-white text-black rounded-pill my-2 inputsLogin' type='password' name='' id='' placeholder='Contraseña' />
        </form>
        <button className='loginButton btn text-white rounded-pill' onClick={() => handleNavigate('menu')}>
          Iniciar sesión
        </button>
      </aside>
      <aside className='asideImg'>
        <img className='imgLogin' src={imageLogin} alt='image LavaRiso' />
      </aside>
    </div>
  );
};
export default Login;
