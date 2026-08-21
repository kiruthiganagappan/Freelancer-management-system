import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import DashboardLayout from '../../components/DashboardLayout'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import ErrorMessage from '../../components/ErrorMessage'

export default function BrowseFreelancers() {
  const [freelancers, setFreelancers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/freelancers')
      .then((res) => setFreelancers(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load freelancers'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout>
      <h1 className="page-title">Browse Freelancers</h1>
      <ErrorMessage message={error} />

      {loading ? (
        <Loader />
      ) : freelancers.length === 0 ? (
        <EmptyState title="No freelancers found" description="Check back later as more freelancers join." />
      ) : (
        <div className="card-grid">
          {freelancers.map((f) => (
            <div className="profile-card" key={f.id}>
              <h3>{f.name}</h3>
              <p className="muted">{f.email}</p>
              {f.skills && <p><strong>Skills:</strong> {f.skills}</p>}
              {f.experience && <p><strong>Experience:</strong> {f.experience}</p>}
              {f.availability && <p><strong>Availability:</strong> {f.availability}</p>}
              {f.bio && <p className="muted">{f.bio}</p>}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
