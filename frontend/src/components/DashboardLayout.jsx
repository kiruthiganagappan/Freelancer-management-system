import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'

export default function DashboardLayout({ children }) {
  const { user } = useAuth()

  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-body">
        <Sidebar role={user?.role} />
        <main className="main-content">{children}</main>
      </div>
    </div>
  )
}
