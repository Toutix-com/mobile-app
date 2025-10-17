import React, { useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Modal, StatusBar, Platform, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSignals } from '@preact/signals-react/runtime';
import { normalize } from '../../utils/responsive';
import { tickets, qrExpanded, openQrFullscreen, closeQrFullscreen, generateQrForTicket, qrCodeValue, qrSecondsRemaining, qrExpired, reloadQrNow } from './store/tickets.store';
import { fetchUserProfile, userStore } from '../login/store/login.store';
import { X, Maximize2, MapPin, CalendarDays, Clock, User as UserIcon, AlignLeft, Hash, User } from 'lucide-react-native';
import { handleLoginPress } from '@pages/profile/store/profile.store';
import { fetchEventById } from '@pages/event/store/event.store';
import { Button, AppText, Icon } from '../../components';

const TicketDetailsScreen: React.FC = () => {
  useSignals();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const isLoggedIn = userStore.value.email || userStore.value.mobileNumber;
  const item = tickets.value.find(t => t.id === route.params?.id) || tickets.value[0];
  const currentUser = userStore.value;
  const isAuthenticated = userStore.value.isAuthenticated;

  useEffect(() => {
    if (qrExpanded.value) {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('#ffffff');
      }
    }
  }, [qrExpanded.value]);

  useEffect(() => {
    
    // If user is authenticated, fetch their profile data
    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (item?.id) {
      generateQrForTicket(item.id);
    }
  }, [item?.id]);

  const qrData = qrCodeValue.value ? `ticket:${qrCodeValue.value}` : `ticket:${item.id}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=900x900&data=${encodeURIComponent(qrData)}`;
  console.log("isLoggedIn", isLoggedIn);


  return (
    <ScrollView style={styles.container}>
      <Icon 
        icon={<X />}
        size={normalize(22)}
        color="black"
        onPress={() => navigation.goBack()}
        style={styles.screenCloseBtn}
      />
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.titleRow}>
            <Image source={{ uri: item.event?.image }} style={styles.thumb} />
            <View style={{ flex: 1 }}>
              <AppText style={styles.title} numberOfLines={2}>{item.title}</AppText>
              <TouchableOpacity onPress={() => 
                fetchEventById(item.event?.id || '').then(() => {
                  navigation.navigate('EventDetails', { id: item.event?.id });
                })}>
                <AppText style={styles.link}>View event</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.qrWrap}>
          <View style={styles.qrBox}>
            <Image source={{ uri: qrUrl }} style={styles.qr} resizeMode="contain" />
            {qrExpired.value && (
              <View style={styles.expiredBadge}>
                <AppText style={styles.expiredText}>QR code Expired</AppText>
              </View>
            )}
            <TouchableOpacity style={styles.expandBtn} onPress={openQrFullscreen}>
              <Maximize2 color="#5A677D" size={normalize(18)} />
            </TouchableOpacity>
          </View>
          {!qrExpired.value ? (
            <>
              <AppText style={styles.qrNote}>QR code for this ticket will regenerated in:</AppText>
              <AppText style={styles.qrTimer}>{`${Math.floor(qrSecondsRemaining.value/60).toString().padStart(2,'0')}:${(qrSecondsRemaining.value%60).toString().padStart(2,'0')}`}</AppText>
            </>
          ) : (
            <View style={styles.reloadRow}>
              <AppText style={styles.reloadHint}>New QR code available</AppText>
              <Button
                title="Reload now"
                variant="primary"
                onPress={reloadQrNow}
                style={styles.reloadButton}
              />
            </View>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.rowIconText}>
          <View style={styles.iconBg}>
            <MapPin color="white" size={normalize(18)} />
          </View>
          <AppText style={styles.sectionTitle}>Venue</AppText>
        </View>
        <AppText style={styles.sectionValue}>{item.event?.location?.name || '-'}</AppText>
      </View>

      <View style={styles.rowTwoCols}>
        <View style={[styles.section, { flex: 1.5, marginRight: normalize(12) }]}>
          <View style={styles.rowIconText}><View style={styles.iconBg}><CalendarDays color="white" size={normalize(18)} /></View><AppText style={styles.sectionTitle}>Date</AppText></View>
          <AppText style={styles.sectionValue}>{item.dateLabel}</AppText>
        </View>
        <View style={[styles.section, { flex: 1, marginLeft: normalize(12) }]}>
          <View style={styles.rowIconText}><View style={styles.iconBg}><Clock color="white" size={normalize(18)} /></View><AppText style={styles.sectionTitle}>Time</AppText></View>
          <AppText style={styles.sectionValue}>{item.timeLabel}</AppText>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.rowIconText}><View style={styles.iconBg}><UserIcon color="white" size={normalize(18)} /></View><AppText style={styles.sectionTitle}>Ticket purchaser</AppText></View>
        <AppText style={styles.sectionValue}>{currentUser.firstName} {currentUser.lastName}</AppText>
      </View>

      <View style={styles.section}>
        <View style={styles.rowIconText}><View style={styles.iconBg}><AlignLeft color="white" size={normalize(18)} /></View><AppText style={styles.sectionTitle}>Ticket type</AppText></View>
        <AppText style={styles.sectionValue}>{item.ticketCategory?.title}</AppText>
      </View>

      <View style={styles.section}>
        <View style={styles.rowIconText}><View style={styles.iconBg}><AlignLeft color="white" size={normalize(18)} /></View><AppText style={styles.sectionTitle}>Description</AppText></View>
        <AppText style={styles.sectionValue}>Ticket grants access to Zone area</AppText>
      </View>

      <View style={styles.section}>
        <View style={styles.rowIconText}><View style={styles.iconBg}><Hash color="white" size={normalize(18)} /></View><AppText style={styles.sectionTitle}>Seats</AppText></View>
        <View style={styles.seatsWrap}>
        <View style={styles.seatBadge}><AppText style={styles.seatText}>{item.seatId}</AppText></View>
        </View>
      </View>

      <View style={styles.footer}/>

      <Modal visible={qrExpanded.value} animationType="fade" onRequestClose={closeQrFullscreen}>
        <TouchableOpacity style={styles.fullscreen} activeOpacity={1} onPress={closeQrFullscreen}>
          <StatusBar hidden translucent backgroundColor="#ffffff" barStyle="dark-content" />
          <AppText style={styles.fullscreenHint}>Tap anywhere to exit from full screen mode</AppText>
          <Image source={{ uri: qrUrl }} style={styles.qrLarge} resizeMode="contain" />
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: normalize(16),
  },
  card: {
    borderWidth: 1,
    borderColor: '#E7E7EA',
    borderRadius: normalize(12),
    padding: normalize(12),
    backgroundColor: '#fff',
    marginTop: normalize(20),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  screenCloseBtn: {
    marginTop: normalize(40),
    zIndex: 2,
    borderRadius: normalize(16),
  },
  thumb: {
    width: normalize(72),
    height: normalize(72),
    borderRadius: normalize(8),
    marginRight: normalize(12),
  },
  title: {
    color: '#0C0453',
    fontWeight: '800',
    fontSize: normalize(16),
  },
  link: {
    marginTop: normalize(4),
    color: '#1D2470',
    fontWeight: '400',
    fontSize: normalize(17),
    textDecorationLine: 'underline',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E7E7EA',
    marginTop: normalize(12),
    marginBottom: normalize(12),
  },
  qrWrap: {
    alignItems: 'center',
  },
  qrBox: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: normalize(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  qr: {
    width: '70%',
    aspectRatio: 1,
  },
  expiredBadge: {
    position: 'absolute',
    paddingHorizontal: normalize(14),
    paddingVertical: normalize(8),
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: normalize(20),
  },
  expiredText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: normalize(14),
  },
  expandBtn: {
    position: 'absolute',
    right: normalize(10),
    top: normalize(10),
    backgroundColor: '#F3F4F6',
    width: normalize(32),
    height: normalize(32),
    borderRadius: normalize(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrNote: {
    marginTop: normalize(12),
    color: '#5A677D',
    fontSize: normalize(13),
  },
  qrTimer: {
    marginTop: normalize(4),
    color: '#0C0453',
    fontWeight: '800',
    fontSize: normalize(14),
  },
  reloadRow: {
    marginTop: normalize(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  reloadHint: {
    color: '#0D1117',
    fontSize: normalize(16),
    fontWeight: '700',
  },
  reloadButton: {
    borderWidth: 1,
    borderColor: '#1D2470',
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(8),
    borderRadius: normalize(24),
  },
  reloadButtonText: {
    color: '#1D2470',
    fontWeight: '700',
    fontSize: normalize(16),
  },
  section: {
    marginTop: normalize(16),
  },
  rowIconText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(6),
    gap: normalize(8) as unknown as number,
  },
  sectionTitle: {
    color: '#5C636E',
    fontWeight: '400',
    fontSize: normalize(17),
    marginLeft: normalize(6),
  },
  sectionValue: {
    color: '#0D1117',
    fontSize: normalize(17),
    fontWeight: '600',
  },
  rowTwoCols: {
    flexDirection: 'row',
  },
  seatsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: normalize(6),
  },
  seatBadge: {
    backgroundColor: '#D3D9E1',
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(6),
    borderRadius: normalize(8),
    marginRight: normalize(8),
    marginBottom: normalize(8),
  },
  seatText: {
    color: '#0C0453',
    fontWeight: '700',
    fontSize: normalize(12),
  },
  fullscreen: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(16),
  },
  fullscreenHint: {
    color: '#5A677D',
    marginBottom: normalize(16),
    fontSize: normalize(14),
  },
  qrLarge: {
    width: '90%',
    aspectRatio: 1,
  },
  footer: {
    height: normalize(100),
  },
  iconBg: {
    backgroundColor: "#1D2470",
    padding: normalize(4),
    borderRadius: normalize(8),
  },
  
});

export default TicketDetailsScreen;


