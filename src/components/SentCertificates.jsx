import React, { useState, useEffect } from 'react';
import { Award, Download, User, School, Calendar, FileText, ExternalLink, Eye } from 'lucide-react';
import Table from './ui/Table';
import CertificateViewer from './CertificateViewer';
import { certificateService } from '../services/certificateService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const SentCertificates = () => {
  const [sentCertificates, setSentCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [showCertificateViewer, setShowCertificateViewer] = useState(false);
  const [selectedCertificatesForView, setSelectedCertificatesForView] = useState(null);

  useEffect(() => {
    fetchSentCertificates();
  }, []);

  useEffect(() => {
    // Filter certificates based on search term
    if (!searchTerm) {
      setFilteredCertificates(sentCertificates);
    } else {
      const filtered = sentCertificates.filter(record =>
        record.user_info.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.school_info.school_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.user_info.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.certificates_info.sent_by.admin_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCertificates(filtered);
    }
  }, [searchTerm, sentCertificates]);

  const fetchSentCertificates = async () => {
    try {
      setLoading(true);
      const response = await certificateService.getAllSentCertificates();
      setSentCertificates(response.data.records || []);
      setFilteredCertificates(response.data.records || []);
    } catch (error) {
      console.error('Error fetching sent certificates:', error);
      toast.error('Failed to fetch sent certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDownloadCertificate = (certificateUrl, fileName) => {
    try {
      const link = document.createElement('a');
      link.href = certificateUrl;
      link.target = '_blank';
      link.download = fileName || 'certificate.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Certificate download started!');
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error('Failed to download certificate');
    }
  };

  const handleViewCertificates = (record) => {
    console.log('Viewing certificates for record:', record);
    console.log('Certificates data:', record.certificates_info.certificates);
    
    const certificateData = {
      certificates: record.certificates_info.certificates,
      schoolName: record.school_info.school_name,
      sentDate: format(new Date(record.certificates_info.sent_at), 'MMM dd, yyyy HH:mm'),
      sentBy: record.certificates_info.sent_by.admin_name
    };
    
    console.log('Setting certificate data for viewer:', certificateData);
    
    setSelectedCertificatesForView(certificateData);
    setShowCertificateViewer(true);
  };

  const handleCloseCertificateViewer = () => {
    setShowCertificateViewer(false);
    setSelectedCertificatesForView(null);
  };

  const getFormTypeBadge = (formType) => {
    const colors = {
      S: 'bg-blue-100 text-blue-800',
      I: 'bg-green-100 text-green-800',
      G: 'bg-purple-100 text-purple-800',
      N: 'bg-orange-100 text-orange-800',
      A: 'bg-red-100 text-red-800'
    };

    const labels = {
      S: 'School',
      I: 'Individual',
      G: 'Global',
      N: 'National',
      A: 'All Rounder'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[formType] || 'bg-gray-100 text-gray-800'}`}>
        {labels[formType] || 'Unknown'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Award className="w-6 h-6 mr-3 text-purple-600" />
            Sent Certificates
          </h1>
          <p className="text-gray-600">View all certificates sent to users</p>
        </div>
        <div className="text-sm text-gray-500">
          Total Records: <span className="font-semibold text-gray-900">{sentCertificates.length}</span>
          {sentCertificates.length > 0 && (
            <span className="ml-4">
              Total Certificates: <span className="font-semibold text-gray-900">
                {sentCertificates.reduce((total, record) => total + record.certificates_info.certificates_count, 0)}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by user name, school name, email, or admin name..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>
          </div>
          <button 
            onClick={fetchSentCertificates}
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Award className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Search Results Info */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">
              Showing {filteredCertificates.length} of {sentCertificates.length} records
            </span>
            {searchTerm && (
              <span className="ml-2 text-gray-500">
                (filtered by "{searchTerm}")
              </span>
            )}
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      {/* Sent Certificates Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            <Table>
              <Table.Header>
                <Table.HeaderCell>User Information</Table.HeaderCell>
                <Table.HeaderCell>School Information</Table.HeaderCell>
                <Table.HeaderCell>Form Type</Table.HeaderCell>
                <Table.HeaderCell>Certificates</Table.HeaderCell>
                <Table.HeaderCell>Sent Details</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Header>
              <Table.Body>
                {filteredCertificates.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={6}>
                      <div className="text-center py-12">
                        <Award className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No sent certificates found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {searchTerm 
                            ? `No certificates match "${searchTerm}"`
                            : 'No certificates have been sent to users yet.'
                          }
                        </p>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  filteredCertificates.map((record) => (
                    <Table.Row key={record.record_id}>
                      <Table.Cell>
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {record.user_info.user_name}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {record.user_info.user_email}
                            </p>
                            {record.user_info.user_phone !== 'N/A' && (
                              <p className="text-gray-500 text-xs">
                                {record.user_info.user_phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <School className="w-5 h-5 text-green-600" />
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {record.school_info.school_name}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {record.school_info.participant_name}
                            </p>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        {getFormTypeBadge(record.form_details.form_type)}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm">
                              <Award className="w-4 h-4 text-purple-600 mr-2" />
                              <span className="font-medium text-gray-900">
                                {record.certificates_info.certificates_count} certificates
                              </span>
                            </div>
                            <button
                              onClick={() => handleViewCertificates(record)}
                              className="text-purple-600 hover:text-purple-800 p-1"
                              title="View All Certificates"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="space-y-1 max-h-20 overflow-y-auto">
                            {record.certificates_info.certificates.map((cert, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs bg-gray-50 p-1 rounded">
                                <span className="text-gray-700 truncate max-w-24" title={cert.student_name}>
                                  {cert.student_name}
                                </span>
                                <button
                                  onClick={() => handleDownloadCertificate(cert.certificate_url, cert.file_name)}
                                  className="text-purple-600 hover:text-purple-800 p-1"
                                  title="Download Certificate"
                                >
                                  <Download className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="text-sm">
                          <div className="flex items-center text-gray-900 mb-1">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>
                              {record.certificates_info.sent_at 
                                ? format(new Date(record.certificates_info.sent_at), 'MMM dd, yyyy HH:mm')
                                : 'N/A'
                              }
                            </span>
                          </div>
                          <p className="text-gray-500 text-xs">
                            By: {record.certificates_info.sent_by.admin_name}
                          </p>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center space-x-2">
                          {record.original_file_info.file_urls.map((fileUrl, idx) => (
                            <button
                              key={idx}
                              onClick={() => window.open(fileUrl, '_blank')}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="View Original Excel File"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          ))}
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table>
          </>
        )}
      </div>

      {/* Certificate Viewer Modal */}
      <CertificateViewer
        isOpen={showCertificateViewer}
        onClose={handleCloseCertificateViewer}
        certificates={selectedCertificatesForView?.certificates || []}
        schoolName={selectedCertificatesForView?.schoolName || ''}
        sentDate={selectedCertificatesForView?.sentDate || ''}
        sentBy={selectedCertificatesForView?.sentBy || ''}
      />
    </div>
  );
};

export default SentCertificates;