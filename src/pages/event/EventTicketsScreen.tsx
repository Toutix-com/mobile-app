import React, { useEffect } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { X , Plus } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { 
  selectedEvent,
  ticketQuantities,
  addTicket,
  removeTicket,
  getSubtotal,
  getTransactionFee,
  getTotal,
  formatEventDate,
  formatEventTimeRange,
  clearSelectedEvent,
  clearTicketQuantities
} from './store/event.store';
import { useSignals } from '@preact/signals-react/runtime';
import { normalize } from '../../utils/responsive';
import { Button, AppText, Icon } from '../../components';

const EventTicketsScreen = () => {
  useSignals();
  const navigation = useNavigation();
  const event = selectedEvent.value;

  if (!event) {
    return null;
  }

  useEffect(() => {
    return () => {
      clearTicketQuantities();
    };
  }, []);

  const ticketCategories = event.ticketCategories || [];

  const subtotal = getSubtotal();
  const transactionFee = getTransactionFee();
  const total = getTotal();

  return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Icon 
            icon={<X />}
            size={28}
            color="#222"
            onPress={() => navigation.goBack()}
          />
          <AppText style={styles.headerTitle}>Available tickets</AppText>
        </View>

        {/* Event summary */}
        <View style={styles.eventCard}>
          <Image source={{ uri: event.image }} style={styles.eventImage} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <AppText style={styles.eventTitle} numberOfLines={1}>{event.name}</AppText>
            <AppText style={styles.eventDate}>
              {formatEventDate(event.startTimeStamp)}
            </AppText>
            <AppText style={styles.eventTime}>
              {formatEventTimeRange(event.startTimeStamp, event.endTimeStamp)}
            </AppText>
          </View>
        </View>

        {/* Ticket categories */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
          {ticketCategories.map(cat => {
            const qty = ticketQuantities.value[cat.id] || 0;
            return (
              <View key={cat.id} style={styles.ticketRow}>
                <View style={{ flex: 1 }}>
                  <AppText style={styles.ticketTitle}>{cat.title}</AppText>
                  <AppText style={styles.ticketPrice}>${cat.price}</AppText>
                  <AppText style={styles.ticketDesc}>{cat.description}</AppText>
                </View>
                <View style={styles.qtyBox}>
                  {qty > 0 ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center' ,backgroundColor:'#EDEFF4' , borderRadius: 8  }}>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => removeTicket(cat.id)}>
                        <AppText style={styles.qtyBtnText}>-</AppText>
                      </TouchableOpacity>
                      <AppText style={styles.qtyCount}>{qty}</AppText>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => addTicket(cat.id, cat.maxTicketCount)}>
                        <AppText style={styles.qtyBtnText}>+</AppText>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Icon 
                      icon={<Plus />}
                      size={24}
                      color="#fff"
                      backgroundColor="#0C0453"
                      style={styles.addBtn}
                      rounded
                      borderRadius={16}
                      padding={4}
                      onPress={() => addTicket(cat.id, cat.maxTicketCount)}
                    />
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.summaryRow}>
            <AppText style={styles.summaryLabel}>Sub total</AppText>
            <AppText style={styles.summaryValue}>${subtotal.toFixed(2)}</AppText>
          </View>
          <View style={styles.summaryRow}>
            <AppText style={styles.summaryLabel}>Transaction fee</AppText>
            <AppText style={styles.summaryValue}>${transactionFee.toFixed(2)}</AppText>
          </View>
          <View style={styles.summaryRow}>
            <AppText style={styles.summaryLabelBold}>Total</AppText>
            <AppText style={styles.summaryValueBold}>${total.toFixed(2)}</AppText>
          </View>
          <View style={{ flexDirection: 'row', gap: normalize(10) , marginBottom: normalize(80), flex: 1, marginTop: normalize(20) }}>
            <Button
              title="Continue to pay"
              variant={subtotal > 0 ? "primary" : "secondary"}
              disabled={subtotal === 0}
              onPress={() => {
                if (subtotal > 0) {
                  navigation.navigate('TicketCheckout' as never);
                }
              }}
              style={styles.checkoutBtn}
              fullWidth
            />
          </View>
          
        </View>
      </View>
    
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 0,
    overflow: 'hidden',
    flex: 1,
  },
  headerRow: {
    justifyContent: 'space-between',
    padding: 18,
    marginTop: normalize(40),
    alignItems: 'flex-start',
  },
  headerTitle: {
    marginTop: normalize(20),
    fontWeight: 'bold',
    fontSize: 20,
    color: '#222',
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCE0E7',
    margin: 18,
    marginBottom: 8,
    padding: 10,
  },
  eventImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  eventTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    marginBottom: 2,
  },
  eventDate: {
    color: '#444',
    fontSize: 13,
  },
  eventTime: {
    color: '#444',
    fontSize: 13,
  },
  ticketRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  ticketTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#18104B',
    marginBottom: 2,
  },
  ticketPrice: {
    color: '#18104B',
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 2,
  },
  ticketDesc: {
    color: '#666',
    fontSize: 13,
    marginBottom: 2,
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
  },
  qtyCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginHorizontal: 10,
  },
  addBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#F0F0F0',
    padding: 18,
    backgroundColor: '#fff',
    marginBottom: normalize(40),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    color: '#666',
    fontSize: 15,
  },
  summaryValue: {
    color: '#222',
    fontSize: 15,
  },
  summaryLabelBold: {
    color: '#18104B',
    fontWeight: 'bold',
    fontSize: 16,
  },
  summaryValueBold: {
    color: '#18104B',
    fontWeight: 'bold',
    fontSize: 16,
  },
  checkoutBtn: {
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 8,
    flex: 1,
    height: normalize(40),
  },
  checkoutBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  couponBtn: {
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0C0453',
    flex: 1,
    paddingVertical: 8,
    height: normalize(40),
  },
  couponBtnText: {
    color: '#0C0453',
    fontWeight: 'bold',
    fontSize: 17,
  },
});

export default EventTicketsScreen; 