import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ErrorMessage from '../../components/ErrorMessage'

export default function AdminLogin() {
  const { adminLogin } = useAuth()
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
      await adminLogin(form.email, form.password)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Admin login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page admin-auth">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Admin Login</h1>
        <p className="auth-subtitle">Restricted access — administrators only</p>

        <ErrorMessage message={error} />

        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required />

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} required />

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login as Admin'}
        </button>
      </form>
    </div>
  )
}
