import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';

const AllRounderPaymentReceipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAllRounderReceipts();
  }, []);

  const fetchAllRounderReceipts = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getAllRounderPaymentReceipts();
      console.log('All-Rounder receipts response:', response);
      
      if (response.success && response.data) {
        console.log('All-Rounder receipts data:', response.data);
        // Sort by latest first (newest submissions at top)
        const sortedReceipts = response.data.sort((a, b) => {
          const dateA = new Date(a.created_at || a.createdAt);
          const dateB = new Date(b.created_at || b.createdAt);
          return dateB - dateA; // Descending order (latest first)
        });
        setReceipts(sortedReceipts);
        setError(null);
      } else {
        setError('Failed to fetch All-Rounder payment receipts');
        setReceipts([]);
      }
    } catch (err) {
      console.error('Error fetching All-Rounder receipts:', err);
      setError('Failed to fetch All-Rounder payment receipts');
      setReceipts([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (receipt) => {
    console.log('Opening modal for receipt:', receipt);
    setSelectedReceipt(receipt);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReceipt(null);
  };

  const getReceiptImageUrl = (filePath) => {
    // Use the same S3 bucket URL as school payment receipts
    const baseUrl = 'https://kca-bucket.s3.ap-south-1.amazonaws.com/';
    return `${baseUrl}${filePath}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Status removed - not needed
  // const getStatusBadge = (status) => {
  //   const statusColors = {
  //     pending: 'bg-yellow-100 text-yellow-800',
  //     approved: 'bg-green-100 text-green-800', 
  //     rejected: 'bg-red-100 text-red-800'
  //   };
  //   
  //   return (
  //     <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || statusColors.pending}`}>
  //       {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending'}
  //     </span>
  //   );
  // };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={fetchAllRounderReceipts}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All-Rounder Payment Receipts</h1>
          <p className="text-gray-600">All-Rounder Contest payment receipts submitted by participants</p>
        </div>
        <button 
          onClick={fetchAllRounderReceipts}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          Refresh
        </button>
      </div>

      {receipts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No receipts found</h3>
            <p className="mt-1 text-sm text-gray-500">No All-Rounder payment receipts have been submitted yet.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {receipts.map((receipt, index) => (
              <li key={receipt._id || index}>
                <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {receipt.participant_details?.name_of_participant || 'N/A'}
                        </p>
                        <div className="flex items-center mt-1 space-x-4">
                          <p className="text-sm text-gray-500">
                            School: {receipt.participant_details?.school_name || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Total: {receipt.total_fee || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Talents: {receipt.talent_count || 0}
                          </p>
                        </div>
                        <div className="mt-1">
                          <p className="text-xs text-gray-400">
                            Submitted: {formatDate(receipt.created_at || receipt.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openModal(receipt)}
                          className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedReceipt && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-screen overflow-y-auto m-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">All-Rounder Receipt Details</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4 space-y-6">
              {/* Participant Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Participant Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{selectedReceipt.participant_details?.name_of_participant || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">School</label>
                    <p className="text-sm text-gray-900">{selectedReceipt.participant_details?.school_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Class</label>
                    <p className="text-sm text-gray-900">{selectedReceipt.participant_details?.class_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <p className="text-sm text-gray-900">{selectedReceipt.participant_details?.age || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Parent Name</label>
                    <p className="text-sm text-gray-900">{selectedReceipt.participant_details?.parent_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
                    <p className="text-sm text-gray-900">{selectedReceipt.participant_details?.whatsapp_number || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedReceipt.participant_details?.email_id || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <p className="text-sm text-gray-900">
                      {[
                        selectedReceipt.participant_details?.city,
                        selectedReceipt.participant_details?.dist,
                        selectedReceipt.participant_details?.state
                      ].filter(Boolean).join(', ') || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Selected Talents */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Selected Talents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedReceipt.talent_categories && Array.isArray(selectedReceipt.talent_categories) && selectedReceipt.talent_categories.length > 0 ? (
                    selectedReceipt.talent_categories.map((talent, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                        <span className="text-sm text-gray-900">{String(talent)}</span>
                        <span className="text-sm text-gray-500">₹50</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No talents selected</p>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">Total ({selectedReceipt.talent_count || 0} talents)</span>
                    <span className="text-lg font-bold text-purple-600">{selectedReceipt.total_fee || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Payment Receipt */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Receipt</h3>
                {selectedReceipt.receipt_file_path ? (
                  <div className="border rounded-lg p-4">
                    <img
                      src={getReceiptImageUrl(selectedReceipt.receipt_file_path)}
                      alt="Payment Receipt"
                      className="max-w-full h-auto rounded"
                      onError={(e) => {
                        console.log('Image load error for path:', selectedReceipt.receipt_file_path);
                        console.log('Attempted URL:', getReceiptImageUrl(selectedReceipt.receipt_file_path));
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div style={{ display: 'none' }} className="text-center py-8 text-gray-500">
                      <p>Could not load payment receipt image</p>
                      <p className="text-sm mt-1">Path: {selectedReceipt.receipt_file_path}</p>
                      <p className="text-sm mt-1">URL: {getReceiptImageUrl(selectedReceipt.receipt_file_path)}</p>
                    </div>
                    <a
                      href={getReceiptImageUrl(selectedReceipt.receipt_file_path)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 mt-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      View Full Size
                    </a>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No payment receipt uploaded</p>
                )}
              </div>

              {/* Submission Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Submission Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Submitted At</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedReceipt.created_at || selectedReceipt.createdAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User ID</label>
                    <p className="text-sm text-gray-900">
                      {typeof selectedReceipt.user_id === 'object' 
                        ? selectedReceipt.user_id?._id || selectedReceipt.user_id?.id || 'N/A'
                        : selectedReceipt.user_id || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Registration ID</label>
                    <p className="text-sm text-gray-900">
                      {typeof selectedReceipt.registration_form_id === 'object'
                        ? selectedReceipt.registration_form_id?._id || selectedReceipt.registration_form_id?.id || 'N/A'
                        : selectedReceipt.registration_form_id || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllRounderPaymentReceipts;