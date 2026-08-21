import React, { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('fms_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    persistSession(data)
    return data
  }

  const adminLogin = async (email, password) => {
    const { data } = await api.post('/auth/admin/login', { email, password })
    persistSession(data)
    return data
  }

  const register = async (name, email, password, role) => {
    const { data } = await api.post('/auth/register', { name, email, password, role })
    persistSession(data)
    return data
  }

  const persistSession = (data) => {
    const sessionUser = { id: data.id, name: data.name, email: data.email, role: data.role }
    localStorage.setItem('fms_token', data.token)
    localStorage.setItem('fms_user', JSON.stringify(sessionUser))
    setUser(sessionUser)
  }

  const logout = () => {
    localStorage.removeItem('fms_token')
    localStorage.removeItem('fms_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, adminLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
