import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { X , Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { selectedEvent } from './store/event.store';
import { useSignals } from '@preact/signals-react/runtime';
import { normalize } from '../../utils/responsive';

const TRANSACTION_FEE_PERCENT = 0.1;

const EventTicketsScreen = () => {
  useSignals();
  const navigation = useNavigation();
  const event = selectedEvent.value;
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({});

  if (!event) {
    return null;
  }

  const ticketCategories = event.ticketCategories || [];

  // Calculate subtotal
  const subtotal = ticketCategories.reduce((sum, cat) => {
    const qty = quantities[cat.id] || 0;
    return sum + qty * cat.price;
  }, 0);

  const transactionFee = subtotal * TRANSACTION_FEE_PERCENT;
  const total = subtotal + transactionFee;

  const handleAdd = (id: string, max: number) => {
    setQuantities(q => {
      const current = q[id] || 0;
      if (current < max) {
        return { ...q, [id]: current + 1 };
      }
      return q;
    });
  };

  const handleRemove = (id: string) => {
    setQuantities(q => {
      const current = q[id] || 0;
      if (current > 0) {
        return { ...q, [id]: current - 1 };
      }
      return q;
    });
  };

  return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <X color="#222" size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Available tickets</Text>
        </View>

        {/* Event summary */}
        <View style={styles.eventCard}>
          <Image source={{ uri: event.image }} style={styles.eventImage} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.eventTitle} numberOfLines={1}>{event.name}</Text>
            <Text style={styles.eventDate}>{/* Format date/time */}
              {new Date(event.startTimeStamp).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </Text>
            <Text style={styles.eventTime}>
              {new Date(event.startTimeStamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
              {' - '}
              {new Date(event.endTimeStamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
            </Text>
          </View>
        </View>

        {/* Ticket categories */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
          {ticketCategories.map(cat => {
            const qty = quantities[cat.id] || 0;
            return (
              <View key={cat.id} style={styles.ticketRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.ticketTitle}>{cat.title}</Text>
                  <Text style={styles.ticketPrice}>${cat.price}</Text>
                  <Text style={styles.ticketDesc}>{cat.description}</Text>
                </View>
                <View style={styles.qtyBox}>
                  {qty > 0 ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center' ,backgroundColor:'#EDEFF4' , borderRadius: 8  }}>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => handleRemove(cat.id)}>
                        <Text style={styles.qtyBtnText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyCount}>{qty}</Text>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => handleAdd(cat.id, cat.maxTicketCount)}>
                        <Text style={styles.qtyBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.addBtn} onPress={() => handleAdd(cat.id, cat.maxTicketCount)}>
                      <Plus color="#fff" size={24} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sub total</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Transaction fee (10%)</Text>
            <Text style={styles.summaryValue}>${transactionFee.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabelBold}>Total</Text>
            <Text style={styles.summaryValueBold}>${total.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={[styles.checkoutBtn, { backgroundColor: subtotal > 0 ? '#18104B' : '#C7C7D9' }]}
            disabled={subtotal === 0}
          >
            <Text style={styles.checkoutBtnText}>
              {subtotal > 0 ? `Checkout - $${total.toFixed(2)}` : 'Checkout'}
            </Text>
          </TouchableOpacity>
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
    maxWidth: 400,
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
  },
  headerTitle: {
    marginTop: normalize(30),
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
    width: 40,
    height: 40,
    borderRadius: 8,
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
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#0C0453',
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
    marginTop: 16,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: normalize(40),
  },
  checkoutBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
});

export default EventTicketsScreen; 