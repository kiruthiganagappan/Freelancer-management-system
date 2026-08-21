import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="landing">
      <div className="landing-card">
        <h1>Freelancer Management System</h1>
        <p>Connect clients with skilled freelancers. Post projects, submit proposals, and get work done.</p>
        <div className="landing-actions">
          <Link className="btn btn-primary" to="/login">Login</Link>
          <Link className="btn btn-outline" to="/register">Register</Link>
        </div>
        <p className="landing-admin"><Link to="/admin/login">Admin Login</Link></p>
      </div>
    </div>
  )
}
