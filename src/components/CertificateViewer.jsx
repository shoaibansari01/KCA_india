import React, { useState } from 'react';
import { X, Download, User, School, Calendar, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const CertificateViewer = ({ isOpen, onClose, certificates, studentName, schoolName, sentDate, sentBy }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Debug logging
  React.useEffect(() => {
    if (isOpen) {
      console.log('CertificateViewer opened with:', {
        certificates,
        certificatesCount: certificates?.length,
        schoolName,
        sentDate,
        sentBy
      });
    }
  }, [isOpen, certificates, schoolName, sentDate, sentBy]);

  if (!isOpen || !certificates || certificates.length === 0) {
    console.log('CertificateViewer not showing - conditions:', {
      isOpen,
      certificates: certificates?.length || 0,
      hasData: !!certificates
    });
    return null;
  }

  const currentCertificate = certificates[currentIndex];
  
  if (!currentCertificate) {
    console.error('No current certificate found at index:', currentIndex);
    return null;
  }

  const handleDownload = async (certificateUrl, fileName) => {
    try {
      console.log('Attempting to download certificate:', { certificateUrl, fileName });
      
      // First try to fetch the image to check if it exists
      const response = await fetch(certificateUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Create blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'certificate.png';
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Certificate downloaded successfully!');
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error('Failed to download certificate. Please try again.');
      
      // Fallback: try direct link download
      try {
        const link = document.createElement('a');
        link.href = certificateUrl;
        link.target = '_blank';
        link.download = fileName || 'certificate.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (fallbackError) {
        console.error('Fallback download also failed:', fallbackError);
      }
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : certificates.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < certificates.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50 rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Award className="w-6 h-6 text-purple-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Certificate Viewer</h2>
              <p className="text-sm text-gray-600">
                {certificates.length > 1 
                  ? `Viewing ${currentIndex + 1} of ${certificates.length} certificates`
                  : 'Certificate Preview'
                }
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Certificate Info */}
        <div className="p-4 border-b bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-gray-500">Student</p>
                <p className="font-medium text-gray-900">{currentCertificate.student_name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <School className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-gray-500">School</p>
                <p className="font-medium text-gray-900">{schoolName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-gray-500">Sent Date</p>
                <p className="font-medium text-gray-900">{sentDate}</p>
                <p className="text-xs text-gray-500">By: {sentBy}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Image Display */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="text-center">
            <div className="relative inline-block">
              <img
                src={currentCertificate.certificate_url}
                alt={`Certificate for ${currentCertificate.student_name}`}
                className="max-w-full max-h-[60vh] rounded-lg shadow-lg border bg-white"
                style={{ 
                  objectFit: 'contain',
                  minHeight: '300px',
                  minWidth: '400px'
                }}
                onLoad={(e) => {
                  console.log('Certificate image loaded successfully:', currentCertificate.certificate_url);
                }}
                onError={(e) => {
                  console.error('Failed to load certificate image:', currentCertificate.certificate_url);
                  console.error('Image error event:', e);
                  
                  // Create a better fallback image
                  const canvas = document.createElement('canvas');
                  canvas.width = 800;
                  canvas.height = 600;
                  const ctx = canvas.getContext('2d');
                  
                  // Draw fallback certificate
                  ctx.fillStyle = '#f9fafb';
                  ctx.fillRect(0, 0, canvas.width, canvas.height);
                  
                  // Draw border
                  ctx.strokeStyle = '#d1d5db';
                  ctx.lineWidth = 2;
                  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
                  
                  // Draw text
                  ctx.fillStyle = '#374151';
                  ctx.font = 'bold 24px Arial';
                  ctx.textAlign = 'center';
                  ctx.fillText('Certificate Image Not Available', canvas.width / 2, canvas.height / 2 - 50);
                  
                  ctx.font = '16px Arial';
                  ctx.fillText(`Student: ${currentCertificate.student_name}`, canvas.width / 2, canvas.height / 2);
                  ctx.fillText(`File: ${currentCertificate.file_name}`, canvas.width / 2, canvas.height / 2 + 30);
                  ctx.fillText('Please try downloading the certificate', canvas.width / 2, canvas.height / 2 + 80);
                  
                  e.target.src = canvas.toDataURL();
                }}
              />
              
              {/* Navigation Arrows for Multiple Certificates */}
              {certificates.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Certificate Info Below Image */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg inline-block">
              <h3 className="font-medium text-gray-900 mb-2">
                Certificate for: {currentCertificate.student_name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                File: {currentCertificate.file_name}
              </p>
              <p className="text-xs text-gray-500">
                Generated: {new Date(currentCertificate.uploaded_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="flex items-center space-x-4">
            {certificates.length > 1 && (
              <div className="flex items-center space-x-2">
                {certificates.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                console.log('Current certificate URL:', currentCertificate.certificate_url);
                window.open(currentCertificate.certificate_url, '_blank');
              }}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Open URL
            </button>
            
            <button
              onClick={() => handleDownload(currentCertificate.certificate_url, currentCertificate.file_name)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Current
            </button>
            
            {certificates.length > 1 && (
              <button
                onClick={() => {
                  certificates.forEach(cert => {
                    setTimeout(() => handleDownload(cert.certificate_url, cert.file_name), 100);
                  });
                }}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download All ({certificates.length})
              </button>
            )}
            
            <button
              onClick={onClose}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateViewer;