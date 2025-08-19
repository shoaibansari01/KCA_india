import React from 'react';
import {View, Text, Image, Dimensions, PixelRatio} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

interface CertificateTemplateProps {
  studentName: string;
  className: string;
  schoolName: string;
}

const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
  studentName,
  className,
  schoolName,
}) => {
  const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
  const certificateWidth = screenWidth - responsiveWidth(5);
  const certificateHeight = (certificateWidth * 2) / 3;
  
  // Get device scale factor for better responsive calculations
  const pixelRatio = PixelRatio.get();
  const isSmallDevice = screenWidth < 360;
  const isMediumDevice = screenWidth >= 360 && screenWidth < 400;
  const isLargeDevice = screenWidth >= 400;

  // Generate responsive styles based on current screen dimensions
  const styles = createStyles(screenWidth, certificateHeight);

  return (
    <View style={[styles.certificateContainer, {width: certificateWidth, height: certificateHeight}]}>
      
      {/* Background Image */}
      <Image 
        source={require('../assets/images/CertificateBG.jpeg')} 
        style={[styles.backgroundImage, {width: certificateWidth, height: certificateHeight}]}
        resizeMode="cover"
      />

      {/* Main Content Area */}
      <View style={styles.mainContentArea}>
        {/* Header Text */}
        <View style={styles.headerSection}>
          <View style={styles.spacer} />
          <View style={styles.numberContainer}>
            <Text style={styles.competitionNumber}>15</Text>
            <Text style={styles.superscriptTh}>TH</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.titleLine1}>National Talent Search Drawing & painting</Text>
            <Text style={styles.titleLine2}>Scholarship Competition <Text style={styles.yearText}>2025</Text></Text>
          </View>
        </View>

        {/* Certificate Title */}
        <View style={styles.certificateTitleSection}>
          <Text style={styles.consolationText}>Consolation </Text>
          <Text style={styles.certificateText}>Certificate</Text>
        </View>

        {/* Certify and Name Section */}
        <View style={styles.certifyWithNameSection}>
          <Text style={styles.certifyText}>This is to certify that </Text>
          <View style={styles.nameWithDot}>
            <Text style={styles.studentNameText}>{studentName}</Text>
            <View style={styles.dotLine} />
          </View>
        </View>

        {/* Class and School Info */}
        <View style={styles.classSchoolSection}>
          <Text style={styles.infoText}>Class</Text>
          <View style={styles.infoUnderline}>
            <Text style={styles.infoValue}>{className}</Text>
          </View>
          <Text style={styles.infoText}>student of</Text>
          <View style={styles.schoolUnderline}>
            <Text style={styles.infoValue}>{schoolName}</Text>
          </View>
        </View>

        {/* Achievement Text */}
        <View style={styles.achievementSection}>
          <Text style={styles.achievementText}>
            has been adjudged <Text style={styles.consolationBold}>CONSOLATION</Text> in National Talent Search Drawing & Painting Scholarship Competition
          </Text>
        </View>
        
        {/* Event Text */}
        <View style={styles.eventSection}>
          <Text style={styles.eventText}>
            MAGIC COLORS held on 13th September 2025 Organised by Kids' Cerebral Academy (KCA) Nagpur
          </Text>
        </View>
        
        {/* Wishes Text */}
        <View style={styles.wishesSection}>
          <Text style={styles.wishesText}>with best wishes</Text>
        </View>

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureColumn}>
            <Text style={styles.signatureName}>Ln. Dr. Gurupreet Kaur Saluja</Text>
            <Text style={styles.signatureTitle}>MD, KCA</Text>
            <Text style={styles.signatureSubtitle}>Child Psychologist</Text>
          </View>
          
          <View style={styles.signatureColumn}>
            <Text style={styles.signatureName}>Honorable</Text>
            <Text style={styles.signatureTitle}>Devendra Fadnavis</Text>
            <Text style={styles.signatureSubtitle}>Chief Minister Of Maharashtra</Text>
          </View>
          
          <View style={styles.signatureColumn}>
            <Text style={styles.signatureName}>Dr. Uday Bodhankar</Text>
            <Text style={styles.signatureTitle}>International President</Text>
            <Text style={styles.signatureSubtitle}>Guest of Honour</Text>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.contactSection}>
          <Text style={styles.contactText}>Kids' Cerebral Academy</Text>
          <Text style={styles.contactText}>(KCA) E mail :-</Text>
          <Text style={styles.contactText}>kcaindia.com@gmail.com</Text>
          <Text style={styles.contactText}>kcaindia.com</Text>
        </View>
      </View>
    </View>
  );
};

