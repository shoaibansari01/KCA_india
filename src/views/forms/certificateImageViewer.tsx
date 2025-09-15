import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Share,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { fileDownloader } from '../../helper/http';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';

const { width, height } = Dimensions.get('window');

const CertificateImageViewer = ({ navigation, route }: any) => {
  const { certificates, schoolName, title } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const currentCertificate = certificates[currentIndex];

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setImageLoading(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < certificates.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setImageLoading(true);
    }
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      if (currentCertificate.certificate_url && currentCertificate.certificate_url !== 'true') {
        await fileDownloader(currentCertificate.certificate_url);
      } else {
        Alert.alert('Error', 'Invalid certificate URL');
      }
    } catch (error) {
      console.error('Error downloading certificate:', error);
      Alert.alert('Error', 'Failed to download certificate');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (currentCertificate.certificate_url && currentCertificate.certificate_url !== 'true') {
        await Share.share({
          message: `Certificate for ${currentCertificate.student_name} - ${schoolName}`,
          url: currentCertificate.certificate_url,
          title: 'Student Certificate',
        });
      } else {
        Alert.alert('Error', 'Cannot share - Invalid certificate URL');
      }
    } catch (error) {
      console.error('Error sharing certificate:', error);
      Alert.alert('Error', 'Failed to share certificate');
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = (error: any) => {
    console.error('Image load error:', error);
    setImageLoading(false);
  };

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
            {currentIndex + 1} of {certificates.length} • {schoolName}
          </Text>
        </View>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Icon name="share" color="#fff" size={20} />
        </TouchableOpacity>
      </View>

      {/* Certificate Image Container */}
      <View style={styles.imageContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          maximumZoomScale={3}
          minimumZoomScale={1}
        >
          {/* Student Info */}
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>
              {currentCertificate.student_name}
            </Text>
            <Text style={styles.fileName}>
              {currentCertificate.file_name}
            </Text>
          </View>

          {/* Certificate Image */}
          <View style={styles.certificateWrapper}>
            {imageLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#93278f" />
                <Text style={styles.loadingText}>Loading certificate...</Text>
              </View>
            )}
            
            <Image
              source={{ uri: currentCertificate.certificate_url }}
              style={styles.certificateImage}
              resizeMode="contain"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            
            {/* Error Fallback */}
            {!imageLoading && currentCertificate.certificate_url === 'true' && (
              <View style={styles.errorContainer}>
                <Icon name="error" color="#ccc" size={60} />
                <Text style={styles.errorText}>Certificate image not available</Text>
                <Text style={styles.errorSubtext}>
                  The certificate URL is invalid or the image could not be loaded.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Bottom Navigation and Controls */}
      <View style={styles.bottomSection}>
        {/* Navigation */}
        {certificates.length > 1 && (
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={[
                styles.navButton,
                currentIndex === 0 && styles.navButtonDisabled,
              ]}
              onPress={handlePrevious}
              disabled={currentIndex === 0}
            >
              <Icon
                name="chevron-left"
                color={currentIndex === 0 ? '#ccc' : '#93278f'}
                size={20}
              />
              <Text
                style={[
                  styles.navButtonText,
                  currentIndex === 0 && styles.navButtonTextDisabled,
                ]}
              >
                Previous
              </Text>
            </TouchableOpacity>

            <View style={styles.pageIndicator}>
              <Text style={styles.pageText}>
                {currentIndex + 1} / {certificates.length}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.navButton,
                currentIndex === certificates.length - 1 && styles.navButtonDisabled,
              ]}
              onPress={handleNext}
              disabled={currentIndex === certificates.length - 1}
            >
              <Text
                style={[
                  styles.navButtonText,
                  currentIndex === certificates.length - 1 && styles.navButtonTextDisabled,
                ]}
              >
                Next
              </Text>
              <Icon
                name="chevron-right"
                color={currentIndex === certificates.length - 1 ? '#ccc' : '#93278f'}
                size={20}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Download Button */}
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={handleDownload}
          disabled={loading || currentCertificate.certificate_url === 'true'}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Icon name="download" color="#fff" size={18} />
          )}
          <Text style={styles.downloadButtonText}>
            {loading ? 'Downloading...' : 'Download Certificate'}
          </Text>
        </TouchableOpacity>
      </View>
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
  shareButton: {
    padding: 5,
  },
  imageContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 15,
  },
  studentInfo: {
    alignItems: 'center' as const,
    marginBottom: 15,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  studentName: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold' as const,
    color: '#333',
    textAlign: 'center' as const,
  },
  fileName: {
    fontSize: responsiveFontSize(1.4),
    color: '#666',
    marginTop: 5,
    textAlign: 'center' as const,
  },
  certificateWrapper: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    minHeight: responsiveHeight(50),
    position: 'relative' as const,
  },
  loadingOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: responsiveFontSize(1.6),
    color: '#666',
  },
  certificateImage: {
    width: width - 30,
    height: responsiveHeight(60),
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  errorContainer: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 40,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed' as const,
  },
  errorText: {
    fontSize: responsiveFontSize(2),
    fontWeight: '600' as const,
    color: '#666',
    marginTop: 15,
    textAlign: 'center' as const,
  },
  errorSubtext: {
    fontSize: responsiveFontSize(1.6),
    color: '#999',
    textAlign: 'center' as const,
    marginTop: 8,
    lineHeight: 22,
  },
  bottomSection: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  navigationContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 15,
  },
  navButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    minWidth: 90,
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
  pageIndicator: {
    backgroundColor: 'rgba(147, 39, 143, 0.1)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pageText: {
    fontSize: responsiveFontSize(1.6),
    color: '#93278f',
    fontWeight: '600' as const,
  },
  downloadButton: {
    backgroundColor: '#28a745',
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 15,
    borderRadius: 10,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold' as const,
    marginLeft: 8,
  },
};

export default CertificateImageViewer;