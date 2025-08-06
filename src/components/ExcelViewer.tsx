import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import {WebView} from 'react-native-webview';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

interface ExcelViewerProps {
  fileUrl: string;
  fileName: string;
  onClose: () => void;
}

const ExcelViewer: React.FC<ExcelViewerProps> = ({
  fileUrl,
  fileName,
  onClose,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Create Google Sheets viewer URL for Excel files
  const getViewerUrl = (url: string) => {
    return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
      url,
    )}`;
  };

  const handleError = () => {
    setError(true);
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  const handleDownload = () => {
    Alert.alert(
      'Download File',
      'Would you like to download this Excel file to view it in your device\'s Excel app?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Download',
          onPress: () => {
            // This would trigger the file download
            onClose();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="close" color="#fff" size={24} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.fileName} numberOfLines={1}>
            {fileName}
          </Text>
          <Text style={styles.fileType}>Excel Spreadsheet</Text>
        </View>
        <TouchableOpacity onPress={handleDownload} style={styles.downloadButton}>
          <Icon name="download" color="#fff" size={20} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#93278f" />
            <Text style={styles.loadingText}>Loading Excel file...</Text>
          </View>
        )}

        {error ? (
          <View style={styles.errorContainer}>
            <Icon name="error-outline" color="#f44336" size={60} />
            <Text style={styles.errorTitle}>Unable to display Excel file</Text>
            <Text style={styles.errorMessage}>
              The file might be too large or in an unsupported format.
            </Text>
            <TouchableOpacity
              style={styles.downloadButtonLarge}
              onPress={handleDownload}>
              <Icon name="download" color="#fff" size={18} />
              <Text style={styles.downloadButtonText}>Download to View</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <WebView
            source={{uri: getViewerUrl(fileUrl)}}
            style={styles.webview}
            onLoad={handleLoad}
            onError={handleError}
            startInLoadingState={true}
            scalesPageToFit={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
          />
        )}
      </View>
    </View>
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  closeButton: {
    padding: 5,
  },
  headerContent: {
    flex: 1,
    marginLeft: 15,
  },
  fileName: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold' as const,
    color: '#fff',
  },
  fileType: {
    fontSize: responsiveFontSize(1.6),
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  downloadButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 15,
    fontSize: responsiveFontSize(2),
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: '#fff',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold' as const,
    color: '#333',
    marginTop: 20,
    textAlign: 'center' as const,
  },
  errorMessage: {
    fontSize: responsiveFontSize(1.8),
    color: '#666',
    textAlign: 'center' as const,
    marginTop: 10,
    lineHeight: 24,
  },
  downloadButtonLarge: {
    backgroundColor: '#93278f',
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 30,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold' as const,
    marginLeft: 8,
  },
};

export default ExcelViewer;