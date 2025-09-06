import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, Ban, CheckCircle, Eye } from 'lucide-react';
import Table from '../../components/ui/Table';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getUsers(currentPage, 10, searchTerm);
      setUsers(response.data || []);
      // Backend doesn't return pagination info, so we'll show all users
      setTotalPages(1);
      setTotalUsers(response.data?.length || 0);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestrictUser = async (userId, isRestricted) => {
    try {
      await userService.restrictUser(userId, !isRestricted);
      toast.success(`User ${!isRestricted ? 'restricted' : 'activated'} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const StatusBadge = ({ isActive, isVerified }) => {
    if (!isVerified) {
      return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Unverified</span>;
    }
    if (!isActive) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Restricted</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage all registered users</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <button className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>

        {/* Stats */}
        <div className="mt-4 flex gap-6 text-sm text-gray-600">
          <span>Total Users: <span className="font-medium text-gray-900">{totalUsers}</span></span>
          <span>Active: <span className="font-medium text-green-600">{users.filter(u => u.is_active && u.isVerified).length}</span></span>
          <span>Restricted: <span className="font-medium text-red-600">{users.filter(u => !u.is_active).length}</span></span>
          <span>Unverified: <span className="font-medium text-yellow-600">{users.filter(u => !u.isVerified).length}</span></span>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <Table>
              <Table.Header>
                <Table.HeaderCell>User</Table.HeaderCell>
                <Table.HeaderCell>Contact</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Joined</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Header>
              <Table.Body>
                {users.map((user) => (
                  <Table.Row key={user._id || user.id}>
                    <Table.Cell>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-medium text-sm">
                            {user.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div>
                        <p className="text-gray-900">{user.mobile_number}</p>
                        <p className="text-gray-500">{user.dialing_prefix}</p>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <StatusBadge isActive={user.is_active} isVerified={user.isVerified} />
                    </Table.Cell>
                    <Table.Cell>
                      <p className="text-gray-900">
                        {user.created_at ? format(new Date(user.created_at), 'MMM dd, yyyy') : 'N/A'}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {user.created_at ? format(new Date(user.created_at), 'HH:mm') : ''}
                      </p>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRestrictUser(user._id || user.id, user.is_active)}
                          className={`p-1 transition-colors ${
                            user.is_active
                              ? 'text-gray-400 hover:text-red-600'
                              : 'text-gray-400 hover:text-green-600'
                          }`}
                        >
                          {user.is_active ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Users;