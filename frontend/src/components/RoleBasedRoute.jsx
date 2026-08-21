import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const DASHBOARD_BY_ROLE = {
  ROLE_ADMIN: '/admin/dashboard',
  ROLE_CLIENT: '/client/dashboard',
  ROLE_FREELANCER: '/freelancer/dashboard',
}

export default function RoleBasedRoute({ allowedRoles, children }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={DASHBOARD_BY_ROLE[user.role] || '/login'} replace />
  }

  return children
}
