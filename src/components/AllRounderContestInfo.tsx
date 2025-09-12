import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AllRounderContestInfo = ({navigation}: any) => {
  const [isAccepted, setIsAccepted] = useState(false);

  const talentCategories = [
    {name: 'Artist', icon: '🎨'},
    {name: 'Anchoring', icon: '🎤'},
    {name: 'Dancing', icon: '💃'},
    {name: 'Family Talk', icon: '👨‍👩‍👧‍👦'},
    {name: 'Musical Instrument', icon: '🎶'},
    {name: 'Ramp Walk', icon: '👠'},
    {name: 'Singing', icon: '🎵'},
    {name: 'Storytelling', icon: '📖'},
    {name: 'Shloka Recitation', icon: '🕉️'},
    {name: 'Self-Introduction', icon: '🎙️'},
  ];

  const nationalAwards = [
    'Best Child Artist Award',
    'Best Child Anchor Award',
    'Best Child Dancer Award',
    'Best Child Family Conversation Award',
    'Best Child Musician Award',
    'Best Child Ramp Walker Award',
    'Best Child Singer Award',
    'Best Child Storyteller Award',
    'Best Shloka Reciter Award',
    'Best Child Self Introduction Award',
  ];

  const benefits = [
    {
      title: 'Platform to Showcase Talent',
      description:
        'Children get an opportunity to perform in front of audiences, cameras, and judges — helping them build stage confidence and learn real-world skills.',
      icon: 'star',
      iconType: 'MaterialIcons',
    },
    {
      title: 'Personality & Skill Development',
      description:
        'Activities like anchoring, storytelling, and shloka recitation help enhance communication skills, memory power, cultural values, and self-expression.',
      icon: 'trending-up',
      iconType: 'MaterialIcons',
    },
    {
      title: 'Awards, Recognition & Certificates',
      description:
        'Awardees receive E- Best Performer Award Certificates, download from KCA APP that boost their confidence and add value to their profiles.',
      icon: 'trophy',
      iconType: 'FontAwesome',
    },
    {
      title: 'Media Exposure',
      description:
        'Children may get featured on social media, YouTube, whatsapp channel, KCA APP, Instagram and websites — increasing their visibility and giving them a platform to inspire others.',
      icon: 'camera',
      iconType: 'Ionicons',
    },
    {
      title: 'Confidence Building',
      description:
        'Facing an audience or camera while introducing themselves or performing gives children self-assurance and reduces stage fear.',
      icon: 'psychology',
      iconType: 'MaterialIcons',
    },
    {
      title: 'Family Bonding',
      description:
        'Activities like natural conversation with family members promote bonding and emotional intelligence through meaningful exchanges.',
      icon: 'family-restroom',
      iconType: 'MaterialIcons',
    },
    {
      title: 'Creative Exploration',
      description:
        'Ramp walks, drawing/art, music, and dance competitions encourage kids to explore different art forms and discover their passions.',
      icon: 'color-palette',
      iconType: 'Ionicons',
    },
    {
      title: 'Early Career Foundation',
      description:
        'Children with talent in public speaking, singing, dancing, anchoring, or storytelling get early exposure that could lead to future opportunities in media, arts, or leadership.',
      icon: 'work',
      iconType: 'MaterialIcons',
    },
    {
      title: 'Cultural & Moral Growth',
      description:
        'Competitions like shloka recitation help children stay connected to their roots, culture, and values.',
      icon: 'leaf',
      iconType: 'Ionicons',
    },
    {
      title: 'All-Round Personality Grooming',
      description:
        'From self-introduction to ramp walking, every activity is designed to help a child become a confident, expressive, and balanced individual.',
      icon: 'person',
      iconType: 'Ionicons',
    },
  ];

  const handleProceed = () => {
    if (!isAccepted) {
      Alert.alert(
        'Agreement Required',
        'Please accept the terms and conditions to proceed.',
      );
      return;
    }
    navigation.navigate('AllRounderForm');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome to the</Text>
          <Text style={styles.titleText}>
            National All-Rounder Talent Hub Contest
          </Text>
          <Text style={styles.subtitleText}>
            India's BIGGEST Online Talent Stage for Kids!
          </Text>
          <View style={styles.ageContainer}>
            <Text style={styles.ageText}>Ages: 3 to 15 years</Text>
            <Text style={styles.featuresText}>
              Monthly Contests | National Recognition
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.descriptionText}>
            Join the National All-Rounder Talent Hub Contest! Let your child
            shine on the national stage!
          </Text>
        </View>

        {/* Talent Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Icon name="category" size={20} color="#1F2937" /> TALENT
            CATEGORIES:
          </Text>
          <View style={styles.categoriesGrid}>
            {talentCategories.map((category, index) => {
              return (
                <View key={index} style={styles.categoryItem}>
                  <View style={styles.categoryContent}>
                    <Text style={{ fontSize: 16, marginRight: 8 }}>
                      {category.icon}
                    </Text>
                    <Text style={styles.categoryText}>{category.name}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* How to Participate */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Icon name="how-to-reg" size={20} color="#1F2937" /> How to
            Participate:
          </Text>
          <View style={styles.stepContainer}>
            <View style={styles.stepRow}>
              <Icon name="app-registration" size={18} color="#10B981" />
              <Text style={styles.stepText}>
                Step 1: Register via the KCA App
              </Text>
            </View>
            <View style={styles.stepRow}>
              <Icon name="videocam" size={18} color="#EF4444" />
              <Text style={styles.stepText}>
                Step 2: Record & send a 2-minute video showcasing your talent.
                Videos over 2 minutes won't be featured.
              </Text>
            </View>
            <View style={styles.stepRow}>
              <Icon name="payment" size={18} color="#F59E0B" />
              <Text style={styles.stepText}>
                Step 3: Pay just ₹60 per entry/month (One Child can participate
                in multiple talents every month)
              </Text>
            </View>
            <View style={styles.stepRow}>
              <Icon name="announcement" size={18} color="#6366F1" />
              <Text style={styles.stepText}>
                Step 4: Announcement of results on KCA APP, 30th of every month
              </Text>
            </View>
          </View>
        </View>

        {/* Featured Platforms */}
        <View style={styles.section}>
          <Text style={styles.subSectionTitle}>
            <Icon name="share" size={16} color="#374151" /> Participant's Video
            will be posted(with Parental Consent) & Get Featured On :
          </Text>
          <View style={styles.platformList}>
            <View style={styles.platformRow}>
              <FontAwesome name="instagram" size={16} color="#E91E63" />
              <Text style={styles.platformText}>KCA Instagram</Text>
            </View>
            <View style={styles.platformRow}>
              <FontAwesome name="youtube-play" size={16} color="#EF4444" />
              <Text style={styles.platformText}>KCA YouTube Channel</Text>
            </View>
            <View style={styles.platformRow}>
              <FontAwesome name="facebook" size={16} color="#3300ff" />
              <Text style={styles.platformText}>KCA Facebook</Text>
            </View>
            <View style={styles.platformRow}>
              <FontAwesome name="whatsapp" size={16} color="#00f731" />
              <Text style={styles.platformText}>KCA WhatsApp Channel</Text>
            </View>
            <View style={styles.platformRow}>
              <FontAwesome name="linkedin" size={16} color="#0062ff" />
              <Text style={styles.platformText}>KCA Linkedin</Text>
            </View>
            <View style={styles.platformRow}>
              <FontAwesome name="android" size={16} color="#0062ff" />
              <Text style={styles.platformText}>KCA APP</Text>
            </View>
          </View>

          <View style={styles.stepRow}>
            <Icon name="gavel" size={18} color="#DC2626" />
            <Text style={styles.stepText}>
              <Text style={styles.subSectionTitle}>Important note:</Text> A
              panel of judges will select from their category and feature
              performances, and their decisions will be final and binding to all
              participants.
            </Text>
          </View>
        </View>

        {/* National Awards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Icon name="emoji-events" size={20} color="#1F2937" /> NATIONAL
            AWARDS
          </Text>
          <Text style={styles.subSectionTitle}>
            <Icon name="event" size={16} color="#374151" /> Monthly Awards in
            All Categories
          </Text>
          {/* <Text style={styles.subSectionTitle}>E-Participation Certificates for ALL Participants</Text> */}
          <Text style={styles.subSectionTitle}>
            <Icon name="workspace-premium" size={16} color="#374151" />{' '}
            E-Certificate of National Best Performance Award for:
          </Text>

          <View style={styles.awardsList}>
            {nationalAwards.map((award, index) => (
              <Text key={index} style={styles.awardText}>
                • {award}
              </Text>
            ))}
          </View>

          <Text style={styles.certificateText}>
            "After Completing the Registration Form" 1. Upload your video 2.
            Download Best Performance Award E-Certificate. (We'll provide the
            PDF format; kids can frame their achievements!)
          </Text>
        </View>

        {/* Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Icon name="thumb-up" size={20} color="#1F2937" /> Benefits of
            Joining the National All-Rounder Talent Hub Contest
          </Text>
          {benefits.map((benefit, index) => {
            const IconComponent =
              benefit.iconType === 'MaterialIcons'
                ? Icon
                : benefit.iconType === 'FontAwesome'
                ? FontAwesome
                : Ionicons;
            return (
              <View key={index} style={styles.benefitItem}>
                <View style={styles.benefitHeader}>
                  <IconComponent
                    name={benefit.icon}
                    size={20}
                    color="#4F46E5"
                  />
                  <Text style={styles.benefitTitle}>
                    {index + 1}. {benefit.title}
                  </Text>
                </View>
                <Text style={styles.benefitDescription}>
                  {benefit.description}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Agreement Section */}
        <View style={styles.agreementSection}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setIsAccepted(!isAccepted)}>
            <View
              style={[styles.checkbox, isAccepted && styles.checkboxChecked]}>
              {isAccepted && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.agreementText}>
              I accept and agree to follow procedure.
            </Text>
          </TouchableOpacity>
        </View>

        {/* Next Button */}
        {isAccepted && (
          <TouchableOpacity style={styles.nextButton} onPress={handleProceed}>
            <View style={styles.nextButtonContainer}>
              <Text style={styles.nextButtonText}>Next</Text>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    backgroundColor: '#4F46E5',
  },
  welcomeText: {
    fontSize: 18,
    color: '#E0E7FF',
    textAlign: 'center',
    marginBottom: 5,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitleText: {
    fontSize: 16,
    color: '#E0E7FF',
    textAlign: 'center',
    marginBottom: 15,
  },
  ageContainer: {
    alignItems: 'center',
  },
  ageText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 5,
  },
  featuresText: {
    fontSize: 14,
    color: '#E0E7FF',
  },
  section: {
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    textAlign: 'center',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '48%',
    marginBottom: 8,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginLeft: 8,
  },
  stepContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    marginLeft: 10,
    flex: 1,
  },
  platformList: {
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  platformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  platformText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginLeft: 10,
  },
  awardsList: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
  },
  awardText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 4,
  },
  certificateText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    fontStyle: 'italic',
    marginTop: 10,
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
  },
  benefitItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  benefitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 10,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  agreementSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#4F46E5',
    borderRadius: 3,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  checkboxChecked: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  agreementText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  nextButton: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  nextButtonContainer: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#10B981',
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  bottomSpacing: {
    height: 30,
  },
});

export default AllRounderContestInfo;
