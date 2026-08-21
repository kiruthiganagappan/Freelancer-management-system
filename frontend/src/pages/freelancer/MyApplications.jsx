import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import DashboardLayout from '../../components/DashboardLayout'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import ErrorMessage from '../../components/ErrorMessage'
import StatusBadge from '../../components/StatusBadge'

export default function MyApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/proposals/my')
      .then((res) => setApplications(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load applications'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout>
      <h1 className="page-title">My Applications</h1>
      <ErrorMessage message={error} />

      {loading ? (
        <Loader />
      ) : applications.length === 0 ? (
        <EmptyState title="No applications yet" description="Browse open projects and submit a proposal to get started." />
      ) : (
        <div className="card-list">
          {applications.map((a) => (
            <div className="list-card" key={a.id}>
              <div className="list-card-main">
                <div className="list-card-title-row">
                  <h3>{a.projectTitle}</h3>
                  <StatusBadge status={a.status} />
                </div>
                <p className="muted">Expected budget: ${a.expectedBudget}</p>
                <p>{a.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
