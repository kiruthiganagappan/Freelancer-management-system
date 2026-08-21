import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import DashboardLayout from '../../components/DashboardLayout'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import ErrorMessage from '../../components/ErrorMessage'
import StatusBadge from '../../components/StatusBadge'

export default function AssignedProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadProjects = () => {
    setLoading(true)
    api.get('/projects/assigned')
      .then((res) => setProjects(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load assigned projects'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadProjects() }, [])

  const handleMarkComplete = async (id) => {
    if (!window.confirm('Mark this project as completed?')) return
    try {
      await api.put(`/projects/${id}/progress`, { status: 'COMPLETED' })
      loadProjects()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update project')
    }
  }

  const handleStartWork = async (id) => {
    try {
      await api.put(`/projects/${id}/progress`, { status: 'IN_PROGRESS' })
      loadProjects()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update project')
    }
  }

  return (
    <DashboardLayout>
      <h1 className="page-title">My Assigned Projects</h1>
      <ErrorMessage message={error} />

      {loading ? (
        <Loader />
      ) : projects.length === 0 ? (
        <EmptyState title="No assigned projects" description="Once a client accepts your proposal, the project will appear here." />
      ) : (
        <div className="card-list">
          {projects.map((p) => (
            <div className="list-card" key={p.id}>
              <div className="list-card-main">
                <div className="list-card-title-row">
                  <h3>{p.title}</h3>
                  <StatusBadge status={p.status} />
                </div>
                <p className="muted">Budget: ${p.budget} &middot; Deadline: {p.deadline} &middot; Client: {p.clientName}</p>
                <p>{p.description}</p>
              </div>
              <div className="list-card-actions">
                {p.status === 'IN_PROGRESS' && (
                  <button className="btn btn-primary" onClick={() => handleMarkComplete(p.id)}>Mark Completed</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
