import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'
import DashboardLayout from '../../components/DashboardLayout'
import Loader from '../../components/Loader'
import ErrorMessage from '../../components/ErrorMessage'
import StatusBadge from '../../components/StatusBadge'

export default function ApplyProject() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [form, setForm] = useState({ message: '', expectedBudget: '' })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    api.get(`/projects/${id}`)
      .then((res) => setProject(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load project'))
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await api.post('/proposals', {
        projectId: Number(id),
        message: form.message,
        expectedBudget: Number(form.expectedBudget),
      })
      setSuccess('Proposal submitted successfully!')
      setTimeout(() => navigate('/freelancer/applications'), 1200)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit proposal')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>
  if (!project) return <DashboardLayout><ErrorMessage message={error} /></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">{project.title}</h1>
        <StatusBadge status={project.status} />
      </div>

      <div className="detail-card">
        <p>{project.description}</p>
        <div className="detail-meta">
          <span><strong>Budget:</strong> ${project.budget}</span>
          <span><strong>Deadline:</strong> {project.deadline}</span>
          <span><strong>Client:</strong> {project.clientName}</span>
        </div>
      </div>

      {project.status === 'OPEN' ? (
        <>
          <h2 className="section-title">Submit a Proposal</h2>
          <form className="form-card" onSubmit={handleSubmit}>
            <ErrorMessage message={error} />
            {success && <div className="success-message">{success}</div>}

            <label>Proposal Message</label>
            <textarea name="message" rows={5} value={form.message} onChange={handleChange} required />

            <label>Expected Budget ($)</label>
            <input name="expectedBudget" type="number" min="1" step="0.01" value={form.expectedBudget} onChange={handleChange} required />

            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Proposal'}
            </button>
          </form>
        </>
      ) : (
        <p className="muted">This project is no longer accepting proposals.</p>
      )}
    </DashboardLayout>
  )
}
