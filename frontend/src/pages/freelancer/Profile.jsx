import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import DashboardLayout from '../../components/DashboardLayout'
import Loader from '../../components/Loader'
import ErrorMessage from '../../components/ErrorMessage'

export default function Profile() {
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    api.get('/profile')
      .then((res) => setForm(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)
    try {
      await api.put('/profile', {
        name: form.name,
        skills: form.skills,
        experience: form.experience,
        bio: form.bio,
        availability: form.availability,
      })
      setSuccess('Profile updated successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>
  if (!form) return <DashboardLayout><ErrorMessage message={error} /></DashboardLayout>

  return (
    <DashboardLayout>
      <h1 className="page-title">My Profile</h1>
      <form className="form-card" onSubmit={handleSubmit}>
        <ErrorMessage message={error} />
        {success && <div className="success-message">{success}</div>}

        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Email</label>
        <input value={form.email} disabled />

        <label>Skills</label>
        <input name="skills" placeholder="e.g. React, Java, MySQL" value={form.skills || ''} onChange={handleChange} />

        <label>Experience</label>
        <input name="experience" placeholder="e.g. 3 years" value={form.experience || ''} onChange={handleChange} />

        <label>Availability</label>
        <input name="availability" placeholder="e.g. Full-time, Part-time" value={form.availability || ''} onChange={handleChange} />

        <label>Bio</label>
        <textarea name="bio" rows={5} value={form.bio || ''} onChange={handleChange} />

        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </DashboardLayout>
  )
}
