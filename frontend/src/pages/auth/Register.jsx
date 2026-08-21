import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ErrorMessage from '../../components/ErrorMessage'

const DASHBOARD_BY_ROLE = {
  ROLE_CLIENT: '/client/dashboard',
  ROLE_FREELANCER: '/freelancer/dashboard',
}

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'ROLE_CLIENT' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await register(form.name, form.email, form.password, form.role)
      navigate(DASHBOARD_BY_ROLE[data.role] || '/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create your account</h1>
        <p className="auth-subtitle">Join as a client or a freelancer</p>

        <ErrorMessage message={error} />

        <label>Full Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required />

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} />

        <label>I am a</label>
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="ROLE_CLIENT">Client — I want to hire freelancers</option>
          <option value="ROLE_FREELANCER">Freelancer — I want to find work</option>
        </select>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  )
}
