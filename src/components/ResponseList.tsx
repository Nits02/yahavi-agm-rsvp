import React, { useState } from 'react';
import { CheckCircle, Clock, XCircle, Download, Users, Building, Mail, Calendar } from 'lucide-react';
import { RSVPFormData } from '../types/form';

interface ResponseListProps {
  responses: RSVPFormData[];
}

export const ResponseList: React.FC<ResponseListProps> = ({ responses }) => {
  const [sortBy, setSortBy] = useState<'date' | 'flatNumber' | 'attendance'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'yes' | 'undecided' | 'no'>('all');

  const getAttendanceStats = () => {
    const stats = responses.reduce((acc, response) => {
      acc[response.attendance] = (acc[response.attendance] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: responses.length,
      yes: stats.yes || 0,
      undecided: stats.undecided || 0,
      no: stats.no || 0
    };
  };

  const getSortedAndFilteredResponses = () => {
    let filtered = responses;
    
    if (filterBy !== 'all') {
      filtered = responses.filter(r => r.attendance === filterBy);
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        case 'flatNumber':
          return a.fullFlatNumber.localeCompare(b.fullFlatNumber);
        case 'attendance':
          const order = { yes: 0, undecided: 1, no: 2 };
          return order[a.attendance] - order[b.attendance];
        default:
          return 0;
      }
    });
  };

  const exportToCSV = () => {
    const headers = ['Flat Number', 'Tower', 'Wing', 'Floor', 'Flat', 'Email', 'Attendance', 'Submitted At'];
    const csvContent = [
      headers.join(','),
      ...responses.map(r => [
        r.fullFlatNumber,
        r.tower,
        r.wing,
        r.floor,
        r.flatNumber,
        r.email,
        r.attendance,
        new Date(r.submittedAt).toLocaleString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `yahavi_agm_rsvp_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const getAttendanceIcon = (status: string) => {
    switch (status) {
      case 'yes': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'undecided': return <Clock className="w-4 h-4 text-amber-600" />;
      case 'no': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  const getAttendanceLabel = (status: string) => {
    switch (status) {
      case 'yes': return 'Attending';
      case 'undecided': return 'Undecided';
      case 'no': return 'Not Attending';
      default: return status;
    }
  };

  const stats = getAttendanceStats();
  const filteredResponses = getSortedAndFilteredResponses();

  if (responses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Responses Yet</h3>
        <p className="text-gray-500">RSVP responses will appear here once residents start submitting the form.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">RSVP Responses</h3>
            <p className="text-gray-600">Total responses: {responses.length}</p>
          </div>
          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center mt-1">
              <Users className="w-4 h-4 mr-1" />
              Total
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.yes}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center mt-1">
              <CheckCircle className="w-4 h-4 mr-1" />
              Attending
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">{stats.undecided}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center mt-1">
              <Clock className="w-4 h-4 mr-1" />
              Undecided
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.no}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center mt-1">
              <XCircle className="w-4 h-4 mr-1" />
              Not Attending
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Submission Date</option>
              <option value="flatNumber">Flat Number</option>
              <option value="attendance">Attendance Status</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by:</label>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Responses</option>
              <option value="yes">Attending Only</option>
              <option value="undecided">Undecided Only</option>
              <option value="no">Not Attending Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Responses List */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Building className="w-4 h-4 inline mr-1" />
                Flat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Mail className="w-4 h-4 inline mr-1" />
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Users className="w-4 h-4 inline mr-1" />
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Calendar className="w-4 h-4 inline mr-1" />
                Submitted
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredResponses.map((response) => (
              <tr key={response.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {response.fullFlatNumber}
                  </div>
                  <div className="text-sm text-gray-500">
                    Tower {response.tower}, Wing {response.wing}, Floor {response.floor === 'G' ? 'Ground' : response.floor}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{response.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getAttendanceIcon(response.attendance)}
                    <span className={`ml-2 text-sm font-medium ${
                      response.attendance === 'yes' ? 'text-green-800' :
                      response.attendance === 'undecided' ? 'text-amber-800' :
                      'text-red-800'
                    }`}>
                      {getAttendanceLabel(response.attendance)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(response.submittedAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(response.submittedAt).toLocaleTimeString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredResponses.length === 0 && filterBy !== 'all' && (
        <div className="p-8 text-center">
          <p className="text-gray-500">No responses found for the selected filter.</p>
        </div>
      )}
    </div>
  );
};