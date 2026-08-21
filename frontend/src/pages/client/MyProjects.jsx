import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import DashboardLayout from '../../components/DashboardLayout'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import ErrorMessage from '../../components/ErrorMessage'
import StatusBadge from '../../components/StatusBadge'

export default function MyProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadProjects = () => {
    setLoading(true)
    api.get('/projects/my')
      .then((res) => setProjects(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load projects'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadProjects() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return
    try {
      await api.delete(`/projects/${id}`)
      loadProjects()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete project')
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this project?')) return
    try {
      await api.put(`/projects/${id}/cancel`)
      loadProjects()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel project')
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">My Projects</h1>
        <Link className="btn btn-primary" to="/client/projects/create">+ New Project</Link>
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <Loader />
      ) : projects.length === 0 ? (
        <EmptyState title="No projects yet" description="Create your first project to start hiring freelancers." />
      ) : (
        <div className="card-list">
          {projects.map((p) => (
            <div className="list-card" key={p.id}>
              <div className="list-card-main">
                <div className="list-card-title-row">
                  <h3>{p.title}</h3>
                  <StatusBadge status={p.status} />
                </div>
                <p className="muted">Budget: ${p.budget} &middot; Deadline: {p.deadline}</p>
                {p.freelancerName && <p className="muted">Freelancer: {p.freelancerName}</p>}
              </div>
              <div className="list-card-actions">
                <Link className="btn btn-outline" to={`/client/projects/${p.id}`}>View</Link>
                {p.status === 'OPEN' && (
                  <>
                    <Link className="btn btn-outline" to={`/client/projects/${p.id}/edit`}>Edit</Link>
                    <button className="btn btn-outline" onClick={() => handleCancel(p.id)}>Cancel</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
