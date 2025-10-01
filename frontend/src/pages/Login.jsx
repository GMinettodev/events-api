import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/UseAuth';
import Button from '../components/Button';
import FormInput from '../components/FormInput';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);

    try {
      await login(form);
      navigate(state?.from?.pathname || '/dashboard', { replace: true });
    } catch {
      setErr('Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card">
      <h1>Login</h1>
      {err && <p className="alert">{err}</p>}
      <form onSubmit={handleSubmit} className="form form--fullwidth">
        <FormInput
          label="E-mail"
          type="email"
          name="email"
          value={form.email}
          placeholder="user@mail.com"
          onChange={updateField}
          required
        />
        <FormInput
          label="Password"
          type="password"
          name="password"
          value={form.password}
          placeholder="••••••"
          onChange={updateField}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Enter'}
        </Button>
      </form>
    </section>
  );
}
