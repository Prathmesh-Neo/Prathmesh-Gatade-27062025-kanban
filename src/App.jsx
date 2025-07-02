import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './Pages/Login'
import Singup from './Pages/Singup'
import Dashboard from './Pages/User/Dashboard'
import Navbar from './Components/Navbar'
import { useLocation,Navigate } from 'react-router-dom'
import PrivateRoute from './Components/PrivateRoute'

function App() {
  const location = useLocation()
  const isAuthenticated = location.pathname.startsWith('/user/dashboard')


  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path='login' element={<Login />} />
        <Route path='signup' element={<Singup />} />
        <Route path="/user/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />


      </Routes>
    </>
  )
}

export default App
