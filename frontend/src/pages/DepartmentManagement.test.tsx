import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { departmentAPI } from '../api/department';
import type { Department } from '../api/department';
import DepartmentManagement from './DepartmentManagement';

// Mock the API module so calls resolve without network.
vi.mock('../api/department', () => ({
  departmentAPI: {
    createDepartment: vi.fn(),
    updateDepartment: vi.fn(),
    assignDoctor: vi.fn(),
    removeAssignment: vi.fn(),
    getAllDepartments: vi.fn(),
    getDepartment: vi.fn(),
    getAllDoctorsWithDepartments: vi.fn(),
    getMyDepartment: vi.fn(),
  },
}));

// Mock the auth context so the page renders without a real provider.
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'user-1',
      email: 'admin@hospital.com',
      role: 'admin',
      first_name: 'System',
      last_name: 'Admin',
      phone: '+1234567890',
      is_active: true,
    },
    logout: vi.fn(),
  }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/departments' }),
}));

describe('DepartmentManagement', () => {
  const mockDepartments: Department[] = [
    { id: 'dept-1', name: 'Cardiology', description: 'Heart care', is_active: true },
    { id: 'dept-2', name: 'Neurology', description: null, is_active: false },
  ];

  it('renders departments after loading', async () => {
    vi.mocked(departmentAPI.getAllDepartments).mockResolvedValue(mockDepartments);
    vi.mocked(departmentAPI.getAllDoctorsWithDepartments).mockResolvedValue([]);

    render(<DepartmentManagement />);

    await waitFor(() => {
      expect(screen.getByText('Cardiology')).toBeInTheDocument();
      expect(screen.getByText('Neurology')).toBeInTheDocument();
    });

    expect(screen.getByText('Doctor Assignments (0)')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('toggles department active status on button click', async () => {
    vi.mocked(departmentAPI.getAllDepartments).mockResolvedValue(mockDepartments);
    vi.mocked(departmentAPI.getAllDoctorsWithDepartments).mockResolvedValue([]);
    vi.mocked(departmentAPI.updateDepartment).mockResolvedValue({
      id: 'dept-2',
      name: 'Neurology',
      description: null,
      is_active: true,
    });

    render(<DepartmentManagement />);

    await waitFor(() => {
      expect(screen.getByText('Neurology')).toBeInTheDocument();
    });

    const toggleBtn = screen.getByText('Activate');
    await userEvent.click(toggleBtn);

    await waitFor(() => {
      expect(departmentAPI.updateDepartment).toHaveBeenCalledWith('dept-2', {
        is_active: true,
      });
    });
  });

  it('renders empty state when no departments exist', async () => {
    vi.mocked(departmentAPI.getAllDepartments).mockResolvedValue([]);
    vi.mocked(departmentAPI.getAllDoctorsWithDepartments).mockResolvedValue([]);

    render(<DepartmentManagement />);

    await waitFor(() => {
      expect(screen.getByText('No departments created yet')).toBeInTheDocument();
    });
  });
});
