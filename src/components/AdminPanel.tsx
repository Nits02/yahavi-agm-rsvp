import React from 'react';
import { ResponseList } from './ResponseList';
import { RSVPFormData } from '../types/form';
import { LogOut, Shield, Building2 } from 'lucide-react';

interface AdminPanelProps {
  responses: RSVPFormData[];
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ responses, onLogout }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Yahavi (Oak | Pine | Teak) - Admin Panel</h1>
                <p className="text-sm text-gray-500">AGM RSVP Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                <Shield className="w-4 h-4 mr-1" />
                <span>Admin Access</span>
              </div>
              <button
                onClick={onLogout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ResponseList responses={responses} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 Yahavi (Oak | Pine | Teak). AGM RSVP Admin Panel.</p>
            <p className="mt-1">Confidential - For authorized personnel only.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};