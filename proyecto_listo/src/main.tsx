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
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CreateCategoryPage from './pages/CreateCategoryPage';
import EditCategoryPage from './pages/EditCategoryPage';

//Vamos a crear un router y vamos a llamar a createBrowserRouter
const MainLayout = () => (
  <>
    <Navbar />
    <Outlet /> {/* Aquí se renderizarán las rutas hijas */}
  </>
);

//Lo interesante aquí es que es definir diferentes rutas dentro de nuestro proyecto
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, // MainLayout envuelve todo
    children: [
      {
        path: '', // Ruta raíz "/"
        element: <HomePage />, // Página de inicio
      },
      {
        path: '/login',
        element: <LoginPage />, // Página de inicio (Login)
      },
      {
        path: '/categories/create',
        element: <CreateCategoryPage />, 
      },
      {
        path: '/categories/edit/:id',
        element: <EditCategoryPage />, 
      },
      {
        path: '/register',
        element: <RegisterPage />, // Página de registro
      },
      {
        path: '/dashboard',
        element: <ProtectedRoute />, // Ruta protegida
        children: [
          {
            path: '',
            element: <Dashboard />, // Dashboard protegido
          },
        ],
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