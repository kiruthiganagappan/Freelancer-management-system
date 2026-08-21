import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import DashboardLayout from '../../components/DashboardLayout'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import ErrorMessage from '../../components/ErrorMessage'
import StatusBadge from '../../components/StatusBadge'

export default function BrowseProjects() {
  const [projects, setProjects] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadProjects = (query = '') => {
    setLoading(true)
    api.get('/projects', { params: query ? { search: query } : {} })
      .then((res) => setProjects(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load projects'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadProjects() }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    loadProjects(search)
  }

  return (
    <DashboardLayout>
      <h1 className="page-title">Browse Open Projects</h1>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          placeholder="Search projects by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">Search</button>
      </form>

      <ErrorMessage message={error} />

      {loading ? (
        <Loader />
      ) : projects.length === 0 ? (
        <EmptyState title="No open projects" description="Try a different search or check back later." />
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
              </div>
              <div className="list-card-actions">
                <Link className="btn btn-outline" to={`/freelancer/projects/${p.id}`}>View</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
