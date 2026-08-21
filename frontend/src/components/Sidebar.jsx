import React from 'react'
import { NavLink } from 'react-router-dom'

const LINKS = {
  ROLE_CLIENT: [
    { to: '/client/dashboard', label: 'Dashboard' },
    { to: '/client/projects', label: 'My Projects' },
    { to: '/client/projects/create', label: 'Create Project' },
    { to: '/client/freelancers', label: 'Browse Freelancers' },
  ],
  ROLE_FREELANCER: [
    { to: '/freelancer/dashboard', label: 'Dashboard' },
    { to: '/freelancer/projects', label: 'Browse Projects' },
    { to: '/freelancer/applications', label: 'My Applications' },
    { to: '/freelancer/assigned-projects', label: 'Assigned Projects' },
    { to: '/freelancer/profile', label: 'Profile' },
  ],
  ROLE_ADMIN: [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/users', label: 'Manage Users' },
    { to: '/admin/projects', label: 'Manage Projects' },
  ],
}

export default function Sidebar({ role }) {
  const links = LINKS[role] || []

  return (
    <aside className="sidebar">
      <nav>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
