import React from 'react'

const STATUS_CLASS = {
  OPEN: 'status-open',
  IN_PROGRESS: 'status-progress',
  COMPLETED: 'status-completed',
  CANCELLED: 'status-cancelled',
  PENDING: 'status-open',
  ACCEPTED: 'status-completed',
  REJECTED: 'status-cancelled',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${STATUS_CLASS[status] || ''}`}>
      {status.replace('_', ' ')}
    </span>
  )
}
