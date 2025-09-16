import React, { useState, useEffect } from 'react';
import { Eye, Award, Users, Download, CheckCircle, Calendar, School } from 'lucide-react';
import toast from 'react-hot-toast';
import CertificatePreviewModal from './CertificatePreviewModal';
import { allRounderCertificateService } from '../../services/allRounderCertificateService';

const BestPerformanceCertificate = ({ allRounderData, allRounderLoading }) => {
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [generatedCertificates, setGeneratedCertificates] = useState([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewCertificates, setPreviewCertificates] = useState([]);
  const [sendingCertificates, setSendingCertificates] = useState(false);
  const [sentCertificates, setSentCertificates] = useState([]);
  const [loadingSentCertificates, setLoadingSentCertificates] = useState(false);
  const [showSentCertificates, setShowSentCertificates] = useState(true);

  useEffect(() => {
    fetchSentCertificates();
  }, []);

  const fetchSentCertificates = async () => {
    try {
      setLoadingSentCertificates(true);
      const response = await allRounderCertificateService.getAdminBestPerformanceCertificates(1, 50);
      if (response && response.data) {
        setSentCertificates(response.data.records || []);
      }
    } catch (error) {
      console.error('Error fetching sent certificates:', error);
      toast.error('Failed to fetch sent certificates');
    } finally {
      setLoadingSentCertificates(false);
    }
  };

  const handleParticipantSelection = (participantId, isSelected) => {
    if (isSelected) {
      const participant = allRounderData.find(p => p._id === participantId);
      if (participant) {
        setSelectedParticipants(prev => [...prev, participant]);
      }
    } else {
      setSelectedParticipants(prev => prev.filter(p => p._id !== participantId));
      setGeneratedCertificates(prev => prev.filter(cert => cert.participantId !== participantId));
    }
  };

  const handleTalentSelection = (participantId, selectedTalent) => {
    const participant = allRounderData.find(p => p._id === participantId);
    if (participant) {
      generateCertificate(participant, selectedTalent);
    }
  };

  const generateCertificate = (participant, talent) => {
    const certificateData = {
      participantId: participant._id,
      participantName: participant.participant_details?.name_of_participant || 'N/A',
      selectedTalent: talent,
      schoolName: participant.participant_details?.school_name || 'N/A',
      submissionDate: participant.created_at || participant.createdAt,
      generatedAt: new Date().toISOString()
    };

    setGeneratedCertificates(prev => {
      const existing = prev.find(cert => cert.participantId === participant._id);
      if (existing) {
        return prev.map(cert => 
          cert.participantId === participant._id ? certificateData : cert
        );
      } else {
        return [...prev, certificateData];
      }
    });
  };

  const generateCertificateCanvas = async (certificateData) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = 850;
      canvas.height = 600;
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Add participant name
          ctx.font = 'bold 14px Arial';
          ctx.fillStyle = '#000000';
          ctx.textAlign = 'center';
          ctx.fillText(certificateData.participantName, 510, 230);
          
          // Add talent/achievement
          ctx.font = 'bold 12px Arial';
          ctx.fillText(certificateData.selectedTalent, 540, 270);
          
          // Add month
          const submissionDate = new Date(certificateData.submissionDate || certificateData.generatedAt);
          const monthName = submissionDate.toLocaleDateString('en-US', { month: 'long' }).substring(0, 4);
          ctx.font = 'bold 18px Arial';
          ctx.fillText(monthName, 620, 315);
          
          resolve(canvas);
        } catch (error) {
          console.error('Error generating certificate canvas:', error);
          reject(error);
        }
      };
      
      img.onerror = () => {
        console.error('Failed to load certificate template');
        reject(new Error('Failed to load template'));
      };
      
      img.src = '/src/assets/All-Best-Performance-Award.jpg';
    });
  };

  const previewAllCertificates = async () => {
    try {
      const certificatesWithImages = [];
      for (const cert of generatedCertificates) {
        const canvas = await generateCertificateCanvas(cert);
        const dataURL = canvas.toDataURL('image/png');
        certificatesWithImages.push({ ...cert, imageUrl: dataURL });
      }
      setPreviewCertificates(certificatesWithImages);
      setShowPreviewModal(true);
    } catch (error) {
      console.error('Error previewing certificates:', error);
      toast.error('Failed to generate certificate previews');
    }
  };

  const downloadCertificate = async (certificateData) => {
    try {
      const canvas = await generateCertificateCanvas(certificateData);
      
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Best_Performance_Certificate_${certificateData.participantName.replace(/\s+/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success('Certificate downloaded successfully!');
      }, 'image/png');
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error('Failed to download certificate');
    }
  };

  const sendCertificatesToUsers = async (certificates) => {
    try {
      setSendingCertificates(true);
      
      // Prepare participant data
      const participantData = certificates.map(cert => ({
        participantId: cert.participantId,
        participantName: cert.participantName,
        selectedTalent: cert.selectedTalent,
        schoolName: cert.schoolName
      }));

      console.log('Sending participant data:', participantData);
      console.log('Number of certificates:', certificates.length);

      // Convert certificate images to files
      const certificateFiles = [];
      for (const cert of certificates) {
        const canvas = await generateCertificateCanvas(cert);
        
        // Convert canvas to blob
        const blob = await new Promise(resolve => {
          canvas.toBlob(resolve, 'image/png');
        });
        
        // Create file from blob
        const fileName = `Best_Performance_Certificate_${cert.participantName.replace(/\s+/g, '_')}.png`;
        const file = new File([blob], fileName, { type: 'image/png' });
        certificateFiles.push(file);
      }

      // Send certificates via API
      const response = await allRounderCertificateService.sendBestPerformanceCertificates(
        participantData, 
        certificateFiles
      );

      if (response && response.data) {
        toast.success(`Successfully sent ${certificateFiles.length} certificates to participants!`);
        setShowPreviewModal(false);
        
        // Refresh sent certificates list
        fetchSentCertificates();
      } else {
        throw new Error(response.message || 'Failed to send certificates');
      }

    } catch (error) {
      console.error('Error sending certificates:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to send certificates to participants');
    } finally {
      setSendingCertificates(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Participants Selection */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-600" />
            Select Participants for Best Performance Certificate
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Choose participants and their specific talent for which they deserve the Best Performance Award
          </p>
        </div>
        
        <div className="p-6">
          {allRounderLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
            </div>
          ) : allRounderData.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No participants found</h3>
              <p className="mt-1 text-sm text-gray-500">No All Rounder participants available for certificate generation.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allRounderData.map((participant, index) => {
                const isSelected = selectedParticipants.some(p => p._id === participant._id);
                const generatedCert = generatedCertificates.find(cert => cert.participantId === participant._id);
                
                return (
                  <div key={participant._id || index} className={`border rounded-xl p-6 transition-all duration-300 shadow-sm hover:shadow-md ${isSelected ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-yellow-100' : 'border-gray-200 hover:border-yellow-300 bg-white'}`}>
                    {/* Checkbox and Status */}
                    <div className="flex items-center justify-between mb-4">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          id={`participant-${participant._id}`}
                          checked={isSelected}
                          onChange={(e) => handleParticipantSelection(participant._id, e.target.checked)}
                          className="h-5 w-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Select for Award</span>
                      </label>
                      {generatedCert && (
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-green-600 font-medium">Certificate Ready</span>
                        </div>
                      )}
                    </div>

                    {/* Participant Info */}
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        {participant.participant_details?.name_of_participant || 'N/A'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {participant.participant_details?.school_name || 'N/A'}
                      </p>
                      <div className="mt-2 inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {participant.talent_categories?.length || 0} Talents
                      </div>
                    </div>
                    
                    {/* Talent Selection */}
                    {isSelected && (
                      <div className="border-t pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                          Select Best Performance Talent:
                        </label>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {participant.talent_categories && Array.isArray(participant.talent_categories) && participant.talent_categories.length > 0 ? (
                            participant.talent_categories.map((talent, idx) => (
                              <label key={idx} className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-yellow-50 cursor-pointer transition-colors">
                                <input
                                  type="radio"
                                  name={`talent-${participant._id}`}
                                  value={talent}
                                  checked={generatedCert?.selectedTalent === talent}
                                  onChange={() => handleTalentSelection(participant._id, talent)}
                                  className="h-4 w-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                                />
                                <span className="text-sm text-gray-900 flex-1">{String(talent)}</span>
                              </label>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 text-center py-2">No talents available</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Generated Certificates */}
      {generatedCertificates.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-green-600" />
                  Generated Certificates ({generatedCertificates.length})
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Preview and download the generated Best Performance certificates
                </p>
              </div>
              <button
                onClick={previewAllCertificates}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview All
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {generatedCertificates.map((cert) => (
                <div key={cert.participantId} className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-yellow-50 to-orange-50">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{cert.participantName}</h4>
                    <p className="text-sm text-gray-600 mb-2">Best Performance in: <span className="font-medium text-yellow-700">{cert.selectedTalent}</span></p>
                    <p className="text-xs text-gray-500 mb-4">School: {cert.schoolName}</p>
                    
                    <button
                      onClick={() => downloadCertificate(cert)}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-sm font-medium rounded-lg hover:from-yellow-600 hover:to-orange-700 transition-all duration-200 shadow-sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sent Certificates Section */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Sent Certificates ({sentCertificates.length})
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                View all previously sent Best Performance certificates
              </p>
            </div>
            <button
              onClick={() => setShowSentCertificates(!showSentCertificates)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showSentCertificates ? 'Hide' : 'Show'} Sent Certificates
            </button>
          </div>
        </div>
        
        {showSentCertificates && (
          <div className="p-6">
            {loadingSentCertificates ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : sentCertificates.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No certificates sent yet</h3>
                <p className="mt-1 text-sm text-gray-500">Start by selecting participants and generating certificates.</p>
              </div>
            ) : (
              // Flatten all certificates from all users into one grid
              (() => {
                const allCertificates = [];
                sentCertificates.forEach(record => {
                  if (record.certificates_info?.certificates) {
                    record.certificates_info.certificates.forEach(cert => {
                      allCertificates.push({
                        ...cert,
                        participant_name: record.participant_info?.name || 'N/A',
                        school_name: record.participant_info?.school_name || 'N/A',
                        user_email: record.user_info?.user_email || 'N/A',
                        sent_at: record.certificates_info?.sent_at || null,
                        record_id: record.record_id
                      });
                    });
                  }
                });

                return (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {allCertificates.map((cert, index) => (
                      <div key={`${cert.record_id}-${index}`} className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-lg transition-all duration-200">
                        <div className="space-y-3">
                          {/* Certificate Image */}
                          {cert.certificate_url && (
                            <div className="w-full h-24 border-2 border-yellow-300 rounded-md overflow-hidden">
                              <img
                                src={cert.certificate_url}
                                alt={`Certificate for ${cert.selected_talent}`}
                                className="w-full h-full object-cover cursor-pointer"
                                onClick={() => window.open(cert.certificate_url, '_blank')}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextElementSibling.style.display = 'flex';
                                }}
                              />
                              <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-orange-600 rounded-md flex items-center justify-center cursor-pointer" style={{display: 'none'}} onClick={() => window.open(cert.certificate_url, '_blank')}>
                                <Award className="w-8 h-8 text-white" />
                              </div>
                            </div>
                          )}
                          
                          {/* Certificate Details */}
                          <div className="text-center space-y-1">
                            <p className="text-xs font-semibold text-gray-900 truncate" title={cert.participant_name}>
                              {cert.participant_name}
                            </p>
                            <p className="text-xs font-medium text-yellow-700 truncate" title={cert.selected_talent}>
                              {cert.selected_talent}
                            </p>
                            <p className="text-xs text-gray-600 truncate" title={cert.school_name}>
                              <School className="w-3 h-3 inline mr-1" />
                              {cert.school_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {cert.sent_at ? 
                                new Date(cert.sent_at).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: '2-digit'
                                }) : 'N/A'}
                            </p>
                            
                            {cert.certificate_url && (
                              <button
                                onClick={() => window.open(cert.certificate_url, '_blank')}
                                className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium rounded hover:from-blue-600 hover:to-blue-700 transition-all duration-200 mt-2"
                                title="View Full Certificate"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()
            )}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Award className="w-4 h-4 text-yellow-600" />
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-yellow-800 mb-2">Certificate Generation Instructions</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Select participants who deserve the Best Performance Award</li>
              <li>• Choose the specific talent category for which they excel</li>
              <li>• Certificate will be generated with participant name and selected talent</li>
              <li>• Use "Preview All" to see all certificates in a carousel view</li>
              <li>• Download certificates individually or send all to participants via "Send All Certificates"</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Certificate Preview Modal */}
      <CertificatePreviewModal
        showModal={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setPreviewCertificates([]);
        }}
        certificates={previewCertificates}
        onDownload={downloadCertificate}
        onSendCertificates={sendCertificatesToUsers}
        sendingCertificates={sendingCertificates}
      />
    </div>
  );
};

export default BestPerformanceCertificate;