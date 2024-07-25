import React from 'react'
import { useSelector } from 'react-redux'

import { Navigate, Outlet } from 'react-router'

const AdminPrivateroutes = () => {
    const {currentUser} = useSelector((state)=>state.user)
  return currentUser && currentUser.isAdmin ?( <Outlet/> ):( <Navigate to={'/'}/>)
}

export default AdminPrivateroutes