import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import DashboardLayout from '../../components/DashboardLayout'
import StatCard from '../../components/StatCard'
import Loader from '../../components/Loader'
import ErrorMessage from '../../components/ErrorMessage'

export default function ClientDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/projects/dashboard/client')
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout>
      <h1 className="page-title">Client Dashboard</h1>
      <ErrorMessage message={error} />
      {loading ? (
        <Loader />
      ) : (
        <div className="stats-grid">
          <StatCard label="Total Projects" value={stats.totalProjects} />
          <StatCard label="Open Projects" value={stats.openProjects} accent="accent-blue" />
          <StatCard label="In Progress" value={stats.inProgressProjects} accent="accent-amber" />
          <StatCard label="Completed" value={stats.completedProjects} accent="accent-green" />
        </div>
      )}
    </DashboardLayout>
  )
}
