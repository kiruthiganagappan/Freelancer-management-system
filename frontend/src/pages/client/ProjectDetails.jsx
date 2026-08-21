import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../api/axios'
import DashboardLayout from '../../components/DashboardLayout'
import Loader from '../../components/Loader'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'

export default function ProjectDetails() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = async () => {
    setLoading(true)
    try {
      const projectRes = await api.get(`/projects/${id}`)
      setProject(projectRes.data)
      if (projectRes.data.status === 'OPEN') {
        const proposalsRes = await api.get(`/proposals/project/${id}`)
        setProposals(proposalsRes.data)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [id])

  const handleDecision = async (proposalId, status) => {
    try {
      await api.put(`/proposals/${proposalId}/decision`, { status })
      loadData()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update proposal')
    }
  }

  const handleComplete = async () => {
    if (!window.confirm('Mark this project as completed?')) return
    try {
      await api.put(`/projects/${id}/complete`)
      loadData()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete project')
    }
  }

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>
  if (error) return <DashboardLayout><ErrorMessage message={error} /></DashboardLayout>
  if (!project) return null

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
          <span><strong>Assigned Freelancer:</strong> {project.freelancerName || 'Not yet assigned'}</span>
        </div>

        {project.status === 'IN_PROGRESS' && (
          <button className="btn btn-primary" onClick={handleComplete}>Mark as Completed</button>
        )}
      </div>

      {project.status === 'OPEN' && (
        <>
          <h2 className="section-title">Proposals</h2>
          {proposals.length === 0 ? (
            <EmptyState title="No proposals yet" description="Freelancers who apply will show up here." />
          ) : (
            <div className="card-list">
              {proposals.map((p) => (
                <div className="list-card" key={p.id}>
                  <div className="list-card-main">
                    <div className="list-card-title-row">
                      <h3>{p.freelancerName}</h3>
                      <StatusBadge status={p.status} />
                    </div>
                    <p className="muted">Expected budget: ${p.expectedBudget}</p>
                    <p>{p.message}</p>
                  </div>
                  {p.status === 'PENDING' && (
                    <div className="list-card-actions">
                      <button className="btn btn-primary" onClick={() => handleDecision(p.id, 'ACCEPTED')}>Accept</button>
                      <button className="btn btn-outline" onClick={() => handleDecision(p.id, 'REJECTED')}>Reject</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  )
}
