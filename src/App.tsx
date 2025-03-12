import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { UserList } from './components/UserList';
import { UserDetail } from './components/UserDetail';
import { User } from './types';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-white text-xl font-bold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-300 mr-4">{user?.email}</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedUser ? (
          <UserDetail user={selectedUser} onBack={() => setSelectedUser(null)} />
        ) : (
          <UserList onUserSelect={setSelectedUser} />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AppContent />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </AuthProvider>
    </Provider>
  );
}

function AppContent() {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <Dashboard /> : <LoginPage />;
}

export default App;