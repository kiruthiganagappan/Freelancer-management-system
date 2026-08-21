import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import DashboardLayout from '../../components/DashboardLayout'
import StatCard from '../../components/StatCard'
import Loader from '../../components/Loader'
import ErrorMessage from '../../components/ErrorMessage'

export default function FreelancerDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/proposals/dashboard/freelancer')
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout>
      <h1 className="page-title">Freelancer Dashboard</h1>
      <ErrorMessage message={error} />
      {loading ? (
        <Loader />
      ) : (
        <div className="stats-grid">
          <StatCard label="Available Projects" value={stats.availableProjects} accent="accent-blue" />
          <StatCard label="Applied Projects" value={stats.appliedProjects} />
          <StatCard label="Assigned Projects" value={stats.assignedProjects} accent="accent-amber" />
          <StatCard label="Completed Projects" value={stats.completedProjects} accent="accent-green" />
        </div>
      )}
    </DashboardLayout>
  )
}
