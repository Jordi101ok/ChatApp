import { useAuth } from '../auth/AuthContext';

export default function Home() {
    const { user, logout } = useAuth();

    return (
        <div>
            <h1>ChatApp</h1>
            <p>Signed in as {user?.fullName} ({user?.email})</p>
            <button onClick={logout}>Sign out</button>
        </div>
    );
}
