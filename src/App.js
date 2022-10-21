import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './components/login/login';
import Home from './components/home/home';
import Public from './context/public'
import Private from './context/private'
import { AuthContextProvider } from './context/authContext';
import NotFound from './components/notFound'


function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
            {/*Rutas Públicas*/}
          <Route path="/" element={<Public/>}>
            <Route index element={<Login/>}/>
            <Route exact path="*" element={<NotFound/>}/>
          </Route>
            {/*Rutas Privadas*/}
          <Route path="/home" element={<Private/>}>
            <Route index element={<Home/>}/>
          </Route>
        </Routes>
    </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
