import React, { useState, useEffect } from 'react';
import { Search, Download, FileText, User, School, Calendar, ExternalLink, Database, Eye, Award, Star, Users } from 'lucide-react';
import Table from '../../components/ui/Table';
import ExcelViewer from '../../components/ExcelViewer';
import CertificateGenerator from '../../components/CertificateGenerator';
import SentCertificates from '../../components/SentCertificates';
import BestPerformanceCertificate from '../../components/certificates/BestPerformanceCertificate';
import AllRounderParticipants from '../../components/certificates/AllRounderParticipants';
import { studentDataService } from '../../services/studentDataService';
import { paymentService } from '../../services/paymentService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const StudentData = () => {
  const [activeParentTab, setActiveParentTab] = useState('national-talent-search');
  const [activeChildTab, setActiveChildTab] = useState('student-files');
  const [studentFiles, setStudentFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [showExcelViewer, setShowExcelViewer] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCertificateGenerator, setShowCertificateGenerator] = useState(false);
  const [selectedFileForCertificate, setSelectedFileForCertificate] = useState(null);
  
  // All Rounder data
  const [allRounderData, setAllRounderData] = useState([]);
  const [allRounderLoading, setAllRounderLoading] = useState(false);
  const [allRounderSearchTerm, setAllRounderSearchTerm] = useState('');
  const [filteredAllRounderData, setFilteredAllRounderData] = useState([]);
  
  // Certificate states are now handled by individual components

  useEffect(() => {
    fetchStudentFiles();
  }, []);

  useEffect(() => {
    // Filter files based on search term
    if (!searchTerm) {
      setFilteredFiles(studentFiles);
    } else {
      const filtered = studentFiles.filter(file => 
        file.uploaded_by.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.school_info.school_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.uploaded_by.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.school_info.participant_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFiles(filtered);
    }
  }, [searchTerm, studentFiles]);

  useEffect(() => {
    // Filter All Rounder data based on search term
    if (!allRounderSearchTerm) {
      setFilteredAllRounderData(allRounderData);
    } else {
      const filtered = allRounderData.filter(participant => 
        participant.participant_details?.name_of_participant?.toLowerCase().includes(allRounderSearchTerm.toLowerCase()) ||
        participant.participant_details?.school_name?.toLowerCase().includes(allRounderSearchTerm.toLowerCase()) ||
        participant.participant_details?.email_id?.toLowerCase().includes(allRounderSearchTerm.toLowerCase()) ||
        participant.participant_details?.parent_name?.toLowerCase().includes(allRounderSearchTerm.toLowerCase()) ||
        participant.talent_categories?.some(talent => 
          talent.toLowerCase().includes(allRounderSearchTerm.toLowerCase())
        )
      );
      setFilteredAllRounderData(filtered);
    }
  }, [allRounderSearchTerm, allRounderData]);

  useEffect(() => {
    // Fetch All Rounder data when All Rounder tab is active
    if (activeParentTab === 'all-rounder') {
      fetchAllRounderData();
    }
  }, [activeParentTab]);

  const fetchStudentFiles = async () => {
    try {
      setLoading(true);
      const response = await studentDataService.getAllStudentFiles();
      setStudentFiles(response.data || []);
      setFilteredFiles(response.data || []);
    } catch (error) {
      console.error('Error fetching student files:', error);
      toast.error('Failed to fetch student data files');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllRounderData = async () => {
    try {
      setAllRounderLoading(true);
      const response = await paymentService.getAllRounderPaymentReceipts();
      console.log('All-Rounder data response:', response);
      
      if (response.success && response.data) {
        // Sort by latest first (newest submissions at top)
        const sortedData = response.data.sort((a, b) => {
          const dateA = new Date(a.created_at || a.createdAt);
          const dateB = new Date(b.created_at || b.createdAt);
          return dateB - dateA; // Descending order (latest first)
        });
        setAllRounderData(sortedData);
        setFilteredAllRounderData(sortedData);
      } else {
        setAllRounderData([]);
        setFilteredAllRounderData([]);
        toast.error('Failed to fetch All-Rounder data');
      }
    } catch (error) {
      console.error('Error fetching All-Rounder data:', error);
      setAllRounderData([]);
      setFilteredAllRounderData([]);
      toast.error('Failed to fetch All-Rounder data');
    } finally {
      setAllRounderLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Certificate functions moved to individual components

  const handleDownloadFile = async (fileUrl, fileName) => {
    try {
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = fileUrl;
      link.target = '_blank';
      link.download = fileName || 'student_data.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download started!');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const handleViewFile = (fileUrl, fileName) => {
    console.log('handleViewFile called with:', { fileUrl, fileName });
    setSelectedFile({ url: fileUrl, name: fileName });
    setShowExcelViewer(true);
  };

  const handleCloseExcelViewer = () => {
    setShowExcelViewer(false);
    setSelectedFile(null);
  };

  const handleGenerateCertificate = (fileUrl, fileName) => {
    console.log('Generate certificate for:', { fileUrl, fileName });
    setSelectedFileForCertificate({ url: fileUrl, name: fileName });
    setShowCertificateGenerator(true);
  };

  const handleCloseCertificateGenerator = () => {
    setShowCertificateGenerator(false);
    setSelectedFileForCertificate(null);
  };

  const getFormTypeLabel = (formType) => {
    switch (formType) {
      case 'S': return 'School';
      case 'I': return 'Individual';
      case 'G': return 'Global';
      case 'N': return 'National';
      case 'A': return 'All Rounder';
      default: return 'Unknown';
    }
  };

  const getFormTypeBadge = (formType) => {
    const colors = {
      S: 'bg-blue-100 text-blue-800',
      I: 'bg-green-100 text-green-800',
      G: 'bg-purple-100 text-purple-800',
      N: 'bg-orange-100 text-orange-800',
      A: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[formType] || 'bg-gray-100 text-gray-800'}`}>
        {getFormTypeLabel(formType)}
      </span>
    );
  };

  const getFileNameFromPath = (filePath) => {
    if (!filePath) return 'student_data.xlsx';
    return filePath.split('/').pop() || 'student_data.xlsx';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Database className="w-6 h-6 mr-3 text-blue-600" />
            Student Data Management
          </h1>
          <p className="text-gray-600">Manage student Excel files and certificates</p>
        </div>
        <div className="text-sm text-gray-500">
          Total Files: <span className="font-semibold text-gray-900">{studentFiles.length}</span>
        </div>
      </div>

      {/* Enhanced Parent Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Parent Tabs */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <nav className="flex" aria-label="Parent Tabs">
            <button
              onClick={() => {
                setActiveParentTab('national-talent-search');
                setActiveChildTab('student-files');
              }}
              className={`flex-1 py-5 px-6 text-center font-semibold text-base transition-all duration-300 focus:outline-none relative group ${
                activeParentTab === 'national-talent-search'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/70'
              }`}
            >
              <div className="flex items-center justify-center space-x-3">
                <div className={`p-2 rounded-lg transition-all duration-300 ${
                  activeParentTab === 'national-talent-search' 
                    ? 'bg-white/20' 
                    : 'bg-blue-100 group-hover:bg-blue-200'
                }`}>
                  <Award className={`w-5 h-5 ${
                    activeParentTab === 'national-talent-search' ? 'text-white' : 'text-blue-600'
                  }`} />
                </div>
                <span>National Talent Search</span>
              </div>
              {activeParentTab === 'national-talent-search' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-300"></div>
              )}
            </button>
            
            <button
              onClick={() => {
                setActiveParentTab('all-rounder');
                setActiveChildTab('all-participants');
              }}
              className={`flex-1 py-5 px-6 text-center font-semibold text-base transition-all duration-300 focus:outline-none relative group ${
                activeParentTab === 'all-rounder'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/70'
              }`}
            >
              <div className="flex items-center justify-center space-x-3">
                <div className={`p-2 rounded-lg transition-all duration-300 ${
                  activeParentTab === 'all-rounder' 
                    ? 'bg-white/20' 
                    : 'bg-green-100 group-hover:bg-green-200'
                }`}>
                  <User className={`w-5 h-5 ${
                    activeParentTab === 'all-rounder' ? 'text-white' : 'text-green-600'
                  }`} />
                </div>
                <span>All Rounder</span>
              </div>
              {activeParentTab === 'all-rounder' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-300"></div>
              )}
            </button>
          </nav>
        </div>

        {/* Enhanced Child Tab Navigation */}
        {activeParentTab === 'national-talent-search' && (
          <div className="bg-gradient-to-r from-blue-50 via-blue-25 to-purple-50 border-b border-blue-100">
            <nav className="flex px-6 py-2" aria-label="Child Tabs">
              <button
                onClick={() => setActiveChildTab('student-files')}
                className={`px-6 py-3 mx-1 rounded-lg font-medium text-sm transition-all duration-300 focus:outline-none transform hover:scale-105 ${
                  activeChildTab === 'student-files'
                    ? 'bg-white text-blue-700 shadow-md border border-blue-200'
                    : 'text-blue-600 hover:text-blue-800 hover:bg-white/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded-md ${
                    activeChildTab === 'student-files' 
                      ? 'bg-blue-100' 
                      : 'bg-blue-200'
                  }`}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <span>Student Data Files</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveChildTab('sent-certificates')}
                className={`px-6 py-3 mx-1 rounded-lg font-medium text-sm transition-all duration-300 focus:outline-none transform hover:scale-105 ${
                  activeChildTab === 'sent-certificates'
                    ? 'bg-white text-purple-700 shadow-md border border-purple-200'
                    : 'text-purple-600 hover:text-purple-800 hover:bg-white/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded-md ${
                    activeChildTab === 'sent-certificates' 
                      ? 'bg-purple-100' 
                      : 'bg-purple-200'
                  }`}>
                    <Award className="w-4 h-4" />
                  </div>
                  <span>View Sent Certificates</span>
                </div>
              </button>
            </nav>
          </div>
        )}

        {/* All Rounder Child Tab Navigation */}
        {activeParentTab === 'all-rounder' && (
          <div className="bg-gradient-to-r from-green-50 via-emerald-25 to-green-50 border-b border-green-100">
            <nav className="flex px-6 py-2" aria-label="All Rounder Tabs">
              <button
                onClick={() => setActiveChildTab('all-participants')}
                className={`px-6 py-3 mx-1 rounded-lg font-medium text-sm transition-all duration-300 focus:outline-none transform hover:scale-105 ${
                  activeChildTab === 'all-participants'
                    ? 'bg-white text-green-700 shadow-md border border-green-200'
                    : 'text-green-600 hover:text-green-800 hover:bg-white/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded-md ${
                    activeChildTab === 'all-participants' 
                      ? 'bg-green-100' 
                      : 'bg-green-200'
                  }`}>
                    <Users className="w-4 h-4" />
                  </div>
                  <span>All Participants</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveChildTab('best-performance-certificate')}
                className={`px-6 py-3 mx-1 rounded-lg font-medium text-sm transition-all duration-300 focus:outline-none transform hover:scale-105 ${
                  activeChildTab === 'best-performance-certificate'
                    ? 'bg-white text-yellow-700 shadow-md border border-yellow-200'
                    : 'text-yellow-600 hover:text-yellow-800 hover:bg-white/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded-md ${
                    activeChildTab === 'best-performance-certificate' 
                      ? 'bg-yellow-100' 
                      : 'bg-yellow-200'
                  }`}>
                    <Award className="w-4 h-4" />
                  </div>
                  <span>Best Performance Certificate</span>
                </div>
              </button>

              <button
                onClick={() => setActiveChildTab('participation-certificate')}
                className={`px-6 py-3 mx-1 rounded-lg font-medium text-sm transition-all duration-300 focus:outline-none transform hover:scale-105 ${
                  activeChildTab === 'participation-certificate'
                    ? 'bg-white text-orange-700 shadow-md border border-orange-200'
                    : 'text-orange-600 hover:text-orange-800 hover:bg-white/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded-md ${
                    activeChildTab === 'participation-certificate' 
                      ? 'bg-orange-100' 
                      : 'bg-orange-200'
                  }`}>
                    <Star className="w-4 h-4" />
                  </div>
                  <span>Participation Certificate</span>
                </div>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Enhanced Competition Header - Only show for National Talent Search */}
      {activeParentTab === 'national-talent-search' && (
        <div className="relative overflow-hidden rounded-xl shadow-lg border border-blue-200 bg-gradient-to-br from-blue-50 via-blue-100 to-purple-100">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
          <div className="relative px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-grow">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-1">
                  National Talent Search Drawing And Painting Scholarship Competition 2025
                </h1>
                <p className="text-gray-700 text-sm leading-relaxed">
                  View and manage student data files, generate certificates, and track sent certificates for the competition.
                </p>
              </div>
              <div className="flex-shrink-0 hidden md:block">
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{studentFiles.length}</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide">Total Files</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Rounder Header */}
      {activeParentTab === 'all-rounder' && (
        <div className="relative overflow-hidden rounded-xl shadow-lg border border-green-200 bg-gradient-to-br from-green-50 via-green-100 to-emerald-100">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5"></div>
          <div className="relative px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-grow">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-1">
                  All Rounder Competition Management
                </h1>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Manage participants, generate certificates, and track performance for All Rounder competition.
                </p>
              </div>
              <div className="flex-shrink-0 hidden md:block">
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{allRounderData.length}</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide">Total Participants</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Participants Tab Content */}
      {activeParentTab === 'all-rounder' && activeChildTab === 'all-participants' && (
        <AllRounderParticipants
          allRounderData={allRounderData}
          allRounderLoading={allRounderLoading}
          allRounderSearchTerm={allRounderSearchTerm}
          setAllRounderSearchTerm={setAllRounderSearchTerm}
          filteredAllRounderData={filteredAllRounderData}
          fetchAllRounderData={fetchAllRounderData}
        />
      )}

      {/* Best Performance Certificate Tab Content */}
      {activeParentTab === 'all-rounder' && activeChildTab === 'best-performance-certificate' && (
        <BestPerformanceCertificate
          allRounderData={allRounderData}
          allRounderLoading={allRounderLoading}
        />
      )}

      {/* Participation Certificate Tab Content */}
      {activeParentTab === 'all-rounder' && activeChildTab === 'participation-certificate' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Participation Certificate Generator</h3>
            <p className="text-gray-700 mb-6 max-w-md mx-auto leading-relaxed">
              Generate Participation certificates for all All Rounder competition participants, recognizing their involvement and talent showcase.
            </p>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 mb-2">Certificate Template: All-Participation.jpg</h4>
                <p className="text-sm text-orange-700">
                  This certificate acknowledges all participants for their involvement in the All Rounder Talent Hub Contest.
                </p>
              </div>
              <div className="inline-flex items-center px-6 py-3 bg-white/60 backdrop-blur-sm rounded-lg border border-orange-200 shadow-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse mr-3"></div>
                <span className="text-sm font-medium text-orange-700">Certificate generator will be implemented here...</span>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* National Talent Search Content */}
      {activeParentTab === 'national-talent-search' && activeChildTab === 'student-files' && (
        <>
          {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by user name, school name, email, or participant name..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <button 
            onClick={fetchStudentFiles}
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Database className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Search Results Info */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">
              Showing {filteredFiles.length} of {studentFiles.length} files
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
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      {/* Student Files Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <Table>
              <Table.Header>
                <Table.HeaderCell>User Information</Table.HeaderCell>
                <Table.HeaderCell>School Information</Table.HeaderCell>
                <Table.HeaderCell>Form Type</Table.HeaderCell>
                <Table.HeaderCell>Files</Table.HeaderCell>
                <Table.HeaderCell>Upload Date</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Header>
              <Table.Body>
                {filteredFiles.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={6}>
                      <div className="text-center py-12">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No student data files found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {searchTerm 
                            ? `No files match "${searchTerm}"`
                            : 'No student data files have been uploaded yet.'
                          }
                        </p>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  filteredFiles.map((file, index) => (
                    <Table.Row key={file._id || index}>
                      <Table.Cell>
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {file.uploaded_by.user_name || 'N/A'}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {file.uploaded_by.user_email || 'N/A'}
                            </p>
                            {file.uploaded_by.user_phone && (
                              <p className="text-gray-500 text-xs">
                                {file.uploaded_by.user_phone}
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
                              {file.school_info.school_name || 'N/A'}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {file.school_info.participant_name || 'N/A'}
                            </p>
                            {file.school_info.school_email && (
                              <p className="text-gray-500 text-xs">
                                {file.school_info.school_email}
                              </p>
                            )}
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        {getFormTypeBadge(file.form_details.form_type)}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="space-y-1">
                          {file.files.file_paths.map((path, idx) => (
                            <div key={idx} className="flex items-center text-sm">
                              <FileText className="w-4 h-4 text-green-600 mr-2" />
                              <span className="text-gray-900 truncate max-w-32" title={getFileNameFromPath(path)}>
                                {getFileNameFromPath(path)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          <div>
                            <p className="text-gray-900">
                              {file.upload_date ? format(new Date(file.upload_date), 'MMM dd, yyyy') : 'N/A'}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {file.upload_date ? format(new Date(file.upload_date), 'HH:mm') : ''}
                            </p>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center space-x-2">
                          {file.files.file_urls.map((fileUrl, idx) => (
                            <React.Fragment key={idx}>
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleViewFile(fileUrl, getFileNameFromPath(file.files.file_paths[idx]));
                                }}
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                title="View Excel File"
                                type="button"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDownloadFile(fileUrl, getFileNameFromPath(file.files.file_paths[idx]))}
                                className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                title="Download File"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleGenerateCertificate(fileUrl, getFileNameFromPath(file.files.file_paths[idx]));
                                }}
                                className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                                title="Generate Certificates"
                                type="button"
                              >
                                <Award className="w-4 h-4" />
                              </button>
                            </React.Fragment>
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

          {/* Excel Viewer Modal */}
          <ExcelViewer
            isOpen={showExcelViewer}
            onClose={handleCloseExcelViewer}
            fileUrl={selectedFile?.url}
            fileName={selectedFile?.name}
          />

          {/* Certificate Generator Modal */}
          <CertificateGenerator
            isOpen={showCertificateGenerator}
            onClose={handleCloseCertificateGenerator}
            fileUrl={selectedFileForCertificate?.url}
            fileName={selectedFileForCertificate?.name}
          />
        </>
      )}

      {/* Sent Certificates Tab */}
      {activeParentTab === 'national-talent-search' && activeChildTab === 'sent-certificates' && (
        <SentCertificates />
      )}
    </div>
  );
};

export default StudentData;