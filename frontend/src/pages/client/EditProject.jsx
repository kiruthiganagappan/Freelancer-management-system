import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'
import DashboardLayout from '../../components/DashboardLayout'
import ErrorMessage from '../../components/ErrorMessage'
import Loader from '../../components/Loader'

export default function EditProject() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    api.get(`/projects/${id}`)
      .then((res) => {
        const p = res.data
        setForm({ title: p.title, description: p.description, budget: p.budget, deadline: p.deadline })
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load project'))
      .finally(() => setFetching(false))
  }, [id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.put(`/projects/${id}`, { ...form, budget: Number(form.budget) })
      navigate('/client/projects')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update project')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <DashboardLayout><Loader /></DashboardLayout>
  if (!form) return <DashboardLayout><ErrorMessage message={error} /></DashboardLayout>

  return (
    <DashboardLayout>
      <h1 className="page-title">Edit Project</h1>
      <form className="form-card" onSubmit={handleSubmit}>
        <ErrorMessage message={error} />

        <label>Project Title</label>
        <input name="title" value={form.title} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" rows={5} value={form.description} onChange={handleChange} required />

        <div className="form-row">
          <div>
            <label>Budget ($)</label>
            <input name="budget" type="number" min="1" step="0.01" value={form.budget} onChange={handleChange} required />
          </div>
          <div>
            <label>Deadline</label>
            <input name="deadline" type="date" value={form.deadline} onChange={handleChange} required />
          </div>
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </DashboardLayout>
  )
}
