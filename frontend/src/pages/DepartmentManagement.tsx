import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { LogOut, Plus, Edit2, Users as UsersIcon, Building2 } from 'lucide-react'
import { departmentAPI, Department, DoctorWithDepartment } from '../api/department'
import CreateDepartmentModal from '../components/CreateDepartmentModal'
import AssignDoctorModal from '../components/AssignDoctorModal'
import '../pages/Dashboard.css'
import './DepartmentManagement.css'

const DepartmentManagement = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [departments, setDepartments] = useState<Department[]>([])
  const [doctors, setDoctors] = useState<DoctorWithDepartment[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)

  const currentPath = location.pathname

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [depts, docs] = await Promise.all([
        departmentAPI.getAllDepartments(),
        departmentAPI.getAllDoctorsWithDepartments()
      ])
      setDepartments(depts)
      setDoctors(docs)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDepartmentCreated = (newDept: Department) => {
    setDepartments([...departments, newDept])
    setShowCreateModal(false)
  }

  const handleToggleActive = async (dept: Department) => {
    try {
      const updated = await departmentAPI.updateDepartment(dept.id, {
        is_active: !dept.is_active
      })
      setDepartments(departments.map(d => d.id === dept.id ? updated : d))
    } catch (error) {
      console.error('Failed to toggle department status:', error)
    }
  }

  const handleAssignmentComplete = () => {
    setShowAssignModal(false)
    loadData()
  }

  const getDoctorCount = (deptId: string) => {
    return doctors.filter(d => d.department_id === deptId).length
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    )
  }

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>Hospital Management System</h1>
          <div className="navbar-right">
            <span className="user-info">
              {user?.first_name} {user?.last_name} (Admin)
            </span>
            <button onClick={logout} className="logout-button">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div style={{ display: 'flex', height: 'calc(100vh - 65px)' }}>
        {/* Sidebar */}
        <aside style={{
          width: '250px',
          backgroundColor: 'white',
          borderRight: '1px solid #e0e0e0',
          padding: '1.5rem 0',
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 1rem' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                backgroundColor: currentPath === '/dashboard' ? '#f0f0f0' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: currentPath === '/dashboard' ? '600' : '400',
                color: '#333',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                if (currentPath !== '/dashboard') {
                  e.currentTarget.style.backgroundColor = '#f8f8f8'
                }
              }}
              onMouseLeave={(e) => {
                if (currentPath !== '/dashboard') {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <UsersIcon size={20} />
              Users & Staff
            </button>
            <button
              onClick={() => navigate('/departments')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                backgroundColor: currentPath === '/departments' ? '#f0f0f0' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: currentPath === '/departments' ? '600' : '400',
                color: '#333',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                if (currentPath !== '/departments') {
                  e.currentTarget.style.backgroundColor = '#f8f8f8'
                }
              }}
              onMouseLeave={(e) => {
                if (currentPath !== '/departments') {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <Building2 size={20} />
              Departments
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content" style={{ flex: 1, overflowY: 'auto' }}>
          <div className="content-header">
            <div>
              <h2>Department Management</h2>
              <p>Create departments and assign doctors</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setShowAssignModal(true)} className="create-button">
                <UsersIcon size={20} />
                Assign Doctors
              </button>
              <button onClick={() => setShowCreateModal(true)} className="create-button">
                <Plus size={20} />
                Create Department
              </button>
            </div>
          </div>

          <div className="users-grid">
            {departments.length === 0 ? (
              <div className="empty-state">
                <p>No departments created yet</p>
                <p className="empty-subtitle">Click "Create Department" to add a new department</p>
              </div>
            ) : (
              departments.map((dept) => (
                <div key={dept.id} className="user-card department-card">
                  <div className="user-card-header">
                    <h3>{dept.name}</h3>
                    <span className={`role-badge ${dept.is_active ? 'status-active' : 'status-inactive'}`}>
                      {dept.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="user-card-body">
                    {dept.description && (
                      <p className="dept-description">{dept.description}</p>
                    )}
                    <p>
                      <strong>Assigned Doctors:</strong> {getDoctorCount(dept.id)}
                    </p>
                    <div className="dept-actions">
                      <button
                        onClick={() => handleToggleActive(dept)}
                        className="dept-action-btn"
                      >
                        {dept.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ marginTop: '3rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#333', marginBottom: '1.5rem' }}>
              Doctor Assignments ({doctors.length})
            </h3>
            <div className="users-grid">
              {doctors.length === 0 ? (
                <div className="empty-state">
                  <p>No doctors available</p>
                </div>
              ) : (
                doctors.map((doc) => (
                  <div key={doc.id} className="user-card">
                    <div className="user-card-header">
                      <h3>Dr. {doc.first_name} {doc.last_name}</h3>
                      <span className={doc.is_active ? 'status-active' : 'status-inactive'}>
                        {doc.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="user-card-body">
                      <p><strong>Email:</strong> {doc.email}</p>
                      {doc.phone && <p><strong>Phone:</strong> {doc.phone}</p>}
                      <p>
                        <strong>Department:</strong>{' '}
                        {doc.department_name || <span style={{ color: '#999' }}>Not assigned</span>}
                      </p>
                      {doc.specialization && (
                        <p><strong>Specialization:</strong> {doc.specialization}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {showCreateModal && (
        <CreateDepartmentModal
          onClose={() => setShowCreateModal(false)}
          onDepartmentCreated={handleDepartmentCreated}
        />
      )}

      {showAssignModal && (
        <AssignDoctorModal
          onClose={() => setShowAssignModal(false)}
          onAssignmentComplete={handleAssignmentComplete}
          doctors={doctors}
          departments={departments.filter(d => d.is_active)}
        />
      )}
    </div>
  )
}

export default DepartmentManagement
