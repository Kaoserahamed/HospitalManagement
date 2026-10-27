export interface User { id: number; email: string; role: string; is_active: boolean; created_at?: string; }
export interface LoginInput { email: string; password: string; }
export interface LoginResponse { access_token: string; token_type: string; user: User; }
export interface RegisterPatientInput { email: string; password: string; first_name: string; last_name: string; dob: string; }
export interface AuthState { user: User | null; token: string | null; isAuthenticated: boolean; }
export interface CreateUserInput { email: string; password: string; role: string; }
