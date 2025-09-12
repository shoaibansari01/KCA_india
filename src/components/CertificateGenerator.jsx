import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Award, Loader2, AlertCircle, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import certificateImg from '../assets/certificate.jpeg';

const CertificateGenerator = ({ isOpen, onClose, fileUrl, fileName }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [excelSheets, setExcelSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState(0);
  const [studentData, setStudentData] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [currentCertificateIndex, setCurrentCertificateIndex] = useState(0);
  const [showCertificatePreview, setShowCertificatePreview] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isOpen && fileUrl) {
      loadExcelData();
    } else {
      // Reset state when modal closes
      setExcelSheets([]);
      setSelectedSheet(0);
      setStudentData([]);
      setSelectedStudents([]);
      setError(null);
      setCurrentCertificateIndex(0);
      setShowCertificatePreview(false);
    }
  }, [isOpen, fileUrl]);

  useEffect(() => {
    // Update student data when selected sheet changes
    if (excelSheets.length > 0 && excelSheets[selectedSheet]) {
      const sheetData = excelSheets[selectedSheet].data;
      if (sheetData.length > 1) {
        const headers = sheetData[0];
        const rows = sheetData.slice(1);
        
        // Filter headers to only include non-empty ones and relevant fields
        const relevantHeaders = headers.filter((header, index) => {
          if (!header || header.toString().trim() === '') return false;
          
          // Only include these specific fields
          const headerStr = header.toString().toLowerCase();
          return headerStr.includes('name of the participant') || 
                 headerStr.includes('class') || 
                 headerStr.includes('name of the school') ||
                 headerStr === 'name' ||
                 headerStr === 'school';
        });
        
        const students = rows.map((row, index) => {
          const student = {};
          
          // Only map relevant headers
          headers.forEach((header, headerIndex) => {
            if (header && header.toString().trim() !== '' && relevantHeaders.includes(header)) {
              const value = row[headerIndex] || '';
              if (value && value.toString().trim() !== '') {
                student[header] = value.toString().trim();
              }
            }
          });
          
          student.id = index + 1;
          return student;
        }).filter(student => {
          // Filter out students that don't have proper data
          const name = getStudentName(student);
          
          // Check if name exists and is not just a number (row index)
          if (!name || name === 'Student' || name.trim() === '') {
            return false;
          }
          
          // Check if name is just a number (Excel row index)
          if (/^\d+$/.test(name.trim())) {
            return false;
          }
          
          // Must have at least name field from the relevant headers
          const hasValidData = Object.keys(student).some(key => 
            key !== 'id' && 
            relevantHeaders.includes(key) &&
            student[key] && 
            student[key].toString().trim() !== '' &&
            !/^\d+$/.test(student[key].toString().trim())
          );
          
          return hasValidData;
        });
        
        console.log('Relevant headers found:', relevantHeaders);
        console.log('Sample student data:', students.length > 0 ? students[0] : 'No students');
        
        setStudentData(students);
        setSelectedStudents([]);
        setShowCertificatePreview(false);
        toast.success(`Loaded ${students.length} students from ${excelSheets[selectedSheet].name}`);
      }
    }
  }, [selectedSheet, excelSheets]);

  const loadExcelData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading Excel data for certificates:', fileUrl);
      
      // Use proxy to avoid CORS issues
      const proxyUrl = fileUrl.replace('https://kca-bucket.s3.ap-south-1.amazonaws.com', '/s3-proxy');
      console.log('Using proxy URL for certificates:', proxyUrl);
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,*/*',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      // Convert all sheets to JSON, excluding "not for use" sheet and empty sheets
      const sheets = workbook.SheetNames
        .filter(sheetName => sheetName.toLowerCase() !== 'not for use')
        .map(sheetName => {
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
        })
        .filter(sheet => {
          // Only include sheets that have data (more than just headers)
          if (sheet.data.length <= 1) return false;
          
          // Check if there are actual student rows with data
          const dataRows = sheet.data.slice(1);
          const hasValidData = dataRows.some(row => 
            row && row.length > 0 && 
            row.some(cell => cell && cell.toString().trim() !== '')
          );
          
          return hasValidData;
        });

      if (sheets.length === 0) {
        throw new Error('Excel file contains no sheets');
      }

      // Create an "All Sheets" tab that combines all data
      const allSheetsData = [];
      sheets.forEach(sheet => {
        if (sheet.data.length > 1) {
          const rows = sheet.data.slice(1);
          rows.forEach(row => {
            if (row && row.length > 0 && row.some(cell => cell && cell.toString().trim() !== '')) {
              allSheetsData.push(row);
            }
          });
        }
      });

      // Create combined sheet with standard headers
      const combinedSheet = {
        name: 'All Sheets',
        data: allSheetsData.length > 0 ? [
          ['Name of the Participant', 'Class', 'Name of the School'],
          ...allSheetsData
        ] : []
      };

      // Add "All Sheets" as the first tab
      const sheetsWithCombined = [combinedSheet, ...sheets];

      console.log('Loaded sheets:', sheetsWithCombined);
      console.log('All Sheets data count:', allSheetsData.length);
      setExcelSheets(sheetsWithCombined);
      setSelectedSheet(0); // Default to "All Sheets" tab
      toast.success(`Loaded Excel file with ${sheets.length} sheets + combined view!`);
      
    } catch (err) {
      console.error('Error loading Excel data:', err);
      setError(err.message || 'Failed to load Excel file');
      toast.error('Failed to load student data from Excel file');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = (studentId, isSelected) => {
    if (isSelected) {
      setSelectedStudents(prev => [...prev, studentId]);
    } else {
      setSelectedStudents(prev => prev.filter(id => id !== studentId));
    }
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === studentData.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(studentData.map(student => student.id));
    }
  };

  const getStudentName = (student) => {
    // Try different common column names for student names including the actual Excel field
    const nameFields = [
      'Name of the Participant', 
      'Name', 
      'Student Name', 
      'name', 
      'student_name', 
      'StudentName', 
      'Full Name', 
      'fullname'
    ];
    
    for (const field of nameFields) {
      if (student[field] && student[field].toString().trim()) {
        const name = student[field].toString().trim();
        // Don't return if it's just a number (Excel row index)
        if (!/^\d+$/.test(name)) {
          return name;
        }
      }
    }
    
    // If no valid name field found, look for first non-numeric non-empty value
    const firstValue = Object.values(student).find(value => {
      if (!value || !value.toString().trim()) return false;
      const valueStr = value.toString().trim();
      // Skip if it's just a number or 'id'
      return !/^\d+$/.test(valueStr) && valueStr !== 'id';
    });
    
    return firstValue ? firstValue.toString().trim() : 'Student';
  };

  const getStudentClass = (student) => {
    // Try different common column names for class including the actual Excel field
    const classFields = ['Class', 'Grade', 'class', 'grade', 'Standard', 'std'];
    
    for (const field of classFields) {
      if (student[field] && student[field].toString().trim()) {
        return student[field].toString().trim();
      }
    }
    
    return '';
  };

  const getStudentSchool = (student) => {
    // Get school name from Excel data
    const schoolFields = ['Name of the School', 'School Name', 'School', 'school', 'school_name'];
    
    for (const field of schoolFields) {
      if (student[field] && student[field].toString().trim()) {
        return student[field].toString().trim();
      }
    }
    
    return '';
  };

  const generateCertificate = (student) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match certificate proportions
    canvas.width = 1200;
    canvas.height = 800;
    
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Draw certificate background
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Set text properties
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        
        // Student Name - after "This is to certify that"
        ctx.font = 'bold 22px Arial';
        const studentName = getStudentName(student);
        ctx.fillText(studentName, 400, 383); // Moved down a bit
        
        // Class - after "Class"
        const studentClass = getStudentClass(student);
        if (studentClass) {
          ctx.font = '9px Arial'; // Made much smaller to fit width
          ctx.fillText(studentClass, 230, 418); // Moved right to align with dotted line
        }
        
        // School Name - after "student of"
        const studentSchool = getStudentSchool(student);
        if (studentSchool) {
          ctx.font = '18px Arial'; // Slightly smaller
          ctx.fillText(studentSchool, 400, 418); // Moved down a bit
        }
        
        resolve(canvas.toDataURL('image/png'));
      };
      
      img.src = certificateImg;
    });
  };

  const handlePreviewCertificates = async () => {
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student');
      return;
    }
    
    setShowCertificatePreview(true);
    setCurrentCertificateIndex(0);
  };

  const handleDownloadCertificates = async () => {
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student');
      return;
    }

    setLoading(true);
    
    try {
      const selectedStudentData = studentData.filter(student => 
        selectedStudents.includes(student.id)
      );

      for (let i = 0; i < selectedStudentData.length; i++) {
        const student = selectedStudentData[i];
        const certificateDataUrl = await generateCertificate(student);
        
        // Convert to blob and download
        const response = await fetch(certificateDataUrl);
        const blob = await response.blob();
        
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `certificate_${getStudentName(student).replace(/[^a-zA-Z0-9]/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      toast.success(`Downloaded ${selectedStudentData.length} certificates!`);
    } catch (error) {
      console.error('Error generating certificates:', error);
      toast.error('Failed to generate certificates');
    } finally {
      setLoading(false);
    }
  };

  const CertificatePreview = () => {
    const [previewDataUrl, setPreviewDataUrl] = useState('');
    
    useEffect(() => {
      if (showCertificatePreview && selectedStudents.length > 0) {
        const selectedStudentData = studentData.filter(student => 
          selectedStudents.includes(student.id)
        );
        
        if (selectedStudentData[currentCertificateIndex]) {
          generateCertificate(selectedStudentData[currentCertificateIndex])
            .then(setPreviewDataUrl);
        }
      }
    }, [currentCertificateIndex, showCertificatePreview]);

    const selectedStudentData = studentData.filter(student => 
      selectedStudents.includes(student.id)
    );

    if (!showCertificatePreview) return null;

    return (
      <div className="mt-6 border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Certificate Preview</h3>
          <div className="flex items-center space-x-2">
            {selectedStudentData.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentCertificateIndex(prev => Math.max(prev - 1, 0))}
                  disabled={currentCertificateIndex === 0}
                  className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  {currentCertificateIndex + 1} of {selectedStudentData.length}
                </span>
                <button
                  onClick={() => setCurrentCertificateIndex(prev => Math.min(prev + 1, selectedStudentData.length - 1))}
                  disabled={currentCertificateIndex === selectedStudentData.length - 1}
                  className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </>
            )}
          </div>
        </div>
        
        {previewDataUrl && (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Certificate for: <strong>{getStudentName(selectedStudentData[currentCertificateIndex])}</strong>
            </p>
            <img 
              src={previewDataUrl} 
              alt="Certificate Preview" 
              className="max-w-full max-h-96 mx-auto border rounded shadow-lg"
            />
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gray-50 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <Award className="w-6 h-6 text-purple-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Certificate Generator</h2>
                <p className="text-sm text-gray-600">{fileName || 'Student Data'}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {loading && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading student data...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button
                    onClick={loadExcelData}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {excelSheets.length > 0 && (
              <div className="flex-1 p-6 overflow-auto">
                {/* Sheet Selector */}
                {excelSheets.length > 1 && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Select Excel Sheet</h3>
                    <div className="flex flex-wrap gap-2">
                      {excelSheets.map((sheet, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedSheet(index)}
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            selectedSheet === index
                              ? 'bg-purple-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border'
                          }`}
                        >
                          {sheet.name}
                          <span className="ml-2 text-xs opacity-75">
                            ({sheet.data.length > 1 ? sheet.data.length - 1 : 0} rows)
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {studentData.length > 0 && (
                  <>
                    {/* Actions */}
                    <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleSelectAll}
                      className="text-sm text-purple-600 hover:text-purple-800"
                    >
                      {selectedStudents.length === studentData.length ? 'Deselect All' : 'Select All'}
                    </button>
                    <span className="text-sm text-gray-600">
                      {selectedStudents.length} of {studentData.length} students selected
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handlePreviewCertificates}
                      disabled={selectedStudents.length === 0}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Preview
                    </button>
                    <button
                      onClick={handleDownloadCertificates}
                      disabled={selectedStudents.length === 0 || loading}
                      className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Certificates
                    </button>
                  </div>
                </div>

                {/* Student List */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-medium mb-4">Select Students for Certificates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                    {studentData.map((student) => (
                      <label
                        key={student.id}
                        className="flex items-center space-x-3 p-3 bg-white rounded border hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={(e) => handleStudentSelect(student.id, e.target.checked)}
                          className="w-4 h-4 text-purple-600 rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {getStudentName(student)}
                          </p>
                          {getStudentClass(student) && (
                            <p className="text-sm text-gray-500">
                              Class: {getStudentClass(student)}
                            </p>
                          )}
                          {getStudentSchool(student) && (
                            <p className="text-xs text-gray-400 truncate">
                              {getStudentSchool(student)}
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                    {/* Certificate Preview */}
                    <CertificatePreview />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CertificateGenerator;