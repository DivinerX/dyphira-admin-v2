import React, { useState } from 'react';
import { User } from '../types';
import { ChevronRight, Twitter } from 'lucide-react';

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    referredBy: 'jane@example.com',
    createdAt: '2024-02-15T10:30:00Z',
    referralCount: 5,
    xp: 1200,
    credits: 500,
    twitterConnected: true,
    twitterHandle: 'johndoe'
  },
  // Add more mock users as needed
];

export const UserList: React.FC<{ onUserSelect: (user: User) => void }> = ({ onUserSelect }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState('1');
  const usersPerPage = 10;
  const totalPages = Math.ceil(MOCK_USERS.length / usersPerPage);

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNumber = parseInt(inputPage, 10);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Referred By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stats</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Twitter</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {MOCK_USERS.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-800 cursor-pointer"
                onClick={() => onUserSelect(user)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.referredBy || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-4">
                    <span className="text-yellow-400">XP: {user.xp}</span>
                    <span className="text-green-400">Credits: {user.credits}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {user.twitterConnected ? (
                    <Twitter className="h-5 w-5 text-blue-400" />
                  ) : (
                    <span className="text-gray-500">Not connected</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <ChevronRight className="h-5 w-5" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-400">
          Showing {(currentPage - 1) * usersPerPage + 1} to {Math.min(currentPage * usersPerPage, MOCK_USERS.length)} of {MOCK_USERS.length} users
        </div>
        <div className="flex items-center space-x-4">
          <form onSubmit={handlePageSubmit} className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              max={totalPages}
              value={inputPage}
              onChange={(e) => setInputPage(e.target.value)}
              className="w-16 px-2 py-1 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
            />
            <span className="text-gray-400">of {totalPages}</span>
            <button
              type="submit"
              className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
            >
              Go
            </button>
          </form>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setCurrentPage(p => Math.max(1, p - 1));
                setInputPage(String(Math.max(1, currentPage - 1)));
              }}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-700 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => {
                setCurrentPage(p => Math.min(totalPages, p + 1));
                setInputPage(String(Math.min(totalPages, currentPage + 1)));
              }}
              disabled={currentPage * usersPerPage >= MOCK_USERS.length}
              className="px-4 py-2 border border-gray-700 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};