import React from 'react';
import { Search, Database, Users, User, School, Calendar, Award } from 'lucide-react';
import { format } from 'date-fns';

const AllRounderParticipants = ({ 
  allRounderData, 
  allRounderLoading, 
  allRounderSearchTerm, 
  setAllRounderSearchTerm,
  filteredAllRounderData,
  fetchAllRounderData 
}) => {
  const handleAllRounderSearch = (e) => {
    setAllRounderSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by participant name, school, email, parent name, or talent..."
                value={allRounderSearchTerm}
                onChange={handleAllRounderSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>
          </div>
          <button 
            onClick={fetchAllRounderData}
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
              Showing {filteredAllRounderData.length} of {allRounderData.length} participants
            </span>
            {allRounderSearchTerm && (
              <span className="ml-2 text-gray-500">
                (filtered by "{allRounderSearchTerm}")
              </span>
            )}
          </div>
          {allRounderSearchTerm && (
            <button
              onClick={() => setAllRounderSearchTerm('')}
              className="text-sm text-green-600 hover:text-green-800 transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      {/* All Rounder Data Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        {allRounderLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                      Participant Information
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                      School & Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                      Class & Age
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                      Selected Talents
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                      Submission Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAllRounderData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="text-center">
                          <Users className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">
                            No All Rounder participants found
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {allRounderSearchTerm 
                              ? `No participants match "${allRounderSearchTerm}"`
                              : 'No All Rounder submissions have been made yet.'
                            }
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAllRounderData.map((participant, index) => (
                      <tr key={participant._id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-green-600" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {participant.participant_details?.name_of_participant || 'N/A'}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                Parent: {participant.participant_details?.parent_name || 'N/A'}
                              </p>
                              {participant.participant_details?.email_id && (
                                <p className="text-xs text-gray-400 truncate">
                                  {participant.participant_details.email_id}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <School className="w-5 h-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {participant.participant_details?.school_name || 'N/A'}
                              </p>
                              {participant.participant_details?.whatsapp_number && (
                                <p className="text-xs text-gray-500 truncate">
                                  {participant.participant_details.whatsapp_number}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">
                              {participant.participant_details?.class_name || 'N/A'}
                            </p>
                            <p className="text-xs text-gray-500">
                              Age: {participant.participant_details?.age || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <div className="flex flex-wrap gap-1">
                              {participant.talent_categories && Array.isArray(participant.talent_categories) && participant.talent_categories.length > 0 ? (
                                <>
                                  {participant.talent_categories.slice(0, 3).map((talent, idx) => (
                                    <span key={idx} className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                                      {String(talent).length > 20 ? String(talent).substring(0, 20) + '...' : String(talent)}
                                    </span>
                                  ))}
                                  {participant.talent_categories.length > 3 && (
                                    <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                      +{participant.talent_categories.length - 3} more
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-gray-500 text-sm">No talents</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                              Total: {participant.talent_count || participant.talent_categories?.length || 0} talents
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <p className="text-gray-900 truncate">
                              {[
                                participant.participant_details?.city,
                                participant.participant_details?.dist,
                                participant.participant_details?.state
                              ].filter(Boolean).join(', ') || 'N/A'}
                            </p>
                            {participant.participant_details?.school_pin && (
                              <p className="text-xs text-gray-500">
                                PIN: {participant.participant_details.school_pin}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            <div>
                              <p className="text-gray-900 text-xs">
                                {participant.created_at || participant.createdAt ? format(new Date(participant.created_at || participant.createdAt), 'MMM dd, yyyy') : 'N/A'}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {participant.created_at || participant.createdAt ? format(new Date(participant.created_at || participant.createdAt), 'HH:mm') : ''}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllRounderParticipants;