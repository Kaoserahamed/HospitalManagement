import React, { useState } from 'react';
import { useLogin } from './hooks';
import { Card, Button, Input, Alert } from '../../components/ui';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password }, {
      onSuccess: (data: any) => {
        localStorage.setItem('token', data.access_token);
        window.location.href = '/dashboard';
      },
    });
  };

  return (
    <div className="auth-page">
      <Card title="Login">
        {loginMutation.isError ? <Alert variant="error">Invalid credentials</Alert> : null}
        <form onSubmit={handleSubmit}>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" loading={loginMutation.isPending}>
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
