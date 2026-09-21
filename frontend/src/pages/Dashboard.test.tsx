import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { authAPI } from '../api/auth';
import type { User } from '../types';
import Dashboard from './Dashboard';

// Mock the API module so calls resolve without network.
vi.mock('../api/auth', () => ({
  authAPI: {
    getAllUsers: vi.fn(),
    login: vi.fn(),
    getCurrentUser: vi.fn(),
    createUser: vi.fn(),
    registerPatient: vi.fn(),
    patientLogin: vi.fn(),
    getCurrentPatient: vi.fn(),
  },
}));

// Mock the auth context so the component renders without a real provider.
const mockLogout = vi.fn();
const mockUser: User = {
  id: 'user-1',
  email: 'admin@hospital.com',
  role: 'admin',
  first_name: 'System',
  last_name: 'Admin',
  phone: '+1234567890',
  is_active: true,
};

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    logout: mockLogout,
  }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/dashboard' }),
}));

describe('Dashboard', () => {
  it('renders doctors and receptionists after loading users', async () => {
    const mockUsers: User[] = [
      {
        id: 'doc-1',
        email: 'dr.smith@hospital.com',
        role: 'doctor',
        first_name: 'John',
        last_name: 'Smith',
        phone: '555-0100',
        is_active: true,
      },
      {
        id: 'rec-1',
        email: 'rec.jones@hospital.com',
        role: 'receptionist',
        first_name: 'Jane',
        last_name: 'Jones',
        phone: '555-0200',
        is_active: true,
      },
    ];

    vi.mocked(authAPI.getAllUsers).mockResolvedValue(mockUsers);

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Doctors (1)')).toBeInTheDocument();
      expect(screen.getByText('Receptionists (1)')).toBeInTheDocument();
    });

    expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
    expect(screen.getByText('Jane Jones')).toBeInTheDocument();
  });

  it('filters out the current admin from the displayed users', async () => {
    const mockUsers: User[] = [
      mockUser,
      {
        id: 'doc-2',
        email: 'dr.brown@hospital.com',
        role: 'doctor',
        first_name: 'Oliver',
        last_name: 'Brown',
        phone: '555-0300',
        is_active: true,
      },
    ];

    vi.mocked(authAPI.getAllUsers).mockResolvedValue(mockUsers);

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Doctors (1)')).toBeInTheDocument();
    });

    // The admin (mockUser) should not appear in the doctor list
    expect(screen.queryByText('System Administrator')).not.toBeInTheDocument();
    expect(screen.getByText('Dr. Oliver Brown')).toBeInTheDocument();
  });

  it('shows an error message when loading users fails', async () => {
    vi.mocked(authAPI.getAllUsers).mockRejectedValue(new Error('Network error'));

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Users & Staff Management')).toBeInTheDocument();
    });

    // Tables should be empty but the page still renders
    expect(screen.getByText('No doctors added yet')).toBeInTheDocument();
    expect(screen.getByText('No receptionists added yet')).toBeInTheDocument();
  });
});
