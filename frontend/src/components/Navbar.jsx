import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="navbar-brand">Freelancer Management System</div>
      <div className="navbar-user">
        {user && (
          <>
            <span className="navbar-username">{user.name}</span>
            <span className="badge">{user.role.replace('ROLE_', '')}</span>
            <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </header>
  )
}