// Create responsive styles function
const createStyles = (screenWidth: number, certificateHeight: number) => {
  // More precise responsive calculations
  const widthRatio = screenWidth / 375; // Base width
  const heightRatio = certificateHeight / 250; // Base certificate height
  
  // Better font scaling that maintains readability
  const getResponsiveFontSize = (baseSize: number) => {
    const baseFontSize = responsiveFontSize(baseSize);
    // Use geometric mean of width and height ratios for better scaling
    const scaleFactor = Math.sqrt(widthRatio * heightRatio);
    return Math.max(baseFontSize * scaleFactor, 6);
  };
  
  // Responsive spacing based on certificate dimensions
  const getResponsiveSpacing = (baseSize: number) => {
    return responsiveWidth(baseSize) * widthRatio;
  };
  
  // Certificate height-based vertical spacing
  const getVerticalSpacing = (percentage: number) => {
    return certificateHeight * percentage;
  };

  return {
    certificateContainer: {
      alignSelf: 'center' as const,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      position: 'relative' as const,
    },
    
    // Background Image
    backgroundImage: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    
    // Main Content Area - exact positioning as original
    mainContentArea: {
      flex: 1,
      paddingHorizontal: responsiveWidth(4),
      paddingVertical: responsiveHeight(2),
      position: 'relative' as const,
      zIndex: 1,
    },
    
    // Header Section - restore original positioning
    headerSection: {
      flexDirection: 'row' as const,
      alignItems: 'flex-start' as const,
      justifyContent: 'flex-start' as const,
      marginTop: responsiveHeight(1),
      marginBottom: responsiveHeight(2),
      paddingHorizontal: responsiveWidth(2),
    },
    spacer: {
      flex: 0.3,
    },
    numberContainer: {
      flexDirection: 'row' as const,
      alignItems: 'flex-start' as const,
      marginRight: responsiveWidth(0.5),
    },
    competitionNumber: {
      fontSize: responsiveFontSize(3),
      fontWeight: 'bold' as const,
      color: '#FF0000',
    },
    superscriptTh: {
      fontSize: responsiveFontSize(1.2),
      fontWeight: 'bold' as const,
      color: '#FF0000',
      textAlignVertical: 'top' as const,
      position: 'relative' as const,
      top: -responsiveHeight(0.3),
    },
    titleContainer: {
      flex: 1,
      paddingHorizontal: responsiveWidth(1),
    },
    titleLine1: {
      fontSize: responsiveFontSize(1.2),
      fontWeight: 'bold' as const,
      color: '#000',
      textAlign: 'left' as const,
    },
    titleLine2: {
      fontSize: responsiveFontSize(1.2),
      fontWeight: 'bold' as const,
      color: '#000',
      textAlign: 'left' as const,
    },
    yearText: {
      color: '#FF0000',
      fontWeight: 'bold' as const,
    },
    
    // Certificate Title - restore original
    certificateTitleSection: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginVertical: responsiveHeight(0.2),
    },
    consolationText: {
      fontSize: responsiveFontSize(1.5),
      fontWeight: 'bold' as const,
      color: '#00BFFF',
      textAlign: 'center' as const,
    },
    certificateText: {
      fontSize: responsiveFontSize(1.5),
      fontStyle: 'italic' as const,
      color: '#000',
      textAlign: 'center' as const,
    },
    
    // Certify with Name Section - restore original
    certifyWithNameSection: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      flexWrap: 'wrap' as const,
      marginTop: responsiveHeight(1),
      marginBottom: 0,
      paddingHorizontal: responsiveWidth(4),
    },
    certifyText: {
      fontSize: responsiveFontSize(0.9),
      color: '#000',
      marginBottom: responsiveHeight(0),
    },
    nameWithDot: {
      alignItems: 'center' as const,
      flex: 1,
    },
    studentNameText: {
      fontSize: responsiveFontSize(0.9),
      fontWeight: 'bold' as const,
      color: '#000',
      textAlign: 'center' as const,
      marginBottom: 1.5,
    },
    dotLine: {
      width: '100%' as const,
      height: 0,
      borderBottomWidth: 1,
      borderBottomColor: '#000',
      borderStyle: 'dotted' as const,
      marginTop: -2,
    },
    
    // Class and School Section - restore original
    classSchoolSection: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      justifyContent: 'flex-start' as const,
      alignItems: 'center' as const,
      marginBottom: responsiveHeight(0.5),
      paddingHorizontal: responsiveWidth(4),
    },
    infoText: {
      fontSize: responsiveFontSize(0.9),
      color: '#000',
      marginHorizontal: 0,
    },
    infoUnderline: {
      borderBottomWidth: 1,
      borderBottomColor: '#000',
      borderStyle: 'dotted' as const,
      paddingHorizontal: 10,
      marginHorizontal: 0,
      minWidth: 40,
    },
    schoolUnderline: {
      borderBottomWidth: 1,
      borderBottomColor: '#000',
      borderStyle: 'dotted' as const,
      paddingHorizontal: 10,
      marginHorizontal: 0,
      flex: 1,
    },
    infoValue: {
      fontSize: responsiveFontSize(0.9),
      color: '#000',
      textAlign: 'center' as const,
    },
    
    // Achievement Section - restore original
    achievementSection: {
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingHorizontal: responsiveWidth(4),
      marginBottom: responsiveHeight(0),
    },
    achievementText: {
      fontSize: responsiveFontSize(0.72),
      color: '#000',
      textAlign: 'center' as const,
      lineHeight: responsiveFontSize(0.9),
      width: '100%' as const,
    },
    consolationBold: {
      fontWeight: 'bold' as const,
    },
    
    // Event Section - restore original
    eventSection: {
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingHorizontal: responsiveWidth(4),
      marginBottom: responsiveHeight(0),
    },
    eventText: {
      fontSize: responsiveFontSize(0.72),
      color: '#000',
      textAlign: 'center' as const,
      lineHeight: responsiveFontSize(0.9),
      width: '100%' as const,
    },
    
    // Wishes Section - restore original
    wishesSection: {
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingHorizontal: responsiveWidth(4),
      marginBottom: responsiveHeight(0),
    },
    wishesText: {
      fontSize: responsiveFontSize(0.72),
      color: '#000',
      textAlign: 'center' as const,
      lineHeight: responsiveFontSize(0.9),
      width: '100%' as const,
    },
    
    // Signature Section - restore original positioning
    signatureSection: {
      flexDirection: 'row' as const,
      justifyContent: 'flex-start' as const,
      position: 'absolute' as const,
      bottom: responsiveHeight(4),
      left: responsiveWidth(8),
      paddingHorizontal: responsiveWidth(2),
    },
    signatureColumn: {
      alignItems: 'center' as const,
      marginRight: responsiveWidth(3),
    },
    signatureName: {
      fontSize: responsiveFontSize(0.6),
      fontWeight: 'bold' as const,
      color: '#000',
      textAlign: 'center' as const,
      marginBottom: 1,
    },
    signatureTitle: {
      fontSize: responsiveFontSize(0.5),
      color: '#000',
      textAlign: 'center' as const,
      marginBottom: 1,
    },
    signatureSubtitle: {
      fontSize: responsiveFontSize(0.4),
      color: '#000',
      textAlign: 'center' as const,
    },
    
    // Contact Section - restore original positioning
    contactSection: {
      position: 'absolute' as const,
      bottom: responsiveHeight(4),
      right: responsiveWidth(8),
      alignItems: 'flex-start' as const,
    },
    contactText: {
      fontSize: responsiveFontSize(0.6),
      color: '#000',
      textAlign: 'right' as const,
    },
  };
};

export default CertificateTemplate;