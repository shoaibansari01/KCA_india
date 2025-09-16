import React, { useState } from 'react';
import { Eye, Download, ChevronLeft, ChevronRight, Send } from 'lucide-react';

const CertificatePreviewModal = ({ showModal, onClose, certificates, onDownload, onSendCertificates, sendingCertificates }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCertificate = () => {
    setCurrentIndex((prev) => 
      prev < certificates.length - 1 ? prev + 1 : 0
    );
  };

  const previousCertificate = () => {
    setCurrentIndex((prev) => 
      prev > 0 ? prev - 1 : certificates.length - 1
    );
  };

  if (!showModal || certificates.length === 0) return null;

  const currentCert = certificates[currentIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-screen overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Eye className="w-6 h-6 mr-2 text-blue-600" />
              Certificate Preview
              {certificates.length > 1 && (
                <span className="ml-2 text-sm font-normal text-gray-600">
                  ({currentIndex + 1} of {certificates.length})
                </span>
              )}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="px-6 py-4">
          {/* Certificate Info */}
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">Certificate Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-yellow-700">Participant:</span>
                <p className="text-gray-900">{currentCert?.participantName}</p>
              </div>
              <div>
                <span className="font-medium text-yellow-700">Best Performance in:</span>
                <p className="text-gray-900">{currentCert?.selectedTalent}</p>
              </div>
              <div>
                <span className="font-medium text-yellow-700">School:</span>
                <p className="text-gray-900">{currentCert?.schoolName}</p>
              </div>
            </div>
          </div>

          {/* Certificate Image with Navigation */}
          <div className="text-center relative">
            {/* Navigation buttons */}
            {certificates.length > 1 && (
              <>
                <button
                  onClick={previousCertificate}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextCertificate}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            
            <div className="inline-block border-4 border-yellow-300 rounded-lg shadow-lg overflow-hidden">
              {currentCert?.imageUrl && (
                <img
                  src={currentCert.imageUrl}
                  alt="Certificate Preview"
                  className="max-w-full h-auto"
                  style={{ maxHeight: '500px' }}
                />
              )}
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close Preview
          </button>
          <div className="flex space-x-3">
            <button
              onClick={() => onDownload(currentCert)}
              className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg hover:from-yellow-600 hover:to-orange-700 transition-all duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Current
            </button>
            <button
              onClick={() => onSendCertificates && onSendCertificates(certificates)}
              className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!onSendCertificates || sendingCertificates}
            >
              {sendingCertificates ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send All Certificates
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreviewModal;