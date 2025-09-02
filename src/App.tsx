import React, { useState } from 'react';
import { RSVPForm } from './components/RSVPForm';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';
import { useRSVPData } from './hooks/useRSVPData';
import { Building2, Users, Calendar } from 'lucide-react';

// Admin password - in production, this should be handled securely
const ADMIN_PASSWORD = 'yahavi2025';

function App() {
  const {
    responses,
    isLoading,
    error,
    addResponse,
    getExistingEmails,
    getAttendanceStats
  } = useRSVPData();

  const [showSuccess, setShowSuccess] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleFormSubmit = async (newResponse: any) => {
    try {
      await addResponse(newResponse);
      setShowSuccess(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Error submitting RSVP:', err);
      // Handle error appropriately
    }
  };

  const handleAdminLogin = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      setAdminLoginError('');
    } else {
      setAdminLoginError('Invalid password. Please try again.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setShowAdminLogin(false);
    setAdminLoginError('');
  };

  // Show admin panel if authenticated
  if (isAdminAuthenticated) {
    return <AdminPanel responses={responses} onLogout={handleAdminLogout} />;
  }

  // Show admin login if requested
  if (showAdminLogin) {
    return <AdminLogin onLogin={handleAdminLogin} error={adminLoginError} />;
  }

  const stats = getAttendanceStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading RSVP system...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading RSVP system: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Yahavi Society</h1>
                <p className="text-sm text-gray-500">AGM RSVP System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {responses.length > 0 && (
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{stats.total} Responses</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{stats.yes} Attending</span>
                  </div>
                </div>
              )}
              
              <button
                onClick={() => setShowAdminLogin(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <Users className="w-4 h-4 mr-2" />
                Admin
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Success Message */}
      {showSuccess && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <Building2 className="w-5 h-5 mr-2" />
            <span className="font-medium">RSVP submitted successfully!</span>
            <span className="ml-2">Thank you for confirming your attendance.</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Annual General Meeting | 21st Sep 2025</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please confirm your attendance for the upcoming AGM. Your response helps us arrange 
            the necessary logistics and seating arrangements.
          </p>
          
          {responses.length > 0 && (
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-blue-50 rounded-full">
              <Users className="w-4 h-4 mr-2 text-blue-600" />
              <span className="text-blue-800 font-medium">
                {stats.total} residents have already responded
              </span>
            </div>
          )}
        </div>

        <RSVPForm 
          onSubmit={handleFormSubmit} 
          existingEmails={getExistingEmails} 
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 Yahavi Society. AGM RSVP System.</p>
            <p className="mt-1">For support, contact your building management.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;