import React, { useState, useEffect } from 'react';
import { Search, Download, FileText, User, School, Calendar, ExternalLink, Database, Eye, Award } from 'lucide-react';
import Table from '../../components/ui/Table';
import ExcelViewer from '../../components/ExcelViewer';
import CertificateGenerator from '../../components/CertificateGenerator';
import { studentDataService } from '../../services/studentDataService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const StudentData = () => {
  const [studentFiles, setStudentFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [showExcelViewer, setShowExcelViewer] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCertificateGenerator, setShowCertificateGenerator] = useState(false);
  const [selectedFileForCertificate, setSelectedFileForCertificate] = useState(null);

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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

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
            Student Data Files
          </h1>
          <p className="text-gray-600">Manage all uploaded student Excel files</p>
        </div>
        <div className="text-sm text-gray-500">
          Total Files: <span className="font-semibold text-gray-900">{studentFiles.length}</span>
        </div>
      </div>

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
    </div>
  );
};

export default StudentData;