import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import * as XLSX from 'xlsx';
import React, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import {style} from '../../style/style';
import {getReq, fileDownloader} from '../../helper/http';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';

const ViewStudentData = ({navigation, route}: any) => {
  const {data} = route.params;
  const [uploadedFiles, setUploadedFiles]: any = useState([]);
  const [loader, setLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUploadedFiles = async () => {
    try {
      setLoader(true);
      const formId = data?.values?._id;
      const response = await getReq({
        url: `get-student-data/${formId}`,
        returnKey: 'data',
        isAuthApi: true, // Explicitly ensure authentication is used
      });
      
      if (response && Array.isArray(response)) {
        // Transform the response to extract file information
        const processedFiles: any[] = [];
        response.forEach((item: any) => {
          if (item.file_paths && Array.isArray(item.file_paths)) {
            item.file_paths.forEach((filePath: string) => {
              processedFiles.push({
                file_name: filePath.split('/').pop() || 'Unknown File',
                file_path: filePath,
                file_url: `https://kca-bucket.s3.ap-south-1.amazonaws.com/${filePath}`,
                school_name: item.school_name || item.form_id?.school_name || 'Unknown School',
                upload_date: item.created_at,
                form_id: item.form_id?._id,
                principal_name: item.form_id?.principal_name,
                art_teacher: item.form_id?.name_of_art_teacher,
                student_count: null // This would need to be calculated from Excel file
              });
            });
          }
        });
        setUploadedFiles(processedFiles);
      } else {
        setUploadedFiles([]);
      }
    } catch (error) {
      console.error('Error fetching uploaded files:', error);
      Alert.alert('Error', 'Failed to fetch uploaded files');
      setUploadedFiles([]);
    } finally {
      setLoader(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUploadedFiles();
    setRefreshing(false);
  };

  const handleDownloadFile = async (file: any) => {
    try {
      Alert.alert(
        'Excel File Options',
        `${file.file_name}\n\nSchool: ${file.school_name}`,
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'View in App',
            onPress: () => {
              navigation.navigate('ExcelViewerScreen', {
                fileUrl: file.file_url,
                fileName: file.file_name,
              });
            },
          },
          {
            text: 'Download',
            onPress: () => {
              fileDownloader(file.file_url);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to process file');
    }
  };

  const parseExcelData = async (fileUrl: string) => {
    try {
      console.log('Downloading and parsing Excel file from URL:', fileUrl);
      
      // Download the Excel file
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.status}`);
      }
      
      // Get file as array buffer
      const arrayBuffer = await response.arrayBuffer();
      
      // Parse Excel file
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      console.log('Available sheets:', workbook.SheetNames);
      
      // Filter out sheets that should be ignored
      const validSheetNames = workbook.SheetNames.filter(sheetName => {
        const lowerSheetName = sheetName.toLowerCase().trim();
        // Ignore sheets with "not for use" in name (case insensitive)
        return !lowerSheetName.includes('not for use') && 
               !lowerSheetName.includes('notforuse') &&
               !lowerSheetName.includes('ignore') &&
               !lowerSheetName.includes('skip');
      });
      
      console.log('Valid sheets to process:', validSheetNames);
      
      if (validSheetNames.length === 0) {
        console.warn('No valid sheets found to process');
        return [];
      }
      
      // Array to store all students from all sheets
      const allStudents: any[] = [];
      
      // Process each valid sheet
      for (const sheetName of validSheetNames) {
        console.log(`Processing sheet: ${sheetName}`);
        
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const sheetData = XLSX.utils.sheet_to_json(worksheet);
        
        console.log(`Sheet "${sheetName}" has ${sheetData.length} rows`);
        
        if (sheetData.length === 0) {
          console.log(`Sheet "${sheetName}" is empty, skipping...`);
          continue;
        }
        
        // Log available columns for this sheet
        const columns = Object.keys(sheetData[0] || {});
        console.log(`Columns in sheet "${sheetName}":`, columns);
        
        // Validate that each student has required fields
        const validStudents = sheetData.filter((student: any) => {
          const hasName = student && (
            student['Name of the Participant'] || 
            student['Name'] || 
            student['name'] ||
            student['PARTICIPANT NAME'] ||
            student['Student Name']
          );
          const hasClass = student && (
            student['Class'] || 
            student['class'] ||
            student['CLASS'] ||
            student['Grade']
          );
          return hasName && hasClass;
        });
        
        console.log(`Sheet "${sheetName}": Found ${validStudents.length} valid students out of ${sheetData.length}`);
        
        // Normalize field names to match certificate template expectations
        const normalizedStudents = validStudents.map((student: any) => ({
          name: student['Name of the Participant'] || 
                student['Name'] || 
                student['name'] ||
                student['PARTICIPANT NAME'] ||
                student['Student Name'] || 'Unknown Student',
          class: student['Class'] || 
                 student['class'] ||
                 student['CLASS'] ||
                 student['Grade'] || 'N/A',
          school: student['Name of the School'] || 
                  student['School'] ||
                  student['school'] ||
                  student['SCHOOL'] ||
                  student['School Name'] || 'Unknown School',
          rollNo: student['Roll No'] || student['roll_no'] || student['rollNo'] || '',
          fatherName: student["Father's Name"] || student['father_name'] || student['fatherName'] || '',
          age: student['Age'] || student['age'] || '',
          sheetName: sheetName // Add sheet name for reference
        }));
        
        // Add students from this sheet to the main array
        allStudents.push(...normalizedStudents);
        
        console.log(`Added ${normalizedStudents.length} students from sheet "${sheetName}"`);
      }
      
      console.log(`Total students parsed from all sheets: ${allStudents.length}`);
      
      if (allStudents.length === 0) {
        console.warn('No students found with required Name and Class fields in any sheet');
        return [];
      }
      
      console.log('Sample normalized student:', allStudents[0]);
      console.log('Students by sheet:', 
        validSheetNames.map(sheet => ({
          sheet, 
          count: allStudents.filter(s => s.sheetName === sheet).length
        }))
      );
      
      return allStudents;
      
    } catch (error: any) {
      console.error('Error parsing Excel data:', error);
      throw new Error(`Failed to parse Excel file: ${error.message}`);
    }
  };

  const handleViewCertificates = async (file: any) => {
    try {
      Alert.alert(
        'Generate Certificates',
        `Generate certificates for all students in ${file.file_name}?`,
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Generate',
            onPress: async () => {
              setLoader(true);
              
              try {
                // Parse actual Excel data from server
                const studentData = await parseExcelData(file.file_url);
                
                if (studentData.length === 0) {
                  Alert.alert(
                    'No Student Data Found',
                    'Unable to extract student data from the Excel file. Please ensure the file contains student information with Name, Class, and School columns.',
                    [{text: 'OK'}]
                  );
                  return;
                }
                
                console.log('Student data for certificates:', studentData);
                
                navigation.navigate('CertificateViewer', {
                  students: studentData,
                  schoolName: studentData[0]?.school || file.school_name,
                  fileName: file.file_name,
                });
              } catch (error) {
                console.error('Certificate generation error:', error);
                Alert.alert(
                  'Error',
                  'Failed to parse student data from Excel file. Please check your internet connection and try again.'
                );
              } finally {
                setLoader(false);
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to generate certificates');
    }
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const renderFileCard = (file: any, index: number) => {
    const isExcel = file.file_name?.endsWith('.xlsx') || file.file_name?.endsWith('.xls');
    return (
      <View key={index} style={styles.fileCard}>
        <View style={styles.cardHeader}>
          <Icon 
            name={isExcel ? "table-chart" : "insert-drive-file"} 
            color="#fff" 
            size={24} 
          />
          <View style={styles.fileInfo}>
            <Text style={styles.fileName}>
              {file.file_name || `File ${index + 1}`}
            </Text>
            <Text style={styles.schoolName}>
              {file.school_name || 'Unknown School'}
            </Text>
          </View>
        </View>
        
        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>File Type:</Text>
            <Text style={styles.fileType}>
              {isExcel ? 'Excel Spreadsheet' : 'Document'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Upload Date:</Text>
            <Text style={styles.value}>
              {file.upload_date 
                ? new Date(file.upload_date).toLocaleDateString()
                : 'Unknown'
              }
            </Text>
          </View>
          
          {file.principal_name && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Principal:</Text>
              <Text style={styles.value}>
                {file.principal_name}
              </Text>
            </View>
          )}
          
          {file.art_teacher && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Art Teacher:</Text>
              <Text style={styles.value}>
                {file.art_teacher}
              </Text>
            </View>
          )}
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.viewButton}
              onPress={() => navigation.navigate('ExcelViewerScreen', {
                fileUrl: file.file_url,
                fileName: file.file_name,
              })}
            >
              <Icon name="visibility" color="#fff" size={16} />
              <Text style={styles.buttonText}>View</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.certificateButton}
              onPress={() => handleViewCertificates(file)}
              disabled={loader}
            >
              {loader ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Icon name="card-membership" color="#fff" size={16} />
              )}
              <Text style={styles.buttonText}>
                {loader ? 'Loading...' : 'Certificates'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.downloadButton}
              onPress={() => fileDownloader(file.file_url)}
            >
              <Icon name="download" color="#fff" size={16} />
              <Text style={styles.buttonText}>Download</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={style.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <Icon
            name="arrow-back"
            color="#130F26"
            size={22}
            style={{marginRight: 14}}
          />
          <Text style={[style.fs18, style.boldText, style.textColorBlack]}>
            View My Students
          </Text>
        </TouchableOpacity>

        {loader && !refreshing ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#93278f" />
            <Text style={styles.loadingText}>Loading uploaded files...</Text>
          </View>
        ) : (
          <ScrollView
            style={{flex: 1}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View style={styles.headerSection}>
              <Text style={styles.totalCount}>
                Total Files: {uploadedFiles.length}
              </Text>
              {uploadedFiles.length > 0 && (
                <TouchableOpacity
                  style={styles.refreshButton}
                  onPress={onRefresh}>
                  <Icon name="refresh" color="#93278f" size={20} />
                  <Text style={styles.refreshText}>Refresh</Text>
                </TouchableOpacity>
              )}
            </View>

            {uploadedFiles.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Icon name="file-copy" color="#ccc" size={60} />
                <Text style={styles.emptyText}>No files uploaded yet</Text>
                <Text style={styles.emptySubText}>
                  Upload Excel files first to view and download them here
                </Text>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => navigation.navigate('UploadData', {data})}>
                  <Text style={styles.uploadButtonText}>Upload Student Data</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.filesContainer}>
                {uploadedFiles.map((file: any, index: number) =>
                  renderFileCard(file, index),
                )}
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = {
  loaderContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  loadingText: {
    marginTop: 10,
    fontSize: responsiveFontSize(2),
    color: '#666',
  },
  headerSection: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  totalCount: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold' as const,
    color: '#130F26',
  },
  refreshButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  refreshText: {
    marginLeft: 5,
    color: '#93278f',
    fontWeight: 'bold' as const,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingVertical: responsiveHeight(10),
  },
  emptyText: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold' as const,
    color: '#666',
    marginTop: 20,
  },
  emptySubText: {
    fontSize: responsiveFontSize(1.8),
    color: '#999',
    textAlign: 'center' as const,
    marginTop: 10,
    marginHorizontal: 40,
  },
  uploadButton: {
    backgroundColor: '#93278f',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold' as const,
    fontSize: responsiveFontSize(1.8),
  },
  filesContainer: {
    paddingBottom: 20,
  },
  fileCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    backgroundColor: '#93278f',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 15,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  fileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  fileName: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold' as const,
    color: '#fff',
  },
  schoolName: {
    fontSize: responsiveFontSize(1.6),
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  cardBody: {
    padding: 15,
  },
  infoRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600' as const,
    color: '#333',
    flex: 1,
  },
  value: {
    fontSize: responsiveFontSize(1.8),
    color: '#666',
    flex: 2,
    textAlign: 'right' as const,
  },
  fileType: {
    fontSize: responsiveFontSize(1.8),
    color: '#93278f',
    fontWeight: '600' as const,
    flex: 2,
    textAlign: 'right' as const,
  },
  studentCount: {
    fontSize: responsiveFontSize(1.8),
    color: '#28a745',
    fontWeight: '600' as const,
    flex: 2,
    textAlign: 'right' as const,
  },
  buttonContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginTop: 15,
    gap: 8,
  },
  viewButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flex: 1,
  },
  certificateButton: {
    backgroundColor: '#FF9800',
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flex: 1,
  },
  downloadButton: {
    backgroundColor: '#28a745',
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold' as const,
    fontSize: responsiveFontSize(1.6),
    marginLeft: 6,
  },
};

export default ViewStudentData;