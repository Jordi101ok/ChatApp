import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setBusy(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed.');
        } finally {
            setBusy(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Sign in</h1>

            {error && <p style={{ color: 'crimson' }}>{error}</p>}

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            />

            <button type="submit" disabled={busy}>
                {busy ? 'Signing in…' : 'Sign in'}
            </button>

            <p>
                No account? <Link to="/register">Create one</Link>
            </p>
        </form>
    );
}
