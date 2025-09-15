import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Image,
  Dimensions,
  FlatList,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, CheckBox } from 'react-native-elements';
import { style } from '../../style/style';
import { postReq, getReq, fileDownloader } from '../../helper/http';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const { width } = Dimensions.get('window');

const ViewStudentCertificates = ({ navigation, route }: any) => {
  const { data } = route.params;
  const [certificates, setCertificates] = useState([]);
  const [allCertificates, setAllCertificates] = useState([]); // Flattened list of all certificates
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCertificates, setSelectedCertificates] = useState<string[]>([]);
  const [downloadingMultiple, setDownloadingMultiple] = useState(false);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await getReq({
        url: 'get-user-certificates',
        returnKey: 'data',
      });
      
      if (response?.records && response.records.length > 0) {
        setCertificates(response.records);
        
        // Flatten all certificates into a single list with additional metadata
        const flatCertificates = [];
        response.records.forEach((record: any) => {
          record.certificates.forEach((cert: any, index: number) => {
            flatCertificates.push({
              ...cert,
              id: `${record.record_id}_${index}`,
              school_name: record.school_name,
              form_type: record.form_type,
              received_at: record.certificates_received_at,
              record_id: record.record_id,
            });
          });
        });
        setAllCertificates(flatCertificates);
      } else {
        setCertificates([]);
        setAllCertificates([]);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
      Alert.alert('Error', 'Failed to load certificates');
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setSelectedCertificates([]);
    await fetchCertificates();
    setRefreshing(false);
  };

  const handleCertificateImagePress = (certificate: any) => {
    // Navigate to single certificate image viewer
    navigation.navigate('CertificateImageViewer', {
      certificates: [certificate],
      schoolName: certificate.school_name || 'School Name',
      title: 'Student Certificate',
    });
  };

  const handleSelectCertificate = (certificateId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedCertificates(prev => [...prev, certificateId]);
    } else {
      setSelectedCertificates(prev => prev.filter(id => id !== certificateId));
    }
  };

  const handleSelectAll = () => {
    if (selectedCertificates.length === allCertificates.length) {
      setSelectedCertificates([]);
    } else {
      setSelectedCertificates(allCertificates.map(cert => cert.id));
    }
  };

  const handleDownloadSelected = async () => {
    if (selectedCertificates.length === 0) {
      Alert.alert('No Selection', 'Please select at least one certificate to download.');
      return;
    }

    if (selectedCertificates.length === 1) {
      // Single certificate download
      const certificate = allCertificates.find(cert => cert.id === selectedCertificates[0]);
      if (certificate) {
        await handleSingleDownload(certificate.certificate_url, certificate.file_name);
      }
    } else {
      // Multiple certificates - show batch download alert
      Alert.alert(
        'Download Multiple Certificates',
        `You have selected ${selectedCertificates.length} certificates. Each certificate will be downloaded individually to your Downloads folder.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Download All',
            onPress: () => handleMultipleDownload(),
          },
        ]
      );
    }
  };

  const handleSingleDownload = async (certificateUrl: string, fileName: string) => {
    try {
      if (certificateUrl && certificateUrl !== 'true') {
        await fileDownloader(certificateUrl);
      } else {
        Alert.alert('Error', 'Invalid certificate URL');
      }
    } catch (error) {
      console.error('Error downloading certificate:', error);
      Alert.alert('Error', 'Failed to download certificate');
    }
  };

  const handleMultipleDownload = async () => {
    try {
      setDownloadingMultiple(true);
      
      const selectedCerts = allCertificates.filter(cert => 
        selectedCertificates.includes(cert.id)
      );

      console.log(`Starting download of ${selectedCerts.length} certificates...`);
      
      let successCount = 0;
      let failedCount = 0;
      
      // Download certificates one by one using the existing fileDownloader function
      for (let i = 0; i < selectedCerts.length; i++) {
        const cert = selectedCerts[i];
        
        try {
          console.log(`Downloading certificate ${i + 1}/${selectedCerts.length}: ${cert.student_name}`);
          
          if (cert.certificate_url && cert.certificate_url !== 'true') {
            // Use the same fileDownloader function that works for single downloads
            await fileDownloader(cert.certificate_url);
            successCount++;
            console.log(`✅ Downloaded: ${cert.student_name}`);
            
            // Small delay between downloads to avoid overwhelming the system
            await new Promise(resolve => setTimeout(resolve, 1000));
          } else {
            console.log(`❌ Invalid URL for: ${cert.student_name}`);
            failedCount++;
          }
        } catch (error) {
          console.error(`❌ Failed to download ${cert.student_name}:`, error);
          failedCount++;
        }
      }

      // Show completion message
      let message = '';
      if (successCount > 0 && failedCount === 0) {
        message = `🎉 All ${successCount} certificates downloaded successfully to Downloads folder!`;
      } else if (successCount > 0 && failedCount > 0) {
        message = `📄 Downloaded ${successCount} out of ${selectedCerts.length} certificates.\n${failedCount} certificates failed to download.`;
      } else {
        message = `❌ Failed to download any certificates. Please check your internet connection and try again.`;
      }

      Alert.alert('Download Complete', message);
      setSelectedCertificates([]);
      
    } catch (error) {
      console.error('Error in multiple download:', error);
      Alert.alert('Download Error', 'An error occurred while downloading certificates. Please try again.');
    } finally {
      setDownloadingMultiple(false);
    }
  };


  const renderCertificateItem = ({ item }: { item: any }) => {
    const isSelected = selectedCertificates.includes(item.id);
    
    return (
      <View style={styles.certificateItem}>
        {/* Checkbox */}
        <CheckBox
          checked={isSelected}
          onPress={() => handleSelectCertificate(item.id, !isSelected)}
          containerStyle={styles.checkboxContainer}
          checkedColor="#93278f"
        />

        {/* Certificate Image */}
        <TouchableOpacity
          onPress={() => handleCertificateImagePress(item)}
          style={styles.imageContainer}
        >
          <Image
            source={{ uri: item.certificate_url }}
            style={styles.certificateImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay}>
            <Icon name="zoom-in" color="#fff" size={16} />
          </View>
        </TouchableOpacity>

        {/* Certificate Info */}
        <View style={styles.certificateInfo}>
          <Text style={styles.studentName}>{item.student_name}</Text>
          <Text style={styles.schoolName}>{item.school_name}</Text>
          <View style={styles.metaInfo}>
            <View style={styles.formTypeBadge}>
              <Text style={styles.formTypeText}>{item.form_type}</Text>
            </View>
            <Text style={styles.dateText}>
              {item.received_at 
                ? new Date(item.received_at).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'N/A'
              }
            </Text>
          </View>
        </View>

        {/* Individual Download */}
        <TouchableOpacity
          onPress={() => handleSingleDownload(item.certificate_url, item.file_name)}
          style={styles.individualDownloadButton}
        >
          <Icon name="download" color="#93278f" size={20} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="card-membership" color="#ccc" size={80} />
      <Text style={styles.emptyTitle}>No Certificates Found</Text>
      <Text style={styles.emptyMessage}>
        Certificates will appear here once they are generated and sent to you.
      </Text>
      <TouchableOpacity style={styles.refreshButton} onPress={fetchCertificates}>
        <Icon name="refresh" color="#93278f" size={20} />
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" color="#fff" size={24} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Student Certificates</Text>
          <Text style={styles.headerSubtitle}>
            {data?.title || 'National Talent Search Competition'}
          </Text>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#93278f" />
          <Text style={styles.loadingText}>Loading certificates...</Text>
        </View>
      ) : allCertificates.length === 0 ? (
        renderEmptyState()
      ) : (
        <View style={styles.contentContainer}>
          {/* Selection Controls */}
          <View style={styles.selectionContainer}>
            <View style={styles.selectionInfo}>
              <TouchableOpacity onPress={handleSelectAll} style={styles.selectAllButton}>
                <Icon 
                  name={selectedCertificates.length === allCertificates.length ? "check-box" : "check-box-outline-blank"} 
                  color="#93278f" 
                  size={20} 
                />
                <Text style={styles.selectAllText}>
                  {selectedCertificates.length === allCertificates.length ? 'Deselect All' : 'Select All'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.countText}>
                {selectedCertificates.length} of {allCertificates.length} selected
              </Text>
            </View>
            
            {selectedCertificates.length > 0 && (
              <TouchableOpacity 
                onPress={handleDownloadSelected} 
                style={styles.downloadSelectedButton}
                disabled={downloadingMultiple}
              >
                {downloadingMultiple ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Icon name="download" color="#fff" size={18} />
                )}
                <Text style={styles.downloadSelectedText}>
                  {downloadingMultiple ? 'Downloading...' : `Download (${selectedCertificates.length})`}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Certificate List */}
          <FlatList
            data={allCertificates}
            renderItem={renderCertificateItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.listContainer}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#93278f',
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 15,
    paddingHorizontal: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: responsiveFontSize(1.8),
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 40,
  },
  emptyTitle: {
    fontSize: responsiveFontSize(2.4),
    fontWeight: 'bold' as const,
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyMessage: {
    fontSize: responsiveFontSize(1.8),
    color: '#666',
    textAlign: 'center' as const,
    lineHeight: 24,
    marginBottom: 30,
  },
  refreshButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: 'rgba(147, 39, 143, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#93278f',
  },
  refreshButtonText: {
    marginLeft: 8,
    fontSize: responsiveFontSize(1.8),
    color: '#93278f',
    fontWeight: '600' as const,
  },
  contentContainer: {
    flex: 1,
  },
  selectionContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  selectionInfo: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
  },
  selectAllButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginRight: 15,
  },
  selectAllText: {
    marginLeft: 6,
    fontSize: responsiveFontSize(1.7),
    color: '#93278f',
    fontWeight: '600' as const,
  },
  countText: {
    fontSize: responsiveFontSize(1.5),
    color: '#666',
  },
  downloadSelectedButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#28a745',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  downloadSelectedText: {
    color: '#fff',
    fontSize: responsiveFontSize(1.6),
    fontWeight: '600' as const,
    marginLeft: 6,
  },
  listContainer: {
    paddingVertical: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 15,
  },
  certificateItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  checkboxContainer: {
    margin: 0,
    padding: 0,
    marginRight: 10,
  },
  imageContainer: {
    position: 'relative' as const,
    marginRight: 12,
  },
  certificateImage: {
    width: 60,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  imageOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    opacity: 0.8,
  },
  certificateInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: responsiveFontSize(1.9),
    fontWeight: 'bold' as const,
    color: '#333',
    marginBottom: 4,
  },
  schoolName: {
    fontSize: responsiveFontSize(1.6),
    color: '#666',
    marginBottom: 6,
  },
  metaInfo: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  formTypeBadge: {
    backgroundColor: 'rgba(147, 39, 143, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  formTypeText: {
    fontSize: responsiveFontSize(1.2),
    color: '#93278f',
    fontWeight: '600' as const,
  },
  dateText: {
    fontSize: responsiveFontSize(1.3),
    color: '#999',
  },
  individualDownloadButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(147, 39, 143, 0.1)',
  },
};

export default ViewStudentCertificates;