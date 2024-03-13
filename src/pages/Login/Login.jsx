import imageLogin from '../../images/imageLogin.webp';
import './Login.css';
const Login = () => {
  return (
    <div className='container d-flex bg-primary'>
      <aside className='container-sm row align-items-center my-5'>
        <div>
          <h1 className='text-white'>LavaRiso</h1>
          <h5 className='text-white'>Servicio técnico de lavarropas a domicilio</h5>
        </div>
        <h3>¡Bienvenido de vuelta!</h3>
        <span>Credenciales requeridas</span>
        <form action='' method='post'>
          <input
            className='bg-white text-black rounded my-2'
            type='email'
            name=''
            id=''
            placeholder='E-mail'
          />
          <input
            className='bg-white text-black rounded my-2'
            type='password'
            name=''
            id=''
            placeholder='Contraseña'
          />
        </form>
        <button className='loginButton btn text-white'>Iniciar sesión</button>
      </aside>
      <aside>
        <img className='img-fluid' src={imageLogin} alt='image LavaRiso' />
      </aside>
    </div>
  );
};
export default Login;
