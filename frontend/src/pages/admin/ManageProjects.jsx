import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import DashboardLayout from '../../components/DashboardLayout'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import ErrorMessage from '../../components/ErrorMessage'
import StatusBadge from '../../components/StatusBadge'

export default function ManageProjects() {
  const [projects, setProjects] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadProjects = (params = {}) => {
    setLoading(true)
    api.get('/admin/projects', { params })
      .then((res) => setProjects(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load projects'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadProjects() }, [])

  const handleFilter = (e) => {
    e.preventDefault()
    const params = {}
    if (search) params.search = search
    if (status) params.status = status
    loadProjects(params)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return
    try {
      await api.delete(`/admin/projects/${id}`)
      loadProjects()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete project')
    }
  }

  return (
    <DashboardLayout>
      <h1 className="page-title">Manage Projects</h1>

      <form className="search-bar" onSubmit={handleFilter}>
        <input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <button className="btn btn-primary" type="submit">Filter</button>
      </form>

      <ErrorMessage message={error} />

      {loading ? (
        <Loader />
      ) : projects.length === 0 ? (
        <EmptyState title="No projects found" description="Try adjusting your search or filters." />
      ) : (
        <div className="card-list">
          {projects.map((p) => (
            <div className="list-card" key={p.id}>
              <div className="list-card-main">
                <div className="list-card-title-row">
                  <h3>{p.title}</h3>
                  <StatusBadge status={p.status} />
                </div>
                <p className="muted">
                  Budget: ${p.budget} &middot; Deadline: {p.deadline} &middot; Client: {p.clientName}
                  {p.freelancerName && <> &middot; Freelancer: {p.freelancerName}</>}
                </p>
              </div>
              <div className="list-card-actions">
                <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
