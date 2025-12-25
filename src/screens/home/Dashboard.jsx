const Dashboard = () => {
  const { user, userProfile, signOut, updateProfile } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    const result = await getAllDocuments('users');
    if (result.success) {
      setUsers(result.data);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div style={styles.dashboard}>
      <div style={styles.header}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>
      
      <div style={styles.profileCard}>
        <h2>Welcome, {userProfile?.displayName}!</h2>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>User Type:</strong> {userProfile?.userType}</p>
        <p><strong>UID:</strong> {user?.uid}</p>
      </div>
      
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3>All Users</h3>
          <button onClick={loadUsers} style={styles.refreshButton}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
        
        {users.length === 0 ? (
          <p>No users found. Click refresh to load.</p>
        ) : (
          <div style={styles.userList}>
            {users.map((u) => (
              <div key={u.id} style={styles.userCard}>
                <p><strong>{u.displayName}</strong></p>
                <p>{u.email}</p>
                <p style={styles.userType}>{u.userType}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component
const AppContent = () => {
  const { user, loading } = useAuth();
  const [screen, setScreen] = useState('login');

  if (loading) {
    return (
      <div style={styles.loading}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  return screen === 'login' ? (
    <LoginScreen onNavigate={setScreen} />
  ) : (
    <SignupScreen onNavigate={setScreen} />
  );
};

// Main App with Provider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// Styles
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '10px'
  },
  googleButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#DB4437',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '15px'
  },
  link: {
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline'
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '15px'
  },
  dashboard: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  profileCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    marginBottom: '30px'
  },
  section: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  refreshButton: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  userList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '15px'
  },
  userCard: {
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9'
  },
  userType: {
    color: '#666',
    fontSize: '14px',
    marginTop: '5px'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh'
  }
};