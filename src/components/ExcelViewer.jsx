import React, { useState, useEffect } from 'react';
import { X, FileText, Download, Loader2, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

const ExcelViewer = ({ isOpen, onClose, fileUrl, fileName }) => {
  const [excelData, setExcelData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSheet, setSelectedSheet] = useState(0);

  useEffect(() => {
    if (isOpen && fileUrl) {
      loadExcelFile();
    } else {
      // Reset state when modal closes
      setExcelData(null);
      setError(null);
      setSelectedSheet(0);
    }
  }, [isOpen, fileUrl]);

  const loadExcelFile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading Excel file from URL:', fileUrl);
      
      // Use proxy to avoid CORS issues
      const proxyUrl = fileUrl.replace('https://kca-bucket.s3.ap-south-1.amazonaws.com', '/s3-proxy');
      console.log('Using proxy URL:', proxyUrl);
      
      // Fetch the Excel file with proper headers
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,*/*',
        },
      });
      
      console.log('Fetch response status:', response.status);
      console.log('Fetch response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      console.log('ArrayBuffer length:', arrayBuffer.byteLength);
      
      // Parse the Excel file
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      // Convert all sheets to JSON
      const sheets = workbook.SheetNames.map(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1,
          defval: '',
          raw: false
        });
        
        return {
          name: sheetName,
          data: jsonData
        };
      });

      setExcelData(sheets);
      toast.success('Excel file loaded successfully!');
      
    } catch (err) {
      console.error('Error loading Excel file:', err);
      setError(err.message || 'Failed to load Excel file');
      toast.error('Failed to load Excel file');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'student_data.xlsx';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download started!');
  };

  const renderTable = (sheetData) => {
    if (!sheetData || sheetData.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <FileText className="mx-auto h-12 w-12 mb-2" />
          <p>No data found in this sheet</p>
        </div>
      );
    }

    // First row is usually headers
    const headers = sheetData[0] || [];
    const rows = sheetData.slice(1);

    return (
      <div className="overflow-auto max-h-96">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                >
                  {header || `Column ${index + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {headers.map((_, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200"
                  >
                    {row[colIndex] || ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50 rounded-t-lg">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-green-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Excel File Viewer</h2>
              <p className="text-sm text-gray-600">{fileName || 'Student Data'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading Excel file...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading File</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={loadExcelFile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {excelData && excelData.length > 0 && (
            <>
              {/* Sheet Tabs */}
              {excelData.length > 1 && (
                <div className="border-b bg-gray-50">
                  <div className="flex space-x-1 p-2">
                    {excelData.map((sheet, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSheet(index)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                          selectedSheet === index
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border'
                        }`}
                      >
                        {sheet.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sheet Content */}
              <div className="flex-1 p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {excelData[selectedSheet]?.name || 'Sheet'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {excelData[selectedSheet]?.data?.length > 0 
                      ? `${excelData[selectedSheet].data.length - 1} rows of data`
                      : 'No data'
                    }
                  </p>
                </div>

                {renderTable(excelData[selectedSheet]?.data)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExcelViewer;