import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router'

const ProtectedRoutes = () => {
    const{currentUser}= useSelector((state)=>state.user)
  return currentUser ? <Outlet/> : <Navigate to="/register"/>
}

export default ProtectedRoutes