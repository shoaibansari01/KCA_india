import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Download, Receipt, School, User, Calendar, ImageIcon } from 'lucide-react';
import { paymentReceiptService } from '../../services/paymentReceiptService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const PaymentReceipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    fetchPaymentReceipts();
  }, []);

  const fetchPaymentReceipts = async () => {
    try {
      setLoading(true);
      const response = await paymentReceiptService.getPaymentReceipts();
      setReceipts(response.data || []);
    } catch (error) {
      console.error('Error fetching payment receipts:', error);
      toast.error('Failed to load payment receipts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredReceipts = receipts.filter(receipt =>
    receipt.registration_form_id?.school_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.user_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.user_id?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewReceipt = (receipt) => {
    setSelectedReceipt(receipt);
    setShowViewModal(true);
  };

  const getReceiptImageUrl = (filePath) => {
    // Assuming the file path is stored without the full URL
    const baseUrl = 'https://kca-bucket.s3.ap-south-1.amazonaws.com/';
    return `${baseUrl}${filePath}`;
  };

  const formatCurrency = (amount) => {
    // Handle different data types and convert to number
    let numericAmount = 0;
    
    if (typeof amount === 'string') {
      // Remove currency symbols and parse
      numericAmount = parseFloat(amount.replace(/[₹,]/g, '')) || 0;
    } else if (typeof amount === 'number') {
      numericAmount = amount || 0;
    }
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(numericAmount);
  };

  const ViewModal = () => {
    if (!showViewModal || !selectedReceipt) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Payment Receipt Details</h2>
            <button
              onClick={() => setShowViewModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Receipt Image */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Receipt className="w-5 h-5 mr-2" />
                  Payment Receipt
                </h3>
                <div className="border rounded-lg p-4">
                  {selectedReceipt.receipt_file_path ? (
                    <img
                      src={getReceiptImageUrl(selectedReceipt.receipt_file_path)}
                      alt="Payment Receipt"
                      className="w-full h-auto rounded-lg shadow-md"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>';
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                      <span className="ml-2 text-gray-500">No receipt image</span>
                    </div>
                  )}
                </div>
                <a
                  href={getReceiptImageUrl(selectedReceipt.receipt_file_path)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Full Size
                </a>
              </div>

              {/* Receipt Details */}
              <div className="space-y-6">
                {/* School Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <School className="w-5 h-5 mr-2" />
                    School Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">School Name</label>
                      <p className="text-gray-900">{selectedReceipt.registration_form_id?.school_name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Principal Name</label>
                      <p className="text-gray-900">{selectedReceipt.registration_form_id?.principal_name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">School Email</label>
                      <p className="text-gray-900">{selectedReceipt.registration_form_id?.email_of_school || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">School Contact</label>
                      <p className="text-gray-900">{selectedReceipt.registration_form_id?.contact_number_of_school || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* User Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Submitted By
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Name</label>
                      <p className="text-gray-900">{selectedReceipt.user_id?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-900">{selectedReceipt.user_id?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Mobile</label>
                      <p className="text-gray-900">{selectedReceipt.user_id?.mobile_number || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Class Data & Fees */}
                {selectedReceipt.class_data && selectedReceipt.class_data.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Class-wise Fee Details</h3>
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee/Student</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedReceipt.class_data.map((classItem, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 text-sm text-gray-900">{classItem.className}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{classItem.no_of_student}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(classItem.fees)}</td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(classItem.total)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                          <tr>
                            <td colSpan="3" className="px-4 py-3 text-sm font-medium text-gray-900 text-right">Total Amount:</td>
                            <td className="px-4 py-3 text-sm font-bold text-blue-600">
                              {selectedReceipt.total_fee ? formatCurrency(selectedReceipt.total_fee) : 
                               selectedReceipt.class_data ? 
                               formatCurrency(selectedReceipt.class_data.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0)) :
                               '₹0'}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}

                {/* Submission Date */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Submission Details
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Submitted On</label>
                    <p className="text-gray-900">
                      {selectedReceipt.created_at ? format(new Date(selectedReceipt.created_at), 'PPpp') : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Receipts</h1>
          <p className="text-gray-600">View all uploaded school payment receipts</p>
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
                placeholder="Search by school name, user name, or email..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex gap-6 text-sm text-gray-600">
          <span>Total Receipts: <span className="font-medium text-gray-900">{filteredReceipts.length}</span></span>
        </div>
      </div>

      {/* Receipts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))
        ) : filteredReceipts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Payment Receipts Found</h3>
            <p className="text-gray-600">No payment receipts have been uploaded yet.</p>
          </div>
        ) : (
          filteredReceipts.map((receipt) => (
            <div key={receipt._id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
              {/* Receipt Image Preview */}
              <div className="h-32 bg-gray-100 flex items-center justify-center">
                {receipt.receipt_file_path ? (
                  <img
                    src={getReceiptImageUrl(receipt.receipt_file_path)}
                    alt="Receipt Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="flex items-center justify-center w-full h-full" style={{display: receipt.receipt_file_path ? 'none' : 'flex'}}>
                  <Receipt className="w-8 h-8 text-gray-400" />
                </div>
              </div>

              {/* Receipt Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate mb-2">
                  {receipt.registration_form_id?.school_name || 'Unknown School'}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  By: {receipt.user_id?.name || 'Unknown User'}
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  {receipt.created_at ? format(new Date(receipt.created_at), 'MMM dd, yyyy') : 'Unknown date'}
                </p>
                
                {(receipt.total_fee || (receipt.class_data && receipt.class_data.length > 0)) && (
                  <p className="text-lg font-bold text-blue-600 mb-3">
                    {receipt.total_fee ? formatCurrency(receipt.total_fee) : 
                     receipt.class_data ? 
                     formatCurrency(receipt.class_data.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0)) :
                     '₹0'}
                  </p>
                )}

                {/* Action Button */}
                <button
                  onClick={() => handleViewReceipt(receipt)}
                  className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Modal */}
      <ViewModal />
    </div>
  );
};

export default PaymentReceipts;