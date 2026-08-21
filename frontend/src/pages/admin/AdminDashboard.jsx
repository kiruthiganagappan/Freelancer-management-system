import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import DashboardLayout from '../../components/DashboardLayout'
import StatCard from '../../components/StatCard'
import Loader from '../../components/Loader'
import ErrorMessage from '../../components/ErrorMessage'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout>
      <h1 className="page-title">Admin Dashboard</h1>
      <ErrorMessage message={error} />
      {loading ? (
        <Loader />
      ) : (
        <div className="stats-grid">
          <StatCard label="Total Users" value={stats.totalUsers} />
          <StatCard label="Total Clients" value={stats.totalClients} accent="accent-blue" />
          <StatCard label="Total Freelancers" value={stats.totalFreelancers} accent="accent-blue" />
          <StatCard label="Total Projects" value={stats.totalProjects} />
          <StatCard label="Open Projects" value={stats.openProjects} accent="accent-amber" />
          <StatCard label="Completed Projects" value={stats.completedProjects} accent="accent-green" />
        </div>
      )}
    </DashboardLayout>
  )
}
