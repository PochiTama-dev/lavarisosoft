import { useCustomContext } from '../../hooks/context';
import imageLogin from '../../images/imageLogin.webp';
import './Login.css';

const Login = () => {
  const { handleNavigate } = useCustomContext();
  return (
    <div className='d-flex bg-primary loginContainer'>
      <aside className='container-sm row align-items-center my-5'>
        <div>
          <h1 className='text-white'>LavaRiso</h1>
          <h5 className='text-white'>Servicio técnico de lavarropas a domicilio</h5>
        </div>
        <h3>¡Bienvenido de vuelta!</h3>
        <span>Credenciales requeridas</span>
        <form action='' method='post'>
          <input className='bg-white text-black rounded my-2' type='email' name='' id='' placeholder='E-mail' />
          <input className='bg-white text-black rounded my-2' type='password' name='' id='' placeholder='Contraseña' />
        </form>
        <button className='loginButton btn text-white' onClick={() => handleNavigate('menu')}>
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
