import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Download, FileText, X, User, School, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import Table from '../../components/ui/Table';
import { registrationService } from '../../services/registrationService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Registrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL');

  // Tab configuration
  const tabs = [
    { key: 'ALL', label: 'All Registrations', value: '', color: 'text-gray-700' },
    { key: 'SCHOOL', label: 'School', value: 'S', color: 'text-blue-600' },
    { key: 'INDIVIDUAL', label: 'Individual', value: 'I', color: 'text-green-600' },
    { key: 'GLOBAL', label: 'Global', value: 'G', color: 'text-purple-600' },
    { key: 'NATIONAL', label: 'National', value: 'N', color: 'text-orange-600' },
    { key: 'ALLROUNDER', label: 'All Rounder', value: 'A', color: 'text-red-600' }
  ];

  useEffect(() => {
    fetchRegistrations();
  }, [currentPage, searchTerm, filterType, activeTab]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      // Use active tab's filter value instead of dropdown filter
      const currentTab = tabs.find(tab => tab.key === activeTab);
      const tabFilterType = currentTab ? currentTab.value : '';
      
      const response = await registrationService.getRegistrations(currentPage, null, searchTerm, tabFilterType);
      setRegistrations(response.data || []);
      setTotalPages(1);
      setTotalRegistrations(response.totalCount || response.data?.length || 0);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    setCurrentPage(1);
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setCurrentPage(1);
    // Reset search when changing tabs
    setSearchTerm('');
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

  const StatusBadge = ({ isVerified }) => {
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {isVerified ? 'Verified' : 'Pending'}
      </span>
    );
  };

  const handleViewRegistration = (registration) => {
    setSelectedRegistration(registration);
    setShowViewModal(true);
  };

  const handleDownloadRegistration = async (registration) => {
    try {
      // Create a comprehensive registration data object
      const registrationData = {
        'Registration ID': registration._id || registration.id,
        'Form Type': getFormTypeLabel(registration.formType),
        'Participant Name': registration.name_of_participant || 'N/A',
        'Date of Birth': registration.dob_of_participant || 'N/A',
        'Category': registration.category || 'N/A',
        'Class': registration.class_name || 'N/A',
        'School Name': registration.school_name || 'N/A',
        'Principal Name': registration.principal_name || 'N/A',
        'School Email': registration.email_of_school || 'N/A',
        'School Contact': registration.contact_number_of_school || 'N/A',
        'School Address': registration.school_add || 'N/A',
        'City': registration.city || 'N/A',
        'District': registration.dist || 'N/A',
        'State': registration.state || 'N/A',
        'PIN Code': registration.school_pin || registration.pin || 'N/A',
        'Country': registration.country || 'N/A',
        'Art Teacher Name': registration.name_of_art_teacher || 'N/A',
        'Art Teacher Email': registration.art_teacher_email || 'N/A',
        'Art Teacher Contact': registration.art_teacher_number || 'N/A',
        'Student Email': registration.std_email || 'N/A',
        'Student Contact': registration.std_number || 'N/A',
        'Student Qualification': registration.std_qualification || 'N/A',
        'College Name': registration.name_of_clg || 'N/A',
        'College Address': registration.college_add || 'N/A',
        'Artist Profession': registration.artist_profession || 'N/A',
        'Artist Email': registration.artist_email || 'N/A',
        'Artist Contact': registration.artist_contact_number || 'N/A',
        'Registrant Email': registration.resister_user_email || 'N/A',
        'Registrant Mobile': registration.resister_user_mobile_no || 'N/A',
        'Country Phone Code': registration.country_phone_code || 'N/A',
        'Honorarium Name': registration.honorarium_name || 'N/A',
        'Verification Status': registration.isVerified ? 'Verified' : 'Pending',
        'Registration Date': registration.created_at ? format(new Date(registration.created_at), 'PPpp') : 'N/A'
      };

      // Convert to CSV format
      const headers = Object.keys(registrationData);
      const values = Object.values(registrationData);
      const csvContent = [
        headers.join(','),
        values.map(value => `"${value}"`).join(',')
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `registration_${registration._id || registration.id}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Registration data downloaded successfully!');
    } catch (error) {
      console.error('Error downloading registration:', error);
      toast.error('Failed to download registration data');
    }
  };

  const ViewModal = () => {
    if (!showViewModal || !selectedRegistration) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Registration Details</h2>
            <button
              onClick={() => setShowViewModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Participant Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Participant Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Name</label>
                    <p className="text-gray-900">{selectedRegistration.name_of_participant || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                    <p className="text-gray-900">{selectedRegistration.dob_of_participant || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Category</label>
                    <p className="text-gray-900">{selectedRegistration.category || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Class</label>
                    <p className="text-gray-900">{selectedRegistration.class_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Form Type</label>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      selectedRegistration.formType === 'S' ? 'bg-blue-100 text-blue-800' :
                      selectedRegistration.formType === 'I' ? 'bg-green-100 text-green-800' :
                      selectedRegistration.formType === 'G' ? 'bg-purple-100 text-purple-800' :
                      selectedRegistration.formType === 'A' ? 'bg-red-100 text-red-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {getFormTypeLabel(selectedRegistration.formType)}
                    </span>
                  </div>
                </div>
              </div>

              {/* School/Organization Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <School className="w-5 h-5 mr-2" />
                  {selectedRegistration.school_name ? 'School' : 'Organization'} Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      {selectedRegistration.school_name ? 'School Name' : 'Organization Name'}
                    </label>
                    <p className="text-gray-900">
                      {selectedRegistration.school_name || selectedRegistration.name_of_clg || 'Individual'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Principal/Head Name</label>
                    <p className="text-gray-900">{selectedRegistration.principal_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900">{selectedRegistration.email_of_school || selectedRegistration.std_email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Contact Number</label>
                    <p className="text-gray-900">{selectedRegistration.contact_number_of_school || selectedRegistration.std_number || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Address Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Address</label>
                    <p className="text-gray-900">{selectedRegistration.school_add || selectedRegistration.college_add || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">City</label>
                    <p className="text-gray-900">{selectedRegistration.city || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">District</label>
                    <p className="text-gray-900">{selectedRegistration.dist || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">State</label>
                    <p className="text-gray-900">{selectedRegistration.state || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">PIN Code</label>
                    <p className="text-gray-900">{selectedRegistration.school_pin || selectedRegistration.pin || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Country</label>
                    <p className="text-gray-900">{selectedRegistration.country || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Art Teacher Name</label>
                    <p className="text-gray-900">{selectedRegistration.name_of_art_teacher || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Art Teacher Email</label>
                    <p className="text-gray-900">{selectedRegistration.art_teacher_email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Art Teacher Contact</label>
                    <p className="text-gray-900">{selectedRegistration.art_teacher_number || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Registrant Email</label>
                    <p className="text-gray-900">{selectedRegistration.resister_user_email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Registrant Mobile</label>
                    <p className="text-gray-900">{selectedRegistration.resister_user_mobile_no || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Status & Date */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    selectedRegistration.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedRegistration.isVerified ? 'Verified' : 'Pending Verification'}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {selectedRegistration.created_at ? format(new Date(selectedRegistration.created_at), 'PPpp') : 'N/A'}
                  </span>
                </div>
                <button
                  onClick={() => handleDownloadRegistration(selectedRegistration)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
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
          <h1 className="text-2xl font-bold text-gray-900">Registrations</h1>
          <p className="text-gray-600">Manage all contest registrations</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const currentTabData = registrations.filter(r => 
              tab.value === '' ? true : r.formType === tab.value
            );
            
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? `border-blue-500 ${tab.color} font-semibold`
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {tab.label}
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs font-medium ${
                  isActive 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.key === 'ALL' ? totalRegistrations : currentTabData.length}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by participant name, school, or email..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <button className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Current Tab
          </button>
        </div>

        {/* Current Tab Info */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">
              {tabs.find(tab => tab.key === activeTab)?.label || 'All'} Registrations: {totalRegistrations}
            </span>
            {searchTerm && (
              <span className="ml-2 text-gray-500">
                (filtered from {registrations.length} total)
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

      {/* Registrations Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <Table>
              <Table.Header>
                <Table.HeaderCell>Participant</Table.HeaderCell>
                <Table.HeaderCell>School/Organization</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Category</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Header>
              <Table.Body>
                {registrations.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={7}>
                      <div className="text-center py-12">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No {tabs.find(tab => tab.key === activeTab)?.label.toLowerCase()} registrations found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {searchTerm 
                            ? `No registrations match "${searchTerm}"`
                            : `No ${tabs.find(tab => tab.key === activeTab)?.label.toLowerCase()} registrations have been submitted yet.`
                          }
                        </p>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  registrations.map((registration) => (
                    <Table.Row key={registration._id || registration.id}>
                      <Table.Cell>
                        <div>
                          <p className="font-medium text-gray-900">
                            {registration.name_of_participant || 'N/A'}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {registration.resister_user_email || registration.std_email || registration.artist_email}
                          </p>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div>
                          <p className="text-gray-900">
                            {registration.school_name || registration.name_of_clg || 'Individual'}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {registration.city}, {registration.state || registration.country}
                          </p>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        {getFormTypeBadge(registration.formType)}
                      </Table.Cell>
                      <Table.Cell>
                        <p className="text-gray-900">{registration.category || 'N/A'}</p>
                        {registration.class_name && (
                          <p className="text-gray-500 text-sm">Class: {registration.class_name}</p>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <StatusBadge isVerified={registration.isVerified} />
                      </Table.Cell>
                      <Table.Cell>
                        <p className="text-gray-900">
                          {registration.created_at ? format(new Date(registration.created_at), 'MMM dd, yyyy') : 'N/A'}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {registration.created_at ? format(new Date(registration.created_at), 'HH:mm') : ''}
                        </p>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewRegistration(registration)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDownloadRegistration(registration)}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="Download CSV"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
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

      {/* View Modal */}
      <ViewModal />
    </div>
  );
};

export default Registrations;