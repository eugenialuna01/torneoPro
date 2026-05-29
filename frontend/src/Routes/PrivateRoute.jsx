import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {

  const { user,loading } = useAuth()
 if (loading) return <h1>Cargando...</h1>; // o spinner
  return user ? children : <Navigate to="/login" replace />
}

export default PrivateRoute