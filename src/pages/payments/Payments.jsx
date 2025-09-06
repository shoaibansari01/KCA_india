import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Download, CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';
import Table from '../../components/ui/Table';
import { paymentService } from '../../services/paymentService';
import { format } from 'date-fns';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);

  useEffect(() => {
    fetchPayments();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getPayments(currentPage, 10, searchTerm, statusFilter);
      setPayments(response.data || []);
      setTotalPages(1);
      setTotalPayments(response.data?.length || 0);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const getPaymentStatus = (payment) => {
    if (payment.razorpay_payment_id) {
      return 'completed';
    } else if (payment.razorpay_order_id) {
      return 'pending';
    } else {
      return 'failed';
    }
  };

  const PaymentStatusBadge = ({ payment }) => {
    const status = getPaymentStatus(payment);
    
    const statusConfig = {
      completed: {
        icon: CheckCircle,
        className: 'bg-green-100 text-green-800',
        label: 'Completed'
      },
      pending: {
        icon: Clock,
        className: 'bg-yellow-100 text-yellow-800',
        label: 'Pending'
      },
      failed: {
        icon: XCircle,
        className: 'bg-red-100 text-red-800',
        label: 'Failed'
      }
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getParticipationType = (payment) => {
    if (payment.school_participation) return 'School';
    if (payment.Individual_participation) return 'Individual';
    return 'Unknown';
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600">Manage all payment transactions</p>
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
                placeholder="Search by order ID, payment ID, or user..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <button className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{totalPayments}</p>
            <p className="text-sm text-gray-500">Total Payments</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{payments.filter(p => getPaymentStatus(p) === 'completed').length}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{payments.filter(p => getPaymentStatus(p) === 'pending').length}</p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{payments.filter(p => getPaymentStatus(p) === 'failed').length}</p>
            <p className="text-sm text-gray-500">Failed</p>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <Table>
              <Table.Header>
                <Table.HeaderCell>Payment Details</Table.HeaderCell>
                <Table.HeaderCell>User</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Amount</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Header>
              <Table.Body>
                {payments.map((payment) => (
                  <Table.Row key={payment._id || payment.id}>
                    <Table.Cell>
                      <div>
                        <p className="font-medium text-gray-900 flex items-center">
                          <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                          {payment.order_id || 'N/A'}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {payment.razorpay_payment_id || 'No payment ID'}
                        </p>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div>
                        <p className="text-gray-900">
                          {payment.user_id?.name || 'Unknown User'}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {payment.user_id?.email || 'No email'}
                        </p>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          payment.school_participation ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {getParticipationType(payment)}
                        </span>
                        {payment.isNational && (
                          <span className="ml-1 px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                            National
                          </span>
                        )}
                        {payment.isGlobal && (
                          <span className="ml-1 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                            Global
                          </span>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <p className="text-gray-900 font-medium">
                        {formatAmount(payment.amount || 0)}
                      </p>
                      {payment.art_Work_select && (
                        <p className="text-gray-500 text-sm">
                          {payment.art_Work_select} artworks
                        </p>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <PaymentStatusBadge payment={payment} />
                    </Table.Cell>
                    <Table.Cell>
                      <p className="text-gray-900">
                        {payment.created_at ? format(new Date(payment.created_at), 'MMM dd, yyyy') : 'N/A'}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {payment.created_at ? format(new Date(payment.created_at), 'HH:mm') : ''}
                      </p>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                          <Download className="w-4 h-4" />
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

export default Payments;