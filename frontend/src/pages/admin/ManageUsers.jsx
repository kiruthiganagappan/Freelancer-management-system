import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import DashboardLayout from '../../components/DashboardLayout'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import ErrorMessage from '../../components/ErrorMessage'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadUsers = (params = {}) => {
    setLoading(true)
    api.get('/admin/users', { params })
      .then((res) => setUsers(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load users'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadUsers() }, [])

  const handleFilter = (e) => {
    e.preventDefault()
    const params = {}
    if (search) params.search = search
    if (role) params.role = role
    loadUsers(params)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return
    try {
      await api.delete(`/admin/users/${id}`)
      loadUsers()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user')
    }
  }

  const handleToggleActive = async (user) => {
    try {
      await api.put(`/admin/users/${user.id}/status`, { active: !user.active })
      loadUsers()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status')
    }
  }

  return (
    <DashboardLayout>
      <h1 className="page-title">Manage Users</h1>

      <form className="search-bar" onSubmit={handleFilter}>
        <input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value="ROLE_ADMIN">Admin</option>
          <option value="ROLE_CLIENT">Client</option>
          <option value="ROLE_FREELANCER">Freelancer</option>
        </select>
        <button className="btn btn-primary" type="submit">Filter</button>
      </form>

      <ErrorMessage message={error} />

      {loading ? (
        <Loader />
      ) : users.length === 0 ? (
        <EmptyState title="No users found" description="Try adjusting your search or filters." />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role.replace('ROLE_', '')}</td>
                  <td>
                    <span className={`status-badge ${u.active ? 'status-completed' : 'status-cancelled'}`}>
                      {u.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="table-actions">
                    {u.role !== 'ROLE_ADMIN' && (
                      <>
                        <button className="btn btn-outline" onClick={() => handleToggleActive(u)}>
                          {u.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDelete(u.id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}
