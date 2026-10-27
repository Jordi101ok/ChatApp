import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }

        setBusy(true);

        try {
            await register(email, password, fullName);
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed.');
        } finally {
            setBusy(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Create account</h1>

            {error && <p style={{ color: 'crimson' }}>{error}</p>}

            <input
                placeholder="Full name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
            />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />

            <input
                type="password"
                placeholder="Password (min 8 characters)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                minLength={8}
                required
            />

            <input
                type="password"
                placeholder="Confirm password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
            />

            <button type="submit" disabled={busy}>
                {busy ? 'Creating…' : 'Create account'}
            </button>

            <p>
                Already have an account? <Link to="/login">Sign in</Link>
            </p>
        </form>
    );
}
