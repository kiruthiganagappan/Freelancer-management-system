import React from 'react'
import { Routes, Route } from 'react-router-dom'

import RoleBasedRoute from './components/RoleBasedRoute'

import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import AdminLogin from './pages/auth/AdminLogin'

import ClientDashboard from './pages/client/ClientDashboard'
import CreateProject from './pages/client/CreateProject'
import MyProjects from './pages/client/MyProjects'
import EditProject from './pages/client/EditProject'
import ProjectDetails from './pages/client/ProjectDetails'
import BrowseFreelancers from './pages/client/BrowseFreelancers'

import FreelancerDashboard from './pages/freelancer/FreelancerDashboard'
import BrowseProjects from './pages/freelancer/BrowseProjects'
import ApplyProject from './pages/freelancer/ApplyProject'
import MyApplications from './pages/freelancer/MyApplications'
import AssignedProjects from './pages/freelancer/AssignedProjects'
import Profile from './pages/freelancer/Profile'

import AdminDashboard from './pages/admin/AdminDashboard'
import ManageUsers from './pages/admin/ManageUsers'
import ManageProjects from './pages/admin/ManageProjects'

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Client */}
      <Route path="/client/dashboard" element={
        <RoleBasedRoute allowedRoles={['ROLE_CLIENT']}><ClientDashboard /></RoleBasedRoute>
      } />
      <Route path="/client/projects" element={
        <RoleBasedRoute allowedRoles={['ROLE_CLIENT']}><MyProjects /></RoleBasedRoute>
      } />
      <Route path="/client/projects/create" element={
        <RoleBasedRoute allowedRoles={['ROLE_CLIENT']}><CreateProject /></RoleBasedRoute>
      } />
      <Route path="/client/projects/:id/edit" element={
        <RoleBasedRoute allowedRoles={['ROLE_CLIENT']}><EditProject /></RoleBasedRoute>
      } />
      <Route path="/client/projects/:id" element={
        <RoleBasedRoute allowedRoles={['ROLE_CLIENT']}><ProjectDetails /></RoleBasedRoute>
      } />
      <Route path="/client/freelancers" element={
        <RoleBasedRoute allowedRoles={['ROLE_CLIENT']}><BrowseFreelancers /></RoleBasedRoute>
      } />

      {/* Freelancer */}
      <Route path="/freelancer/dashboard" element={
        <RoleBasedRoute allowedRoles={['ROLE_FREELANCER']}><FreelancerDashboard /></RoleBasedRoute>
      } />
      <Route path="/freelancer/projects" element={
        <RoleBasedRoute allowedRoles={['ROLE_FREELANCER']}><BrowseProjects /></RoleBasedRoute>
      } />
      <Route path="/freelancer/projects/:id" element={
        <RoleBasedRoute allowedRoles={['ROLE_FREELANCER']}><ApplyProject /></RoleBasedRoute>
      } />
      <Route path="/freelancer/applications" element={
        <RoleBasedRoute allowedRoles={['ROLE_FREELANCER']}><MyApplications /></RoleBasedRoute>
      } />
      <Route path="/freelancer/assigned-projects" element={
        <RoleBasedRoute allowedRoles={['ROLE_FREELANCER']}><AssignedProjects /></RoleBasedRoute>
      } />
      <Route path="/freelancer/profile" element={
        <RoleBasedRoute allowedRoles={['ROLE_FREELANCER']}><Profile /></RoleBasedRoute>
      } />

      {/* Admin */}
      <Route path="/admin/dashboard" element={
        <RoleBasedRoute allowedRoles={['ROLE_ADMIN']}><AdminDashboard /></RoleBasedRoute>
      } />
      <Route path="/admin/users" element={
        <RoleBasedRoute allowedRoles={['ROLE_ADMIN']}><ManageUsers /></RoleBasedRoute>
      } />
      <Route path="/admin/projects" element={
        <RoleBasedRoute allowedRoles={['ROLE_ADMIN']}><ManageProjects /></RoleBasedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Landing />} />
    </Routes>
  )
}
