import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { X } from 'lucide-react-native';

interface EventDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  aboutText: string;
  lineup: string[];
  ageLimit: string;
  note: string;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ visible, onClose, aboutText, lineup, ageLimit, note }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X color="#222" size={28} />
          </TouchableOpacity>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>About this event</Text>
            <Text style={styles.about}>{aboutText}</Text>
            <Text style={styles.sectionLabel}>Line-up</Text>
            {lineup.map((artist, idx) => (
              <Text key={idx} style={styles.lineupItem}>• {artist}</Text>
            ))}
            <Text style={styles.sectionLabel}>Age Limit</Text>
            <Text style={styles.ageLimit}>18+ only. ID required at entry.</Text>
            <Text style={styles.sectionLabel}>Note</Text>
            <Text style={styles.note}>{note}</Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 24,
    minHeight: '60%',
    maxHeight: '90%',
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 12,
    color: '#222',
    marginTop: 24,
  },
  about: {
    color: '#222',
    fontSize: 15,
    marginBottom: 18,
  },
  sectionLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 18,
    marginBottom: 6,
    color: '#222',
  },
  lineupItem: {
    color: '#222',
    fontSize: 15,
    marginLeft: 8,
    marginBottom: 2,
  },
  ageLimit: {
    color: '#0D1117',
    fontWeight: '400',
    fontSize: 15,
    marginBottom: 10,
  },
  note: {
    color: '#444',
    fontSize: 14,
    marginBottom: 20,
  },
});

export default EventDetailsModal; 