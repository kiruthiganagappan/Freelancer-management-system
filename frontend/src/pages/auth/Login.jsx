import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ErrorMessage from '../../components/ErrorMessage'

const DASHBOARD_BY_ROLE = {
  ROLE_ADMIN: '/admin/dashboard',
  ROLE_CLIENT: '/client/dashboard',
  ROLE_FREELANCER: '/freelancer/dashboard',
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(form.email, form.password)
      navigate(DASHBOARD_BY_ROLE[data.role] || '/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Welcome back</h1>
        <p className="auth-subtitle">Log in to your Freelancer Management account</p>

        <ErrorMessage message={error} />

        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required />

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} required />

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
        <p className="auth-footer">
          <Link to="/admin/login">Admin Login</Link>
        </p>
      </form>
    </div>
  )
}
