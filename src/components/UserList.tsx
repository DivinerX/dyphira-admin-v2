import React, { useEffect, useState } from 'react';
import { User } from '@/types';
import { ChevronRight } from 'lucide-react';
import { fetchUsers } from "@/redux/slices/users";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { RootState } from "@/redux/store";
import { TUserState } from "@/redux/slices/users";

export const UserList: React.FC<{ onUserSelect: (user: User) => void }> = ({ onUserSelect }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState('1');
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const { users } = useAppSelector((state: RootState) => state.users as TUserState);
  const usersPerPage = 10;

  const dispatch = useAppDispatch();

  useEffect(() => {
    setLoading(true);
    dispatch(fetchUsers())
      .then(() => {
        setLoading(false)
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(users.length / usersPerPage));
  }, [users]);

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
            {loading ? (
              Array(5).fill(0).map((_, index) => (
                <tr key={`skeleton-${index}`} className="animate-pulse">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-700 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-700 rounded w-32"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-700 rounded w-28"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-700 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-4">
                      <div className="h-4 bg-gray-700 rounded w-16"></div>
                      <div className="h-4 bg-gray-700 rounded w-20"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-700 rounded w-16"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-700 rounded w-4"></div>
                  </td>
                </tr>
              ))
            ) : (
              users.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage).map((user: User) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-800 cursor-pointer"
                  onClick={() => onUserSelect(user)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.referredBy?.email || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-4">
                      <span className="text-yellow-400">XP: {user?.xp || 0}</span>
                      <span className="text-green-400">Credits: {user.credits}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.twitterId ? (
                      <span className="text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </span>
                    ) : (
                      <span className="text-gray-500">Not connected</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <ChevronRight className="h-5 w-5" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-400">
          Showing {(currentPage - 1) * usersPerPage + 1} to {Math.min(currentPage * usersPerPage, users.length || 0)} of {users.length || 0} users
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
              disabled={currentPage * usersPerPage >= users.length || users.length === 0}
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