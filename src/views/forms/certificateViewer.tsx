import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Share,
  PermissionsAndroid,
  Platform,
  Modal,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import CertificateTemplate from '../../components/CertificateTemplate';
import {
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {captureRef} from 'react-native-view-shot';
import ReactNativeBlobUtil from 'react-native-blob-util';

const CertificateViewer = ({navigation, route}: any) => {
  const {students, schoolName} = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState('All');
  const [showSheetModal, setShowSheetModal] = useState(false);
  const certificateRef = useRef(null);

  // Get unique sheet names from students data
  const uniqueSheetNames = students.map((student: any) => student.sheetName).filter((name: any) => name);
  const availableSheets: string[] = ['All', ...Array.from(new Set(uniqueSheetNames)) as string[]];
  
  // Filter students based on selected sheet
  const filteredStudents = selectedSheet === 'All' 
    ? students 
    : students.filter((student: any) => student.sheetName === selectedSheet);

  const currentStudent = filteredStudents[currentIndex];
  
  // Debug logging
  console.log('CertificateViewer - Students:', students);
  console.log('CertificateViewer - School Name:', schoolName);
  console.log('CertificateViewer - Current Student:', currentStudent);

  const generateCertificateId = (studentName: string, index: number) => {
    const date = new Date();
    const year = date.getFullYear();
    const nameCode = studentName.substring(0, 3).toUpperCase();
    return `KCA-${year}-${nameCode}-${String(index + 1).padStart(3, '0')}`;
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredStudents.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSheetChange = (sheetName: string) => {
    setSelectedSheet(sheetName);
    setCurrentIndex(0); // Reset to first student when changing sheet
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        // Check Android version
        const androidVersion = Platform.Version;
        console.log('Android Version:', androidVersion);

        // For Android 10+ (API 29+), we don't need WRITE_EXTERNAL_STORAGE for app-specific directories
        if (androidVersion >= 29) {
          return true; // No permission needed for scoped storage
        }

        // Check if permission is already granted
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        
        if (hasPermission) {
          return true;
        }

        // Request permission
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'This app needs access to storage to download certificates',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        
        console.log('Permission result:', granted);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission error:', err);
        return false;
      }
    }
    return true; // iOS doesn't need this permission
  };

  const handleDownloadCertificate = async () => {
    try {
      setLoading(true);
      
      // Check storage permission
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission Required', 'Storage permission is required to download certificates');
        return;
      }

      // Capture certificate as image
      const uri = await captureRef(certificateRef, {
        format: 'png',
        quality: 1,
      });

      console.log('Captured URI:', uri);

      // Generate filename
      const timestamp = new Date().getTime();
      const filename = `Certificate_${currentStudent.name.replace(/\s+/g, '_')}_${timestamp}.png`;

      let downloadPath;
      
      if (Platform.OS === 'android') {
        // For Android, use Downloads directory
        downloadPath = `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/${filename}`;
        
        console.log('Download path:', downloadPath);
        
        // Copy file directly from captured URI to Downloads folder
        await ReactNativeBlobUtil.fs.cp(uri, downloadPath);
        
        // Add to Android MediaStore for gallery visibility
        try {
          await ReactNativeBlobUtil.MediaCollection.copyToMediaStore({
            name: filename,
            parentFolder: '',
            mimeType: 'image/png',
          }, 'Download', downloadPath);
          console.log('Added to MediaStore successfully');
        } catch (mediaError) {
          console.warn('MediaStore error (non-critical):', mediaError);
        }
        
      } else {
        // iOS - save to Photos Library using react-native-blob-util
        downloadPath = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${filename}`;
        await ReactNativeBlobUtil.fs.cp(uri, downloadPath);
        
        // For iOS, also try to save to Photos Library
        try {
          await ReactNativeBlobUtil.ios.previewDocument(downloadPath);
        } catch (iosError) {
          console.warn('iOS save error:', iosError);
        }
      }

      console.log('File saved successfully to:', downloadPath);

      Alert.alert(
        'Certificate Downloaded',
        Platform.OS === 'android' 
          ? `Certificate saved to Downloads folder as ${filename}` 
          : `Certificate saved successfully as ${filename}`,
        [
          {text: 'OK'},
          {
            text: 'Share',
            onPress: async () => {
              try {
                console.log('Starting share process...');
                console.log('Original URI:', uri);
                console.log('Download Path:', downloadPath);
                
                if (Platform.OS === 'android') {
                  // For Android, use the downloaded file with file:// protocol
                  const shareUri = `file://${downloadPath}`;
                  console.log('Android Share URI:', shareUri);
                  
                  const result = await Share.share({
                    url: shareUri,
                    title: 'Certificate',
                    message: `Certificate for ${currentStudent.name} - KCA Group`,
                  });
                  
                  console.log('Share result:', result);
                  
                } else {
                  // For iOS, use the original captured URI
                  console.log('iOS Share URI:', uri);
                  
                  const result = await Share.share({
                    url: uri,
                    message: `Certificate for ${currentStudent.name} - KCA Group`,
                  });
                  
                  console.log('Share result:', result);
                }
                
              } catch (error) {
                console.error('Share error:', error);
                
                // Fallback approach: create a base64 share
                try {
                  console.log('Trying fallback share method...');
                  
                  // Read the file as base64 and create data URL
                  const base64Data = await ReactNativeBlobUtil.fs.readFile(downloadPath, 'base64');
                  const dataUri = `data:image/png;base64,${base64Data}`;
                  
                  await Share.share({
                    url: dataUri,
                    message: `Certificate for ${currentStudent.name} - KCA Group`,
                  });
                  
                } catch (fallbackError) {
                  console.error('Fallback share error:', fallbackError);
                  Alert.alert('Error', 'Failed to share certificate. The file has been saved to your Downloads folder.');
                }
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', `Failed to download certificate: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAll = async () => {
    // Show dropdown modal for sheet selection
    setShowSheetModal(true);
  };

  const downloadCertificatesForSheet = async (sheetToDownload: string) => {
    const studentsToDownload = sheetToDownload === 'All' 
      ? students 
      : students.filter((student: any) => student.sheetName === sheetToDownload);
    
    const downloadCount = studentsToDownload.length;
    const sheetText = sheetToDownload === 'All' ? 'all sheets' : `sheet "${sheetToDownload}"`;
    
    Alert.alert(
      'Confirm Download',
      `Download ${downloadCount} certificates from ${sheetText}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Download All',
          onPress: async () => {
            setLoading(true);
            try {
              // Check storage permission
              const hasPermission = await requestStoragePermission();
              if (!hasPermission) {
                Alert.alert('Permission Required', 'Storage permission is required to download certificates');
                return;
              }

              let successCount = 0;

              for (let i = 0; i < studentsToDownload.length; i++) {
                // Update current index to show the student being processed
                // Find the global index of the student being downloaded
                const globalIndex = students.findIndex((s: any) => s === studentsToDownload[i]);
                
                // Update the UI to show the current student being processed
                if (sheetToDownload === selectedSheet || sheetToDownload === 'All') {
                  // Only update UI if we're downloading from currently selected sheet or all
                  const localIndex = sheetToDownload === 'All' ? globalIndex : 
                    filteredStudents.findIndex((s: any) => s === studentsToDownload[i]);
                  if (localIndex >= 0) {
                    setCurrentIndex(localIndex);
                  }
                }
                
                // Wait for component to update
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                try {
                  const uri = await captureRef(certificateRef, {
                    format: 'png',
                    quality: 1,
                  });

                  // Generate filename for each student
                  const timestamp = new Date().getTime() + i; // Add index to avoid same timestamp
                  const sheetPrefix = studentsToDownload[i].sheetName ? `${studentsToDownload[i].sheetName}_` : '';
                  const filename = `Certificate_${sheetPrefix}${studentsToDownload[i].name.replace(/\s+/g, '_')}_${timestamp}.png`;

                  if (Platform.OS === 'android') {
                    // For Android, save to Downloads folder
                    const downloadPath = `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/${filename}`;
                    await ReactNativeBlobUtil.fs.cp(uri, downloadPath);
                    
                    // Add to media store for visibility in gallery/downloads
                    try {
                      await ReactNativeBlobUtil.MediaCollection.copyToMediaStore({
                        name: filename,
                        parentFolder: '',
                        mimeType: 'image/png',
                      }, 'Download', downloadPath);
                    } catch (mediaError) {
                      console.warn('Media store error:', mediaError);
                    }
                  } else {
                    // iOS - save to Documents directory
                    const {dirs} = ReactNativeBlobUtil.fs;
                    const downloadPath = `${dirs.DocumentDir}/${filename}`;
                    await ReactNativeBlobUtil.fs.cp(uri, downloadPath);
                  }

                  successCount++;
                } catch (error) {
                  console.error(`Failed to download certificate for ${studentsToDownload[i].name}:`, error);
                }
              }

              Alert.alert(
                'Download Complete', 
                `${successCount} out of ${studentsToDownload.length} certificates from ${sheetText} downloaded successfully to Downloads folder.`
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to download all certificates');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f5'}}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" color="#fff" size={24} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Student Certificates</Text>
          <Text style={styles.headerSubtitle}>
            {currentIndex + 1} of {filteredStudents.length}
            {selectedSheet !== 'All' && ` • ${selectedSheet}`}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleDownloadAll}
          style={styles.downloadAllButton}>
          <Icon name="download" color="#fff" size={20} />
        </TouchableOpacity>
      </View>

      <View style={{flex: 1}}>
        {/* Sheet Selector */}
        {availableSheets.length > 2 && (
          <View style={styles.sheetSelectorContainer}>
            <Text style={styles.sheetSelectorTitle}>Select Sheet:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sheetSelector}>
              {availableSheets.map((sheetName: string) => (
                <TouchableOpacity
                  key={sheetName}
                  style={[
                    styles.sheetTab,
                    selectedSheet === sheetName && styles.sheetTabActive
                  ]}
                  onPress={() => handleSheetChange(sheetName)}
                >
                  <Text style={[
                    styles.sheetTabText,
                    selectedSheet === sheetName && styles.sheetTabTextActive
                  ]}>
                    {sheetName === 'All' ? `All (${students.length})` : `${sheetName} (${students.filter((s: any) => s.sheetName === sheetName).length})`}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Certificate */}
          <View ref={certificateRef} style={styles.certificateWrapper}>
            <CertificateTemplate
              studentName={currentStudent?.name || 'Student Name'}
              className={currentStudent?.class || 'N/A'}
              schoolName={schoolName || 'School Name'}
            />
          </View>
        </ScrollView>

        {/* Bottom Section with Navigation and Download */}
        <View style={styles.bottomSection}>
          {/* Student Name Display */}
          <View style={styles.studentInfoBottom}>
            <Text style={styles.studentNameBottom}>{currentStudent?.name || 'Student Name'}</Text>
            <Text style={styles.studentClassBottom}>Class: {currentStudent?.class || 'N/A'}</Text>
          </View>

          {/* Navigation and Download Controls */}
          <View style={styles.controlsContainer}>
            {/* Navigation Controls */}
            <View style={styles.navigationContainer}>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  currentIndex === 0 && styles.navButtonDisabled,
                ]}
                onPress={handlePrevious}
                disabled={currentIndex === 0}>
                <Icon
                  name="chevron-left"
                  color={currentIndex === 0 ? '#ccc' : '#93278f'}
                  size={20}
                />
                <Text
                  style={[
                    styles.navButtonText,
                    currentIndex === 0 && styles.navButtonTextDisabled,
                  ]}>
                  Previous
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.navButton,
                  currentIndex === filteredStudents.length - 1 && styles.navButtonDisabled,
                ]}
                onPress={handleNext}
                disabled={currentIndex === filteredStudents.length - 1}>
                <Text
                  style={[
                    styles.navButtonText,
                    currentIndex === filteredStudents.length - 1 &&
                      styles.navButtonTextDisabled,
                  ]}>
                  Next
                </Text>
                <Icon
                  name="chevron-right"
                  color={
                    currentIndex === filteredStudents.length - 1 ? '#ccc' : '#93278f'
                  }
                  size={20}
                />
              </TouchableOpacity>
            </View>

            {/* Download Button */}
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={handleDownloadCertificate}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Icon name="download" color="#fff" size={18} />
              )}
              <Text style={styles.buttonText}>
                {loading ? 'Saving...' : 'Download Certificate'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Sheet Selection Modal */}
      <Modal
        visible={showSheetModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSheetModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Sheet to Download</Text>
              <TouchableOpacity
                onPress={() => setShowSheetModal(false)}
                style={styles.modalCloseButton}
              >
                <Icon name="close" color="#666" size={24} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.sheetList} showsVerticalScrollIndicator={false}>
              {availableSheets.map((sheetName: string) => {
                const count = sheetName === 'All' ? students.length : students.filter((s: any) => s.sheetName === sheetName).length;
                return (
                  <TouchableOpacity
                    key={sheetName}
                    style={styles.sheetOption}
                    onPress={() => {
                      setShowSheetModal(false);
                      downloadCertificatesForSheet(sheetName);
                    }}
                  >
                    <View style={styles.sheetOptionContent}>
                      <Icon 
                        name={sheetName === 'All' ? 'select-all' : 'table-chart'} 
                        color="#93278f" 
                        size={20} 
                      />
                      <View style={styles.sheetOptionText}>
                        <Text style={styles.sheetOptionName}>{sheetName}</Text>
                        <Text style={styles.sheetOptionCount}>{count} certificates</Text>
                      </View>
                      <Icon name="chevron-right" color="#ccc" size={20} />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = {
  header: {
    backgroundColor: '#93278f',
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 15,
    paddingHorizontal: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButton: {
    padding: 5,
  },
  headerContent: {
    flex: 1,
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold' as const,
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: responsiveFontSize(1.6),
    color: 'rgba(255,255,255,0.8)',
  },
  downloadAllButton: {
    padding: 5,
  },
  sheetSelectorContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sheetSelectorTitle: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: '600' as const,
    color: '#333',
    marginBottom: 8,
  },
  sheetSelector: {
    flexDirection: 'row' as const,
  },
  sheetTab: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sheetTabActive: {
    backgroundColor: '#93278f',
    borderColor: '#93278f',
  },
  sheetTabText: {
    fontSize: responsiveFontSize(1.4),
    color: '#666',
    fontWeight: '500' as const,
  },
  sheetTabTextActive: {
    color: '#fff',
    fontWeight: '600' as const,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  certificateWrapper: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bottomSection: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  studentInfoBottom: {
    alignItems: 'center' as const,
    marginBottom: 15,
  },
  studentNameBottom: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold' as const,
    color: '#333',
    textAlign: 'center' as const,
  },
  studentClassBottom: {
    fontSize: responsiveFontSize(1.6),
    color: '#666',
    marginTop: 2,
  },
  controlsContainer: {
    gap: 15,
  },
  navigationContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  navButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    minWidth: 100,
    justifyContent: 'center' as const,
  },
  navButtonDisabled: {
    backgroundColor: '#f9f9f9',
  },
  navButtonText: {
    fontSize: responsiveFontSize(1.5),
    color: '#93278f',
    fontWeight: '600' as const,
    marginHorizontal: 5,
  },
  navButtonTextDisabled: {
    color: '#ccc',
  },
  downloadButton: {
    backgroundColor: '#28a745',
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold' as const,
    marginLeft: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    width: '90%' as const,
    maxHeight: '70%' as const,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold' as const,
    color: '#333',
  },
  modalCloseButton: {
    padding: 5,
  },
  sheetList: {
    maxHeight: 400,
  },
  sheetOption: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  sheetOptionContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  sheetOptionText: {
    flex: 1,
    marginLeft: 15,
  },
  sheetOptionName: {
    fontSize: responsiveFontSize(2),
    fontWeight: '600' as const,
    color: '#333',
    marginBottom: 2,
  },
  sheetOptionCount: {
    fontSize: responsiveFontSize(1.6),
    color: '#666',
  },
};

export default CertificateViewer;