import { useEffect, useState } from "react";
import { useCustomContext } from "../../hooks/context";
import imageLogin from "../../images/imageLogin.webp";
import "./Login.css";

const Login = () => {
  const { handleNavigate, setUser, user } = useCustomContext();
  const [email, setEmail] = useState("");
  const [legajo, setLegajo] = useState("");
  const [error, setError] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !legajo) {
      setError("Por favor, complete ambos campos.");
      return;
    }

    try {
      const response = await fetch("https://lv-back.online/empleados");
      const empleados = await response.json();

      const empleado = empleados.find((emp) => emp.email === email);

      if (empleado) {
        const newUser = {
          email: empleado.email,
          tipoRol: empleado.TiposRole.tipo_rol,
          nombre: empleado.nombre,
        };
        await setUser(newUser);
        localStorage.setItem("usuario", JSON.stringify(newUser));
        handleNavigate("menu");
      } else {
        setError("Credenciales Incorrectas");
      }
    } catch (error) {
      console.error("Error al obtener empleados:", error);
      setError(
        "Error al iniciar sesión. Por favor, inténtelo de nuevo más tarde."
      );
    }
  };

  useEffect(() => {
    if (user) {
      handleNavigate("menu");
    }
  }, [user, handleNavigate]);

  return (
    <div className="d-flex bg-primary loginContainer">
      <aside className="container-sm row align-items-center my-5 leftContainer">
        <div>
          <h1 className="text-white titleLogin">LavaRiso</h1>
          <h5 className="text-white subtitleLogin">
            Servicio técnico de lavarropas a domicilio
          </h5>
        </div>
        <h3 className="messageTitle text-center">¡Bienvenido de vuelta!</h3>
        <span className="messageTitle">Credenciales requeridas</span>
        <form onSubmit={handleLogin} className="d-flex flex-column">
          <input
            className="bg-white text-black rounded-pill my-3 inputsLogin"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="bg-white text-black rounded-pill my-2 inputsLogin"
            type="password"
            placeholder="Contraseña"
            value={legajo}
            onChange={(e) => setLegajo(e.target.value)}
          />
          <button
            className="loginButton btn text-white rounded-pill"
            type="submit"
          >
            Iniciar sesión
          </button>
          {error && <p className="text-center text-danger">{error}</p>}
        </form>
      </aside>
      <aside className="asideImg">
        <img className="imgLogin" src={imageLogin} alt="image LavaRiso" />
      </aside>
    </div>
  );
};
export default Login;
