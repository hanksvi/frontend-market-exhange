import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthProvider';
import { Outlet, Navigate } from "react-router-dom";


//Vamos a crear un router y vamos a llamar a createBrowserRouter

//Lo interesante aquí es que es definir diferentes rutas dentro de nuestro proyecto
const router= createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />, // Redirige la raíz a /login
  },
  
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: <ProtectedRoute />, // Ruta protegida para Dashboard
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
  
]); 

createRoot(document.getElementById('root')!).render(
  //Quitamos el <App/> y para que pongamos nuestro RouterProvider
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);