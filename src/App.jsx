import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login/Login.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
