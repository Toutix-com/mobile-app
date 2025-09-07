import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView } from 'react-native';
import { useSignals } from '@preact/signals-react/runtime';
import { normalize } from '../../utils/responsive';
import { organizerProfile, organizerUpcoming, organizerPast, isOrganizerVerified, fetchOrganizerProfile } from './store/organizerProfile.store';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Globe, Mail, MapPin, Phone, TreePalm } from 'lucide-react-native';

const OrganizerProfileScreen: React.FC = () => {
  useSignals();
  const route = useRoute<any>();
  const navigation = useNavigation();
  useEffect(() => {
    const organizationId = route.params?.id;
    if (organizationId) {
      fetchOrganizerProfile(organizationId);
    }
  }, [route.params?.id]);

  const hasEvents = (organizerUpcoming.value.length + organizerPast.value.length) > 0;

  console.log("organizerProfile", organizerProfile.value);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
    <ScrollView style={styles.container}>
      <View style={styles.backBtn}>
        <ChevronLeft color="#0C0433" size={24} onPress={() => navigation.goBack()} />
      </View>
      <View style={styles.card}>
        <Image source={{ uri: organizerProfile.value.organizationDetails.organizationLogo }} style={styles.avatar} />
        <Text style={styles.name}>{organizerProfile.value.organizationDetails.organizationName}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: normalize(8), alignContent: 'center', justifyContent: 'center' }}>
        <Text style={styles.memberSince}>{organizerProfile.value.durationMessage}</Text>
        <Text style={styles.memberSinceTxt}>{'with Toutix'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <View style={styles.contactItemRow}>
            <View style={styles.iconBg}>
            <Phone color="#0C0433" size={18} />
            </View>
            <Text style={styles.contactItem}>{organizerProfile.value.organizationDetails.organizationPhone || '-'}</Text>
          </View>

          <View style={styles.contactItemRow}>
            <View style={styles.iconBg}>
            <Mail color="#0C0433" size={18} />
            </View>
            <Text style={styles.contactItem}>{organizerProfile.value.organizationDetails.organizationEmail || '-'}</Text>
          </View>
          <View style={styles.contactItemRow}>
            <View style={styles.iconBg}>
            <Globe color="#0C0433" size={18} />
            </View>
            <Text style={styles.contactItem}>{organizerProfile.value.organizationDetails.organizationWebsite || '-'}</Text>
          </View>
          <View style={styles.contactItemRow}>
            <View style={styles.iconBg}>
            <MapPin color="#0C0433" size={18} />
            </View>
            <Text style={styles.contactItem}>{organizerProfile.value.organizationDetails.country || '-'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionBlock}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.sectionHeader}>About {organizerProfile.value.organizationDetails.organizationName}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.aboutMetaCount}>{`${organizerProfile.value.count || 0}`}</Text>
          <Text style={styles.aboutMeta}>{` Events published`}</Text>
        </View>
        <Text style={styles.about}>{organizerProfile.value.organizationDetails.organizationDescription || '[No description provided]'}</Text>
      </View>

      <View style={styles.sectionBlock}>
        <Text style={styles.listHeader}>Up coming events</Text>
        {organizerUpcoming.value.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.iconBgEmpty}>
            <TreePalm color="#0C0433" size={24} />
            </View>
            <Text style={styles.empty}>No upcoming events</Text>
          </View>
        ) : (
          organizerUpcoming.value.map(ev => (
            <View key={ev.id} style={styles.eventRow}>
              <Image source={{ uri: ev.image }} style={styles.thumb} />
              <View style={{ flex: 1 }}>
                <Text style={styles.eventTitle} numberOfLines={1}>{ev.title}</Text>
                <Text style={styles.eventSubtitle}>{ev.date}</Text>
                <Text style={styles.eventSubtitle}>{ev.venue}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.sectionBlock}>
        <Text style={styles.listHeader}>Past events</Text>
        {organizerPast.value.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.iconBgEmpty}>
            <TreePalm color="#0C0433" size={24} />
            </View>
            <Text style={styles.empty}>No past events</Text>
          </View>
        ) : (
          organizerPast.value.map(ev => (
            <View key={ev.id} style={styles.eventRow}>
              <Image source={{ uri: ev.image }} style={styles.thumb} />
              <View style={{ flex: 1 }}>
                <Text style={styles.eventTitle} numberOfLines={1}>{ev.title}</Text>
                <Text style={styles.eventSubtitle}>{ev.date}</Text>
                <Text style={styles.eventSubtitle}>{ev.venue}</Text>
              </View>
            </View>
          ))
        )}
      </View>
      <View style={styles.emptyContainer} />
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: normalize(16), marginTop: normalize(50) },
  backBtn: {
    marginTop: normalize(16),
    marginBottom: normalize(20),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: normalize(12),
    borderWidth: 1,
    borderColor: '#E7E7EA',
    padding: normalize(16),
  },
  avatar: {
    width: normalize(72),
    height: normalize(72),
    borderRadius: normalize(50),
    alignSelf: 'center',
    marginBottom: normalize(12),
  },
  name: { textAlign: 'center', fontSize: normalize(16), fontWeight: '700', color: '#0D1117' },
  memberSince: { textAlign: 'center', marginTop: normalize(6), color: '#262A31' , fontSize: normalize(16) , fontWeight: '600'},
  memberSinceTxt: { textAlign: 'center', marginTop: normalize(6), color: '#5C636E' , fontSize: normalize(16) , fontWeight: '400'},
  section: { marginTop: normalize(16) },
  sectionTitle: { fontWeight: '700', color: '#0D1117', fontSize: normalize(18) },
  contactItem: { color: '#0D1117' , fontSize: normalize(16) , fontWeight: '600'},
  sectionBlock: { marginTop: normalize(18) },
  sectionHeader: { fontWeight: '600', color: '#0D1117' , fontSize: normalize(18)},
  aboutMeta: { color: '#5C636E', fontWeight: '400', marginTop: normalize(6) },
  aboutMetaCount: { color: '#5345E6', fontWeight: '600', marginTop: normalize(6) },
  about: { color: '#5C636E', marginTop: normalize(8), lineHeight: normalize(20) },
  listHeader: { fontWeight: '600', color: '#0D1117', marginBottom: normalize(10) , fontSize: normalize(18)},
  empty: { color: '#5C636E', alignSelf: 'center', marginVertical: normalize(12) },
  eventRow: { flexDirection: 'row', alignItems: 'center', marginBottom: normalize(14) },
  thumb: { width: normalize(72), height: normalize(72), borderRadius: normalize(8), marginRight: normalize(12) },
  eventTitle: { color: '#0D1117', fontWeight: '600' , fontSize: normalize(16)},
  eventSubtitle: { color: '#5C636E', fontSize: normalize(16), marginTop: normalize(2), fontWeight: '400'},
  verifiedDot: { width: normalize(8), height: normalize(8), backgroundColor: '#1D2470', borderRadius: normalize(4) },
  iconBg: {
    backgroundColor: "#EBF1FF",
    padding: normalize(4),
    borderRadius: normalize(8),
  },
  contactItemRow: { flexDirection: 'row', alignItems: 'center' , gap: normalize(8) ,marginTop: normalize(8) },
  iconBgEmpty: {
    backgroundColor: "#EBF1FF",
    padding: normalize(15),
    borderRadius: normalize(50),
  },
  emptyContainer: { height: normalize(120) },
});

export default OrganizerProfileScreen;


